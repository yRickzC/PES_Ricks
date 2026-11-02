import { describe, expect, it } from "vitest";
import { createContentDatabase } from "../../../../backend/content/database.ts";
import { parseLu } from "../../../../backend/content/parser.ts";
import type { PublicContent } from "../../../../backend/content/node/pipeline.ts";
import type { ContentMetadata } from "../../../../backend/content/types.ts";
import { entry, lu } from "../../../../backend/content/test-fixtures.ts";
import { articleDate, articlePages } from "./articles";

function content(variants: Partial<ContentMetadata>[], body?: string): PublicContent {
  const entries = variants.map((variant) => entry(variant, body));
  return {
    manifest: { version: 1, entries },
    database: createContentDatabase(entries),
    documents: new Map(entries.map((item, index) => [item.path, parseLu(lu(variants[index], body), item.path)])),
  };
}

describe("páginas estáticas de artigos", () => {
  it("seleciona a tradução do mesmo ID e preserva o artigo no seletor", () => {
    const catalog = content([{ locale: "en", title: "Experiment" }, { locale: "pt-br", title: "Experimento" }]);
    const [page] = articlePages(catalog, "pt-br");
    expect(page.params.id).toBe("experimento");
    expect(page.props.document.metadata.title).toBe("Experimento");
    expect(page.props.languagePaths).toEqual({ en: "/blogs/experimento/", "pt-br": "/pt-br/blogs/experimento/" });
    expect(articlePages(catalog, "en")).toHaveLength(1);
  });

  it("gera o fallback inglês no português, sem publicar conteúdo só português em inglês", () => {
    const catalog = content([{ id: "english", locale: "en" }, { id: "portugues", locale: "pt-br" }]);
    expect(articlePages(catalog, "en").map((page) => page.params.id)).toEqual(["english"]);
    const portuguese = articlePages(catalog, "pt-br");
    expect(portuguese.map((page) => page.params.id)).toEqual(["english", "portugues"]);
    expect(portuguese[1].props.languagePaths).toEqual({ "pt-br": "/pt-br/blogs/portugues/" });
  });

  it("liga referências à tradução explícita e escapa HTML no corpo", () => {
    const catalog = content([{ id: "origem", locale: "pt-br" }, { id: "destino", locale: "en" }]);
    const source = catalog.manifest.entries.find((item) => item.metadata.id === "origem")!;
    const documents = new Map(catalog.documents);
    documents.set(source.path, parseLu(lu(source.metadata, "[[article:destino@en|Leia]]\n\n<script>alert(1)</script>"), source.path));
    const page = articlePages({ ...catalog, documents }, "pt-br").find((item) => item.params.id === "origem")!;
    expect(page.props.html).toContain('href="/blogs/destino/"');
    expect(page.props.html).toContain("&lt;script&gt;");
    expect(page.props.html).not.toContain("<script>");
  });

  it("mantém a data civil sem deslocamento de fuso e não inventa data ausente", () => {
    expect(articleDate("2026-11-02", "pt-br")).toBe("2 de novembro de 2026");
    expect(articleDate("2026-11-02", "en")).toBe("November 2, 2026");
    expect(articleDate(undefined, "pt-br")).toBeUndefined();
  });

  it("não cria páginas para um catálogo vazio", () => {
    expect(articlePages(content([]), "en")).toEqual([]);
  });
});
