import { createContentDatabase, parseManifest, type ContentDatabase } from "./database.ts";
import { documentReferences, parseLu } from "./parser.ts";
import { contentKey, ContentValidationError, freezeContent, sourceRevision, type ContentDocument, type ContentKey, type ContentLocale } from "./types.ts";
import { isPublicPath } from "./validation.ts";
import type { WidgetRegistry } from "./widgets.ts";
import { siteWidgets } from "./site-widgets.ts";

export interface ContentClientOptions {
  basePath?: string;
  fetch?: typeof globalThis.fetch;
  widgets?: WidgetRegistry;
}

// Importável no navegador. O filesystem fica exclusivamente em node/.
export function createContentClient(options: ContentClientOptions = {}) {
  const request = options.fetch ?? globalThis.fetch;
  const registry = options.widgets ?? siteWidgets;
  const base = options.basePath ?? "/";
  if (base !== "/" && !isPublicPath(base)) throw new Error("basePath precisa ser um caminho público local.");
  const publicUrl = (path: string) => `${base.replace(/\/$/u, "")}${path}`;
  let database: Promise<ContentDatabase> | undefined;
  const documents = new Map<ContentKey, Promise<ContentDocument>>();

  function load(): Promise<ContentDatabase> {
    if (!database) {
      database = (async () => {
        const response = await request(publicUrl("/content/index.json"));
        if (!response.ok) throw new Error(`Índice de conteúdo indisponível: HTTP ${response.status}.`);
        return createContentDatabase(parseManifest(await response.json()).entries);
      })();
      const pending = database;
      void pending.catch(() => { if (database === pending) database = undefined; });
    }
    return database;
  }

  async function article(key: ContentKey, locale: ContentLocale = "en"): Promise<ContentDocument> {
    const db = await load();
    const entry = db.get(key, locale);
    if (!entry) throw new Error(`Conteúdo inexistente: ${key}.`);
    const cacheKey = entry.key;
    const cached = documents.get(cacheKey);
    if (cached) return cached;
    const pending = (async () => {
      const response = await request(publicUrl(entry.path));
      if (!response.ok) throw new Error(`${entry.path}: HTTP ${response.status}.`);
      const source = await response.text();
      if (sourceRevision(source) !== entry.revision) throw new Error(`${entry.path}: índice desatualizado; execute content:prepare.`);
      const document = parseLu(source, entry.path);
      if (contentKey(document.metadata) !== entry.key || JSON.stringify(document.metadata) !== JSON.stringify(entry.metadata)) throw new Error(`${entry.path}: metadados diferentes do índice.`);
      const references = documentReferences(document);
      for (const block of document.blocks) {
        if (block.type !== "widget") continue;
        const definition = registry.get(block.name);
        const messages = definition?.validate(block.props) ?? [`Widget desconhecido: ${block.name}.`];
        if (messages.length) throw new ContentValidationError(messages.map((message) => ({ source: entry.path, field: "widget", line: block.line, message })));
        references.push(...(definition!.references?.(block.props) ?? []));
      }
      if (references.some((target) => !db.get(target, document.metadata.locale))) throw new Error(`${entry.path}: referência inexistente.`);
      if (JSON.stringify([...new Set(references)].sort()) !== JSON.stringify([...entry.references].sort())) throw new Error(`${entry.path}: referências diferentes do índice.`);
      return freezeContent(document);
    })();
    documents.set(cacheKey, pending);
    void pending.catch(() => { if (documents.get(cacheKey) === pending) documents.delete(cacheKey); });
    return pending;
  }

  return Object.freeze({
    load,
    document: article,
    clear: () => { database = undefined; documents.clear(); },
  });
}
