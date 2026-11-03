import { describe, expect, it } from "vitest";
import { createContentDatabase, parseManifest } from "./database.ts";
import { parseLu } from "./parser.ts";
import { contentCategories, resolveContentType, taxonomyTypes } from "./taxonomy.ts";
import { config, entry, lu, metadata } from "./test-fixtures.ts";

describe("taxonomia do conteúdo", () => {
  it("mantém nome e SVG disponíveis para todos os tipos e categorias nos dois idiomas", () => {
    for (const locale of ["en", "pt-br"] as const) {
      for (const type of taxonomyTypes(locale)) {
        for (const named of [type, ...type.categories]) {
          expect(named.label.trim()).not.toBe("");
          expect(named.icon.path.trim()).not.toBe("");
        }
        const values = type.categories.map(({ value }) => value);
        expect(new Set(values).size).toBe(values.length);
      }
    }
  });

  it("aceita categorias explícitas no Config e conserva a separação de tags", () => {
    const source = lu({ categories: ["dev-log", "experiments"], contentType: "blog", tags: ["roblox"] });
    const document = parseLu(source);
    expect(document.metadata.categories).toEqual(["dev-log", "experiments"]);
    expect(document.metadata.tags).toEqual(["roblox"]);
    expect(contentCategories(document.metadata, "pt-br").map(({ value }) => value))
      .toEqual(["blog:dev-log", "blog:experiments"]);
    const aliasSource = config(metadata()).replace("version: 1", "version: 1\ncategorias: dev-log, experiments\ntipo-conteudo: blog");
    expect(parseLu(aliasSource).metadata.categories).toEqual(["dev-log", "experiments"]);
  });

  it.each<[Record<string, unknown>, string]>([
    [{ kind: "service", categories: ["ai"] }, "categories"],
    [{ categories: ["article", "article"] }, "categories"],
    [{ categories: ["nao-cadastrada"] }, "categories"],
    [{ contentType: "service" }, "contentType"],
    [{ contentType: "home" }, "contentType"],
    [{ contentType: 42 }, "contentType"],
  ])("rejeita categoria ou tipo incompatível: %j", (overrides, field) => {
    expect(() => parseLu(config({ ...metadata(), ...overrides }))).toThrow(`[${field}]`);
  });

  it("preserva metadados antigos e oferece fallback de formato somente para blogs", () => {
    const oldEntry = entry();
    expect(parseManifest({ version: 1, entries: [oldEntry] }).entries[0]!.metadata).toEqual(oldEntry.metadata);
    expect(Object.hasOwn(oldEntry.metadata, "categories")).toBe(false);
    expect(contentCategories(oldEntry.metadata, "en").map(({ id }) => id)).toEqual(["article"]);
    expect(contentCategories({ kind: "article", youtube: "abcdefghijk" }, "en").map(({ id }) => id)).toEqual(["youtube"]);
    expect(contentCategories({ kind: "article", categories: [] }, "en")).toEqual([]);
    expect(contentCategories({ kind: "service" }, "en")).toEqual([]);
    expect(resolveContentType("project")).toBe("project");
    expect(resolveContentType("project", "blog")).toBeUndefined();
  });

  it("consulta categorias e tipo em conjunto no catálogo de conteúdo", () => {
    const article = entry({ id: "artigo", categories: ["article"], tags: ["offline"] });
    const project = entry({ kind: "project", id: "sistema", categories: ["systems"] });
    const service = entry({ kind: "service", id: "sistema", categories: ["internal-systems"] });
    const database = createContentDatabase([article, project, service]);
    expect(database.list({ contentType: "project", categories: ["systems"] }).map(({ key }) => key)).toEqual([project.key]);
    expect(database.list({ contentType: "service", categories: ["systems"] })).toEqual([]);
    expect(database.list({ contentType: "blog", categories: ["article"], tags: ["offline"] }).map(({ key }) => key)).toEqual([article.key]);
    expect(database.card(service.key)?.categories).toEqual(["internal-systems"]);
  });
});
