import { isProjectStatus } from "../projects/project-status.ts";
import { sourceLocale } from "./locale.ts";
import { contentTaxonomy, resolveContentType } from "./taxonomy.ts";
import {
  contentKinds, ContentValidationError,
  type ContentKey, type ContentMetadata, type ContentIssue,
} from "./types.ts";

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isContentKey(value: unknown): value is ContentKey {
  return typeof value === "string" && /^(article|project|service|location|changelog):[a-z0-9]+(?:-[a-z0-9]+)*(?:@(?:en|pt-br))?$/u.test(value);
}

export function isPublicPath(value: string): boolean {
  // Só caminhos absolutos locais, sem encoding, query, fragmento ou segmentos relativos.
  return value === "/" || (/^\/(?!\/)[a-zA-Z0-9_./-]+$/u.test(value) && !value.includes("//")
    && value.split("/").every((segment) => segment !== "." && segment !== ".."));
}

export function isSafeUrl(value: string, image = false): boolean {
  if (isPublicPath(value)) return !image || /\.(avif|gif|jpe?g|png|svg|webp)$/iu.test(value);
  if (!image && /^#[a-zA-Z0-9_-]+$/u.test(value)) return true;
  if (/\s|[\u0000-\u001f\u007f\\]/u.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function parseMetadata(raw: unknown, source: string): ContentMetadata {
  const issues: ContentIssue[] = [];
  const fail = (field: string, message: string) => issues.push({ source, field, message });
  if (!isObject(raw)) throw new ContentValidationError([{ source, field: "metadata", message: "Metadados inválidos." }]);
  const allowed = new Set(["version", "kind", "id", "title", "description", "image", "tags", "contentType", "categories", "locale", "date", "updatedAt", "keywords", "featured", "featuredOrder", "status", "layout", "youtube", "links", "relations"]);
  for (const field of Object.keys(raw)) if (!allowed.has(field)) fail(field, "Campo desconhecido na configuração LU.");
  const text = (field: string): string => {
    const value = raw[field];
    if (typeof value !== "string" || !value.trim()) {
      fail(field, "Informe um texto não vazio.");
      return "";
    }
    if (/\b(TODO|TBD|CHANGEME|PREENCHER)\b/iu.test(value)) fail(field, "Substitua o valor provisório do preset.");
    return value.trim();
  };
  if (raw.version !== 1) fail("version", "A versão suportada é 1.");
  if (!(contentKinds as readonly unknown[]).includes(raw.kind)) fail("kind", `Use ${contentKinds.join(", ")}.`);
  const id = text("id");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) fail("id", "Use letras minúsculas, números e hífens, sem espaços.");
  const title = text("title");
  const description = text("description");
  let image = { src: "", alt: "" };
  if (!isObject(raw.image) || typeof raw.image.src !== "string" || !isSafeUrl(raw.image.src, true)
    || typeof raw.image.alt !== "string" || !raw.image.alt.trim()) {
    fail("image", "Informe { src, alt } com caminho em public ou URL HTTPS e descrição não vazia.");
  } else {
    image = { src: raw.image.src, alt: raw.image.alt.trim() };
    if (/\b(TODO|TBD|CHANGEME|PREENCHER)\b/iu.test(`${image.src} ${image.alt}`)) fail("image", "Substitua a imagem provisória do preset.");
  }
  const tags: string[] = [];
  if (!Array.isArray(raw.tags) || !raw.tags.length) fail("tags", "Informe pelo menos uma tag.");
  else for (const tag of raw.tags) {
    if (typeof tag !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(tag)
      || /^(todo|tbd|changeme|preencher)$/u.test(tag)) fail("tags", "Tags precisam ser slugs preenchidos, como game-design.");
    else if (tags.includes(tag)) fail("tags", `Tag repetida: ${tag}.`);
    else tags.push(tag);
  }
  const type = resolveContentType(raw.kind as ContentMetadata["kind"], typeof raw.contentType === "string" ? raw.contentType : undefined);
  if (raw.contentType !== undefined && (typeof raw.contentType !== "string" || !type)) {
    fail("contentType", "Informe um tipo cadastrado e compatível com kind.");
  }
  const categories: string[] = [];
  if (raw.categories !== undefined) {
    if (!Array.isArray(raw.categories)) fail("categories", "Informe uma lista de IDs de categorias do tipo selecionado.");
    else for (const category of raw.categories) {
      if (typeof category !== "string" || !type || !Object.hasOwn(contentTaxonomy[type].categories, category)) {
        fail("categories", `Categoria não cadastrada neste tipo: ${String(category)}.`);
      } else if (categories.includes(category)) fail("categories", `Categoria repetida: ${category}.`);
      else categories.push(category);
    }
  }
  const relations: ContentKey[] = [];
  if (raw.relations !== undefined) {
    if (!Array.isArray(raw.relations)) fail("relations", "Informe uma lista de chaves, como project:meu-jogo.");
    else for (const target of raw.relations) {
      if (!isContentKey(target)) fail("relations", `Referência inválida: ${String(target)}.`);
      else if (relations.includes(target)) fail("relations", `Referência repetida: ${target}.`);
      else relations.push(target);
    }
  }
  const links: ContentMetadata["links"] = [];
  if (raw.links !== undefined) {
    if (!Array.isArray(raw.links)) fail("links", "Informe uma lista de { label, url }.");
    else for (const link of raw.links) {
      if (!isObject(link) || typeof link.label !== "string" || !link.label.trim() || typeof link.url !== "string" || !isSafeUrl(link.url)) fail("links", "Link precisa de label e URL HTTPS ou caminho público.");
      else links.push({ label: link.label.trim(), url: link.url });
    }
  }
  if (raw.locale !== undefined && raw.locale !== "en" && raw.locale !== "pt-br") fail("locale", "Use en ou pt-br.");
  const filenameLocale = sourceLocale(source);
  if (filenameLocale && raw.locale !== filenameLocale) fail("locale", "O idioma precisa corresponder ao sufixo do arquivo.");
  for (const field of ["date", "updatedAt"] as const) if (raw[field] !== undefined) {
    const date = raw[field];
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(date)
      || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) fail(field, "Use uma data real no formato AAAA-MM-DD.");
  }
  for (const field of ["updatedAt", "keywords"]) {
    if (raw[field] !== undefined && raw.kind !== "article") fail(field, "Campo editorial exclusivo de artigos do Blog.");
  }
  for (const field of ["featured", "featuredOrder"]) {
    if (raw[field] !== undefined && raw.kind !== "article" && raw.kind !== "project") fail(field, "Destaques são exclusivos de artigos e projetos.");
  }
  if (raw.keywords !== undefined && (!Array.isArray(raw.keywords) || !raw.keywords.every((keyword) => typeof keyword === "string" && keyword.trim()))) fail("keywords", "Informe uma lista de palavras-chave não vazias.");
  if (raw.featured !== undefined && typeof raw.featured !== "boolean") fail("featured", "Use true ou false.");
  if (raw.featuredOrder !== undefined && (typeof raw.featuredOrder !== "number" || !Number.isSafeInteger(raw.featuredOrder) || raw.featuredOrder < 0)) fail("featuredOrder", "Use um inteiro não negativo.");
  if (raw.kind === "changelog" && raw.date === undefined) fail("date", "Changelogs precisam de uma data.");
  if (raw.status !== undefined && (raw.kind !== "project" || typeof raw.status !== "string" || !isProjectStatus(raw.status))) fail("status", "Use um estado canônico somente em projetos.");
  if (raw.layout !== undefined && (typeof raw.layout !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(raw.layout))) fail("layout", "Use o identificador de um layout, como project-detail.");
  if (raw.youtube !== undefined && (typeof raw.youtube !== "string" || !/^[a-zA-Z0-9_-]{11}$/u.test(raw.youtube))) fail("youtube", "Informe somente o ID do vídeo, com 11 caracteres.");
  if (issues.length) throw new ContentValidationError(issues);
  return {
    version: 1, kind: raw.kind as ContentMetadata["kind"], id, title, description, image, tags, relations, links,
    ...(raw.contentType === undefined ? {} : { contentType: raw.contentType as string }),
    ...(raw.categories === undefined ? {} : { categories }),
    ...(raw.locale === undefined ? {} : { locale: raw.locale as ContentMetadata["locale"] }),
    ...(raw.date === undefined ? {} : { date: raw.date as string }),
    ...(raw.updatedAt === undefined ? {} : { updatedAt: raw.updatedAt as string }),
    ...(raw.keywords === undefined ? {} : { keywords: (raw.keywords as string[]).map((keyword) => keyword.trim()) }),
    ...(raw.featured === undefined ? {} : { featured: raw.featured as boolean }),
    ...(raw.featuredOrder === undefined ? {} : { featuredOrder: raw.featuredOrder as number }),
    ...(raw.status === undefined ? {} : { status: raw.status as ContentMetadata["status"] }),
    ...(raw.layout === undefined ? {} : { layout: raw.layout as string }),
    ...(raw.youtube === undefined ? {} : { youtube: raw.youtube as string }),
  };
}
