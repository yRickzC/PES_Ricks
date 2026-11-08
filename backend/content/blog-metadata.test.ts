import { describe, expect, it } from "vitest";
import { parseLu } from "./parser.ts";
import { parseManifest } from "./database.ts";
import { config, entry, metadata } from "./test-fixtures.ts";

describe("metadados editoriais opcionais do Blog", () => {
  it("preserva destaque, ordem, keywords e atualização no índice LU", () => {
    const article = entry({ featured: true, featuredOrder: 0, keywords: ["world generation", "sistemas"], updatedAt: "2026-11-03" });
    expect(parseManifest({ version: 1, entries: [article] }).entries[0].metadata).toMatchObject({ featured: true, featuredOrder: 0, keywords: ["world generation", "sistemas"], updatedAt: "2026-11-03" });
  });

  it("suporta aliases PT-BR e lista de palavras-chave em texto", () => {
    const source = config(metadata()).replace("version: 1", "version: 1\ndestaque: true\nordem-destaque: 2\npalavras-chave: compiladores, geração de mundos\natualizado-em: 2026-11-03");
    expect(parseLu(source).metadata).toMatchObject({ featured: true, featuredOrder: 2, keywords: ["compiladores", "geração de mundos"], updatedAt: "2026-11-03" });
  });

  it.each<[Record<string, unknown>, string]>([
    [{ featured: "true" }, "featured"], [{ featuredOrder: -1 }, "featuredOrder"],
    [{ featuredOrder: 1.5 }, "featuredOrder"], [{ keywords: [""] }, "keywords"],
    [{ keywords: "nao-e-lista" }, "keywords"], [{ updatedAt: "2026-02-30" }, "updatedAt"],
    [{ kind: "service", featured: true }, "featured"], [{ kind: "service", featuredOrder: 1 }, "featuredOrder"],
    [{ kind: "project", keywords: ["web"] }, "keywords"], [{ kind: "service", keywords: ["web"] }, "keywords"],
  ])("rejeita configuração editorial inválida %j", (overrides, field) => {
    // parseMetadata validates manifest data; parser additionally allows comma-separated keyword strings.
    const item = { ...metadata(), ...overrides };
    expect(() => parseManifest({ version: 1, entries: [{ ...entry(), metadata: item }] })).toThrow(`[${field}]`);
  });

  it("mantém compatibilidade com artigos sem configuração editorial", () => {
    const value = parseLu(config(metadata())).metadata;
    for (const field of ["featured", "featuredOrder", "keywords", "updatedAt"]) expect(Object.hasOwn(value, field)).toBe(false);
  });

  it("permite destaques em projetos sem liberar os campos exclusivos do Blog", () => {
    const project = entry({ kind: "project", featured: true, featuredOrder: 2 });
    expect(parseManifest({ version: 1, entries: [project] }).entries[0].metadata).toMatchObject({ kind: "project", featured: true, featuredOrder: 2 });
  });
});
