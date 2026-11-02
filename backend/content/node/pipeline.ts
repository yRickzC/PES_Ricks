import { lstat, mkdir, readFile, readdir, realpath, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { createContentDatabase } from "../database.ts";
import { documentInlines, documentReferences, parseLu } from "../parser.ts";
import { contentKey, ContentValidationError, sourceRevision, type ContentDocument, type ContentEntry, type ContentIssue, type ContentManifest } from "../types.ts";
import { isPublicPath } from "../validation.ts";
import type { WidgetRegistry } from "../widgets.ts";
import { siteWidgets } from "../site-widgets.ts";

export interface PublicContent {
  manifest: ContentManifest;
  documents: ReadonlyMap<string, ContentDocument>;
  database: ReturnType<typeof createContentDatabase>;
}

function within(root: string, path: string): boolean {
  const child = relative(root, path);
  return !isAbsolute(child) && child !== ".." && !child.startsWith(`..${sep}`);
}

export async function readPublicContent(publicDir: string, registry: WidgetRegistry = siteWidgets): Promise<PublicContent> {
  const root = await realpath(resolve(publicDir));
  const contentDir = join(root, "content");
  const issues: ContentIssue[] = [];
  const entries: ContentEntry[] = [];
  const documents = new Map<string, ContentDocument>();
  const assets = new Map<string, Promise<void>>();
  const record = (error: unknown, source: string) => {
    if (error instanceof ContentValidationError) issues.push(...error.issues);
    else issues.push({ source, field: "file", message: error instanceof Error ? error.message : String(error) });
  };
  async function verifyAsset(url: string, source: string) {
    if (!url.startsWith("/")) return;
    let check = assets.get(url);
    if (!check) {
      check = (async () => {
        const path = await realpath(join(root, url.slice(1)));
        if (!within(root, path) || !(await lstat(path)).isFile()) throw new Error(`Imagem fora de public ou não é arquivo: ${url}.`);
      })();
      assets.set(url, check);
    }
    try { await check; } catch { issues.push({ source, field: "image", message: `Imagem local inexistente ou fora de public: ${url}.` }); }
  }

  async function scan(directory: string) {
    const children = await readdir(directory, { withFileTypes: true });
    children.sort((a, b) => a.name.localeCompare(b.name));
    for (const child of children) {
      const path = join(directory, child.name);
      const url = `/${relative(root, path).split(sep).join("/")}`;
      if (child.isSymbolicLink()) { issues.push({ source: url, field: "file", message: "Links simbólicos não são permitidos no banco de conteúdo." }); continue; }
      if (child.isDirectory()) { await scan(path); continue; }
      if (!child.isFile() || !/\.lu$/iu.test(child.name)) continue;
      if (!isPublicPath(url) || !url.endsWith(".lu")) { issues.push({ source: url, field: "path", message: "Use caminhos ASCII sem espaços, com extensão .lu minúscula." }); continue; }
      try {
        const source = await readFile(path, "utf8");
        const document = parseLu(source, url);
        const references = documentReferences(document);
        for (const block of document.blocks) {
          if (block.type !== "widget") continue;
          const widget = registry.get(block.name);
          const errors = widget?.validate(block.props) ?? [`Widget desconhecido: ${block.name}.`];
          issues.push(...errors.map((message) => ({ source: url, field: "widget", line: block.line, message })));
          if (!errors.length) references.push(...(widget!.references?.(block.props) ?? []));
        }
        await verifyAsset(document.metadata.image.src, url);
        for (const inline of documentInlines(document)) if (inline.type === "image") await verifyAsset(inline.url, url);
        entries.push({ key: contentKey(document.metadata), path: url, revision: sourceRevision(source), metadata: document.metadata, references: [...new Set(references)] });
        documents.set(url, document);
      } catch (error) { record(error, url); }
    }
  }

  let contentExists = false;
  try {
    const stat = await lstat(contentDir);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("public/content precisa ser um diretório real.");
    contentExists = true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") record(error, "/content");
  }
  // Só a ausência inicial de content/ representa um catálogo vazio.
  // Falhas durante a descoberta precisam impedir a publicação do índice.
  if (contentExists) {
    try { await scan(contentDir); } catch (error) { record(error, "/content"); }
  }
  let database: ReturnType<typeof createContentDatabase> | undefined;
  try { database = createContentDatabase(entries); } catch (error) { record(error, "/content"); }
  if (issues.length) throw new ContentValidationError(issues);
  return { manifest: { version: 1, entries }, documents, database: database! };
}

export async function preparePublicContent(publicDir: string, registry?: WidgetRegistry): Promise<PublicContent> {
  // Valida tudo antes de substituir o índice. Erros nunca publicam um índice parcial.
  const result = await readPublicContent(publicDir, registry);
  const path = resolve(publicDir, "content/index.json");
  const json = `${JSON.stringify(result.manifest, null, 2)}\n`;
  let existing: string | undefined;
  try { existing = await readFile(path, "utf8"); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
  if (existing !== json) {
    await mkdir(dirname(path), { recursive: true });
    const temporary = `${path}.${randomUUID()}.tmp`;
    await writeFile(temporary, json, "utf8");
    await rename(temporary, path);
  }
  return result;
}
