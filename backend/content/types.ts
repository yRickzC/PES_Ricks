import type { ProjectStatus } from "../projects/project-status.ts";

export const contentKinds = ["article", "project", "service", "location", "changelog"] as const;
export type ContentKind = (typeof contentKinds)[number];
export type ContentLocale = "en" | "pt-br";
export type ContentKey = `${ContentKind}:${string}`;
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export interface ContentMetadata {
  version: 1;
  kind: ContentKind;
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  tags: string[];
  contentType?: string;
  categories?: string[];
  locale?: ContentLocale;
  date?: string;
  // Metadados editoriais opcionais, exclusivos de artigos do Blog.
  updatedAt?: string;
  keywords?: string[];
  // Destaques compartilhados por artigos e projetos.
  featured?: boolean;
  featuredOrder?: number;
  status?: ProjectStatus;
  layout?: string;
  youtube?: string;
  links: { label: string; url: string }[];
  relations: ContentKey[];
}

export type Inline =
  | { type: "text" | "code" | "strong" | "emphasis"; value: string }
  | { type: "link" | "image"; label: string; url: string }
  | { type: "reference"; target: ContentKey; label?: string };

export type ContentBlock =
  | { type: "heading"; level: number; content: Inline[] }
  | { type: "paragraph" | "quote"; content: Inline[] }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "code"; language: string; filename?: string; value: string }
  | { type: "separator" }
  | { type: "widget"; name: string; props: JsonObject; line: number };

export interface ContentDocument {
  metadata: ContentMetadata;
  blocks: ContentBlock[];
  source: string;
}

export interface ContentEntry {
  key: ContentKey;
  path: string;
  revision: string;
  metadata: ContentMetadata;
  references: ContentKey[];
}

export interface ContentManifest {
  version: 1;
  entries: ContentEntry[];
}

export interface ContentIssue {
  source: string;
  field: string;
  message: string;
  line?: number;
}

export class ContentValidationError extends Error {
  readonly issues: ContentIssue[];

  constructor(issues: ContentIssue[]) {
    super(issues.map((issue) => `${issue.source}${issue.line ? `:${issue.line}` : ""} [${issue.field}] ${issue.message}`).join("\n"));
    this.name = "ContentValidationError";
    this.issues = issues;
  }
}

export function contentIdentity(metadata: Pick<ContentMetadata, "kind" | "id">): ContentKey {
  return `${metadata.kind}:${metadata.id}`;
}

export function contentKey(metadata: Pick<ContentMetadata, "kind" | "id" | "locale">): ContentKey {
  return `${contentIdentity(metadata)}${metadata.locale ? `@${metadata.locale}` : ""}`;
}

// Detecta índice antigo; não é assinatura criptográfica nem mecanismo de autorização.
export function sourceRevision(source: string): string {
  let hash = 2166136261;
  for (let index = 0; index < source.length; index++) {
    hash = Math.imul(hash ^ source.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function freezeContent<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeContent(child);
    Object.freeze(value);
  }
  return value;
}
