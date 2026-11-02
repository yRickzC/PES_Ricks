import { contentKey, sourceRevision, type ContentEntry, type ContentMetadata } from "./types.ts";
import { documentReferences, parseLu } from "./parser.ts";

export function metadata(overrides: Partial<ContentMetadata> = {}): ContentMetadata {
  return {
    version: 1, kind: "article", id: "experimento", title: "Experimento Roblox",
    description: "Anotações sobre criação de jogos.",
    image: { src: "/images/cover.svg", alt: "Capa do experimento" },
    tags: ["game-design"], relations: [], links: [], ...overrides,
  };
}

export function lu(overrides: Partial<ContentMetadata> = {}, body = "# Experimento\n\nConteúdo do artigo."): string {
  return `${config(metadata(overrides))}\n${body}\n`;
}

export function config(value: object): string {
  const lines: string[] = [];
  const visit = (path: string, item: unknown) => {
    if (Array.isArray(item) && item.every((child) => child === null || typeof child !== "object")) lines.push(`${path}: [${item.map((child) => JSON.stringify(child)).join(", ")}]`);
    else if (item !== null && typeof item === "object") for (const [key, child] of Object.entries(item)) visit(path ? `${path}.${key}` : key, child);
    else if (item !== undefined) lines.push(`${path}: ${JSON.stringify(item)}`);
  };
  visit("", value);
  return `\x60\x60\x60$Config\n${lines.join("\n")}\n\x60\x60\x60`;
}

export function entry(overrides: Partial<ContentMetadata> = {}, body?: string): ContentEntry {
  const source = lu(overrides, body);
  const document = parseLu(source);
  return { key: contentKey(document.metadata), metadata: document.metadata, path: `/content/${document.metadata.kind}/${document.metadata.id}${document.metadata.locale ? `.${document.metadata.locale.replace("-", "_")}` : ""}.lu`, revision: sourceRevision(source), references: documentReferences(document) };
}
