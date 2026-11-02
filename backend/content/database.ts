import { matchesSearch } from "../search/search.ts";
import { contentIdentity, contentKey, ContentValidationError, freezeContent, type ContentEntry, type ContentKey, type ContentKind, type ContentLocale, type ContentManifest, type ContentIssue } from "./types.ts";
import { isContentKey, isObject, isPublicPath, parseMetadata } from "./validation.ts";

export interface ContentQuery {
  kind?: ContentKind;
  tags?: readonly string[];
  locale?: "en" | "pt-br";
  search?: string;
  relatedTo?: ContentKey;
}

export interface ContentEdge {
  source: ContentKey;
  target: ContentKey;
  type: "relation" | "reference";
}

export function parseManifest(raw: unknown, source = "/content/index.json"): ContentManifest {
  if (!isObject(raw) || raw.version !== 1 || !Array.isArray(raw.entries)) {
    throw new ContentValidationError([{ source, field: "manifest", message: "Índice inválido; gere novamente com content:prepare." }]);
  }
  const entries = raw.entries.map((value, index): ContentEntry => {
    const field = `entries[${index}]`;
    if (!isObject(value) || !isContentKey(value.key) || typeof value.path !== "string"
      || !isPublicPath(value.path) || !value.path.startsWith("/content/") || !value.path.endsWith(".lu")
      || typeof value.revision !== "string" || !/^[a-f0-9]{8}$/u.test(value.revision)
      || !Array.isArray(value.references) || !value.references.every(isContentKey)) {
      throw new ContentValidationError([{ source, field, message: "Entrada inválida no índice." }]);
    }
    const metadata = parseMetadata(value.metadata, value.path);
    if (contentKey(metadata) !== value.key) throw new ContentValidationError([{ source, field, message: "Chave diferente dos metadados." }]);
    return { key: value.key, path: value.path, revision: value.revision, metadata, references: [...new Set(value.references)] };
  });
  return { version: 1, entries };
}

export function createContentDatabase(input: readonly ContentEntry[]) {
  const entries = freezeContent(structuredClone([...input]));
  const byKey = new Map<ContentKey, ContentEntry>();
  const byIdentity = new Map<ContentKey, ContentEntry[]>();
  const byTag = new Map<string, Set<ContentKey>>();
  const byKind = new Map<ContentKind, Set<ContentKey>>();
  const neighbors = new Map<ContentKey, Set<ContentKey>>();
  const paths = new Set<string>();
  const edges: ContentEdge[] = [];
  const issues: ContentIssue[] = [];
  for (const entry of entries) {
    if (byKey.has(entry.key)) issues.push({ source: entry.path, field: "id", message: `Chave duplicada: ${entry.key}.` });
    if (paths.has(entry.path)) issues.push({ source: entry.path, field: "path", message: "Caminho duplicado no índice." });
    paths.add(entry.path);
    byKey.set(entry.key, entry);
    const identity = contentIdentity(entry.metadata);
    const translations = byIdentity.get(identity) ?? [];
    translations.push(entry);
    byIdentity.set(identity, translations);
    const kinds = byKind.get(entry.metadata.kind) ?? new Set<ContentKey>();
    kinds.add(entry.key);
    byKind.set(entry.metadata.kind, kinds);
    for (const tag of entry.metadata.tags) {
      const keys = byTag.get(tag) ?? new Set<ContentKey>();
      keys.add(entry.key);
      byTag.set(tag, keys);
    }
  }
  function get(key: ContentKey, locale: ContentLocale = "en"): ContentEntry | undefined {
    if (key.includes("@")) return byKey.get(key);
    return byKey.get(`${key}@${locale}`) ?? byKey.get(key) ?? byKey.get(`${key}@en`);
  }
  for (const entry of entries) {
    for (const type of ["relation", "reference"] as const) {
      for (const reference of new Set(type === "relation" ? entry.metadata.relations : entry.references)) {
        const resolved = get(reference, entry.metadata.locale);
        const target = resolved?.key;
        if (!resolved || !target) issues.push({ source: entry.path, field: type, message: `Destino inexistente no idioma do conteúdo: ${reference}.` });
        else if (contentIdentity(resolved.metadata) === contentIdentity(entry.metadata)) issues.push({ source: entry.path, field: type, message: "Conteúdo não pode referenciar a si mesmo." });
        else {
          edges.push({ source: entry.key, target, type });
          for (const [a, b] of [[entry.key, target], [target, entry.key]] as const) {
            const keys = neighbors.get(a) ?? new Set<ContentKey>();
            keys.add(b);
            neighbors.set(a, keys);
          }
        }
      }
    }
  }
  if (issues.length) throw new ContentValidationError(issues);

  function list(query: ContentQuery = {}): ContentEntry[] {
    const groups: Set<ContentKey>[] = [];
    if (query.kind) groups.push(byKind.get(query.kind) ?? new Set());
    for (const tag of query.tags ?? []) groups.push(byTag.get(tag) ?? new Set());
    if (query.relatedTo) groups.push(neighbors.get(get(query.relatedTo, query.locale)?.key ?? query.relatedTo) ?? new Set());
    groups.sort((a, b) => a.size - b.size);
    const candidates = groups.length ? [...groups[0]!].map((key) => byKey.get(key)!) : entries;
    return candidates.filter((entry) => groups.every((group) => group.has(entry.key))
      && (!query.locale || get(contentIdentity(entry.metadata), query.locale)?.key === entry.key)
      && (!query.search || matchesSearch(`${entry.metadata.title} ${entry.metadata.description} ${entry.metadata.tags.join(" ")}`, query.search)))
      .sort((a, b) => (b.metadata.date ?? "").localeCompare(a.metadata.date ?? "") || a.key.localeCompare(b.key));
  }

  function related(key: ContentKey, direction: "both" | "incoming" | "outgoing" = "both", locale?: ContentLocale): ContentEntry[] {
    key = get(key, locale)?.key ?? key;
    const keys = new Set(edges.flatMap((edge) => [
      ...(direction !== "incoming" && edge.source === key ? [edge.target] : []),
      ...(direction !== "outgoing" && edge.target === key ? [edge.source] : []),
    ]));
    return list({ locale }).filter((entry) => keys.has(entry.key));
  }

  return Object.freeze({
    get,
    translations: (key: ContentKey) => [...(byIdentity.get(key.split("@")[0] as ContentKey) ?? [])].sort((a, b) => a.key.localeCompare(b.key)),
    list,
    related,
    tags: () => [...byTag].map(([tag, keys]) => ({ tag, count: keys.size })).sort((a, b) => a.tag.localeCompare(b.tag)),
    graph: () => ({ nodes: [...entries], edges: edges.map((edge) => ({ ...edge })) }),
    timeline: (key?: ContentKey, locale?: ContentLocale) => list({ ...(key ? { relatedTo: key } : {}), locale }).filter((entry) => entry.metadata.date !== undefined),
    card: (key: ContentKey, preferredLocale?: ContentLocale) => {
      const entry = get(key, preferredLocale);
      if (!entry) return undefined;
      const { title, description, image, tags, kind, date, locale } = entry.metadata;
      return freezeContent({ key: entry.key, title, description, image, tags, kind, date, locale, sourceUrl: entry.path });
    },
    size: entries.length,
  });
}

export type ContentDatabase = ReturnType<typeof createContentDatabase>;
