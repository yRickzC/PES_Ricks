import type { ContentDatabase } from "./database.ts";
import { escapeHtml, safeHref } from "./html.ts";
import { contentIdentity, contentKinds, type ContentDocument, type ContentEntry, type ContentKey, type ContentLocale, type JsonObject } from "./types.ts";
import { normalizeWidgetName } from "./properties.ts";
import { isContentKey, isObject } from "./validation.ts";

export interface WidgetContext {
  database: ContentDatabase;
  current: ContentKey;
  locale?: ContentLocale;
  resolveHref?: (entry: ContentEntry) => string | undefined;
  resolveUrl?: (url: string) => string;
  // Snapshot já carregado pelo adaptador GitHub. O renderizador não faz rede.
  githubHistory?: ReadonlyMap<string, readonly ContentDocument[]>;
  renderDocument?: (document: ContentDocument) => string;
}

export interface WidgetDefinition {
  validate: (props: JsonObject) => string[];
  references?: (props: JsonObject) => ContentKey[];
  render: (props: JsonObject, context: WidgetContext) => string;
}

function only(props: JsonObject, allowed: string[]): string[] {
  return Object.keys(props).filter((key) => !allowed.includes(key)).map((key) => `Propriedade desconhecida: ${key}.`);
}

function targetErrors(props: JsonObject): string[] {
  return props.target !== undefined && !isContentKey(props.target) ? ["target precisa de uma chave como project:meu-jogo."] : [];
}

function itemHtml(entry: ContentEntry, context: WidgetContext): string {
  const href = context.resolveHref?.(entry);
  const label = escapeHtml(entry.metadata.title);
  return `<li data-content-key="${escapeHtml(entry.key)}">${entry.metadata.date ? `<time datetime="${entry.metadata.date}">${entry.metadata.date}</time> ` : ""}${href ? `<a href="${safeHref(href)}">${label}</a>` : label}<p>${escapeHtml(entry.metadata.description)}</p></li>`;
}

const collection: WidgetDefinition = {
  validate: (props) => [
    ...only(props, ["target", "kind", "limit"]), ...targetErrors(props),
    ...(props.kind !== undefined && !(contentKinds as readonly unknown[]).includes(props.kind) ? ["kind inválido."] : []),
    ...(props.limit !== undefined && (!Number.isInteger(props.limit) || Number(props.limit) < 1 || Number(props.limit) > 100) ? ["limit precisa ser um inteiro de 1 a 100."] : []),
  ],
  references: (props) => isContentKey(props.target) ? [props.target] : [],
  render: (props, context) => {
    const entries = context.database.related((props.target as ContentKey | undefined) ?? context.current, "both", context.locale)
      .filter((entry) => !props.kind || entry.metadata.kind === props.kind).slice(0, Number(props.limit ?? 20));
    return `<ul data-widget="related-content">${entries.map((entry) => itemHtml(entry, context)).join("")}</ul>`;
  },
};

const timeline: WidgetDefinition = {
  validate: (props) => [...only(props, ["target"]), ...targetErrors(props)],
  references: collection.references,
  render: (props, context) => `<ol data-widget="timeline">${context.database.timeline((props.target as ContentKey | undefined) ?? context.current, context.locale).map((entry) => itemHtml(entry, context)).join("")}</ol>`,
};

const youtube: WidgetDefinition = {
  validate: (props) => [
    ...only(props, ["id", "title"]),
    ...(typeof props.id !== "string" || !/^[a-zA-Z0-9_-]{11}$/u.test(props.id) ? ["id precisa ser um ID YouTube de 11 caracteres."] : []),
    ...(typeof props.title !== "string" || !props.title.trim() ? ["title precisa descrever o vídeo."] : []),
  ],
  render: (props) => `<iframe data-widget="youtube" src="https://www.youtube-nocookie.com/embed/${escapeHtml(String(props.id))}" title="${escapeHtml(String(props.title))}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`,
};

export function githubSnapshotKey(props: Pick<GithubWidgetProps, "owner" | "repo" | "ref" | "directory">): string {
  return JSON.stringify([props.owner, props.repo, props.ref, props.directory ?? ".github"]);
}

export interface GithubWidgetProps {
  owner: string;
  repo: string;
  ref: string;
  directory?: string;
}

export function githubPropsErrors(props: unknown): string[] {
  if (!isObject(props)) return ["Configuração GitHub inválida."];
  const errors: string[] = [];
  for (const key of ["owner", "repo"] as const) {
    if (typeof props[key] !== "string" || !/^[a-zA-Z0-9_.-]+$/u.test(props[key]) || props[key] === "." || props[key] === "..") errors.push(`${key} inválido.`);
  }
  if (typeof props.ref !== "string" || !props.ref.trim() || /[\s\u0000-\u001f?#\\]/u.test(props.ref)) errors.push("ref precisa identificar uma branch, tag ou commit.");
  if (props.directory !== undefined && (typeof props.directory !== "string" || !/^[a-zA-Z0-9_./-]+$/u.test(props.directory) || props.directory.split("/").some((part) => !part || part === "." || part === ".."))) errors.push("directory precisa ser um caminho relativo seguro.");
  return errors;
}

const github: WidgetDefinition = {
  validate: (props) => [...only(props, ["owner", "repo", "ref", "directory"]), ...githubPropsErrors(props)],
  render: (props, context) => {
    const key = githubSnapshotKey(props as unknown as GithubWidgetProps);
    const documents = context.githubHistory?.get(key);
    if (!documents) return '<section data-widget="github-history" data-state="unavailable"><p>Histórico indisponível.</p></section>';
    const locale = context.locale ?? "en";
    const selected = new Map<string, ContentDocument>();
    const rank = (document: ContentDocument) => document.metadata.locale === locale ? 3 : !document.metadata.locale ? 2 : document.metadata.locale === "en" ? 1 : 0;
    for (const document of documents) {
      const identity = contentIdentity(document.metadata);
      if (rank(document) && rank(document) > (selected.has(identity) ? rank(selected.get(identity)!) : 0)) selected.set(identity, document);
    }
    return `<ol data-widget="github-history" data-state="ready">${[...selected.values()].sort((a, b) => (b.metadata.date ?? "").localeCompare(a.metadata.date ?? "")).map((document) => `<li><time datetime="${escapeHtml(document.metadata.date ?? "")}">${escapeHtml(document.metadata.date ?? "")}</time><h3>${escapeHtml(document.metadata.title)}</h3><p>${escapeHtml(document.metadata.description)}</p>${context.renderDocument?.(document) ?? ""}</li>`).join("")}</ol>`;
  },
};

export function createWidgetRegistry(custom: Record<string, WidgetDefinition> = {}) {
  // Somente código confiável registra widgets; arquivos LU fornecem propriedades declarativas.
  const definitions = new Map<string, WidgetDefinition>(Object.entries({ "related-content": collection, timeline, youtube, "github-history": github, changelog: { ...collection, render: (props: JsonObject, context: WidgetContext) => collection.render({ ...props, kind: "changelog" }, context) } }));
  const names = new Set<string>();
  for (const [label, definition] of Object.entries(custom)) {
    const name = normalizeWidgetName(label);
    if (name === "config" || !/^[a-z][a-z0-9-]*$/u.test(name) || names.has(name)) throw new Error(`Nome de widget inválido, reservado ou repetido: ${label}.`);
    names.add(name);
    definitions.set(name, definition);
  }
  return Object.freeze({ get: (name: string) => definitions.get(normalizeWidgetName(name)), names: () => [...definitions.keys()].sort() });
}

export type WidgetRegistry = ReturnType<typeof createWidgetRegistry>;
