import { describe, expect, it } from "vitest";
import { createContentDatabase } from "../../../../backend/content/database";
import { entry } from "../../../../backend/content/test-fixtures";
import { createBlogPosts } from "./explore-catalog";
import { blogFilterOptions, blogPageNumbers, blogStateUrl, initialBlogState, PAGE_SIZE, readBlogState, reduceBlogState, selectBlogPage } from "./explore";
import { blogCopy, blogCount } from "./explore-copy";

function posts(count: number) {
  return createBlogPosts(Array.from({ length: count }, (_, index) => entry({
    id: `note-${index + 1}`, title: `Nota ${index + 1}`, date: `2026-10-${String(index % 28 + 1).padStart(2, "0")}`,
    categories: index % 2 ? ["dev-log"] : ["experiments"],
    tags: index % 2 ? ["performance", "systems"] : ["games"],
  })), "pt-br");
}

describe("exploração exclusiva do Blog", () => {
  it("exclui Projects, Services, locais e changelogs mesmo que tenham o texto pesquisado", () => {
    const entries = [entry({ id: "nota" }), ...(["project", "service", "location", "changelog"] as const).map((kind) => entry({ kind, id: `outro-${kind}`, date: "2026-10-01" }))];
    expect(createBlogPosts(entries, "en").map(({ id }) => id)).toEqual(["article:nota"]);
  });

  it("reutiliza a seleção real de idioma/fallback e o prefixo de publicação", () => {
    const database = createContentDatabase([entry({ id: "nota", locale: "en", title: "English" }), entry({ id: "nota", locale: "pt-br", title: "Português" })]);
    const catalog = createBlogPosts(database.list({ kind: "article", contentType: "blog", locale: "pt-br" }), "pt-br", "/PES_Ricks/");
    expect(catalog).toHaveLength(1);
    expect(catalog[0].title).toBe("Português");
    expect(catalog[0].href).toBe("/PES_Ricks/pt-br/blogs/nota/");
  });

  it("busca título, resumo, categoria localizada, tags e keywords sem caixa ou acentos", () => {
    const catalog = createBlogPosts([entry({ title: "Geração procedural", description: "Mundos silenciosos", categories: ["experiments"], tags: ["game-design"], keywords: ["Território", "compilador"] })], "pt-br");
    for (const query of ["GERACAO", "mundos", "experiments", catalog[0].categories[0].label, "game-design", "territorio", "GERACAO compilador"]) {
      expect(selectBlogPage(catalog, { ...initialBlogState(), query }).total).toBe(1);
    }
    expect(selectBlogPage(catalog, { ...initialBlogState(), query: "geracao inexistente" }).total).toBe(0);
  });

  it("deriva opções dos posts e combina categoria com todas as tags e o texto", () => {
    const catalog = posts(23);
    const options = blogFilterOptions(catalog, "pt-br");
    expect(options.categories.map(({ id }) => id).sort()).toEqual(["dev-log", "experiments"]);
    expect(options.tags).toEqual(["games", "performance", "systems"]);
    const selection = selectBlogPage(catalog, { query: "nota", category: "dev-log", tags: ["performance", "systems"], page: 2 });
    expect(selection.total).toBe(11);
    expect(selection.visible).toHaveLength(1);
    expect(selection.pageCount).toBe(2);
    expect(selection.active).toBe(true);
    expect(selectBlogPage(catalog, { ...initialBlogState(), tags: ["games", "systems"] }).total).toBe(0);
  });

  it("pagina 23 posts em 10/10/3 sem repetir ou omitir resultados", () => {
    const catalog = posts(23);
    const selections = [1, 2, 3].map((page) => selectBlogPage(catalog, { ...initialBlogState(), page }));
    expect(PAGE_SIZE).toBe(10);
    expect(selections.map(({ visible }) => visible.length)).toEqual([10, 10, 3]);
    expect(new Set(selections.flatMap(({ visible }) => visible.map(({ id }) => id))).size).toBe(23);
    expect(selectBlogPage(catalog, { ...initialBlogState(), page: 99 }).page).toBe(3);
  });

  it("muda de descoberta para pesquisa ao aplicar qualquer filtro e reseta a página", () => {
    const state = { ...initialBlogState(), page: 3 };
    for (const action of [{ type: "query", value: "nota" }, { type: "category", value: "dev-log" }, { type: "tags", value: ["systems"] }] as const) {
      const next = action.type === "tags" ? reduceBlogState(state, { type: "tags", value: [...action.value] }) : reduceBlogState(state, action);
      expect(next.page).toBe(1);
      expect(selectBlogPage(posts(23), next).active).toBe(true);
    }
    expect(selectBlogPage(posts(23), state).active).toBe(false);
    expect(reduceBlogState({ query: "x", category: "dev-log", tags: ["games"], page: 4 }, { type: "reset" })).toEqual(initialBlogState());
  });

  it("ordena destaques pela configuração, nunca pelo índice, e preserva cronologia na busca", () => {
    const catalog = createBlogPosts([
      entry({ id: "recente", date: "2026-11-03" }),
      entry({ id: "segundo", date: "2026-10-02", featured: true, featuredOrder: 2 }),
      entry({ id: "primeiro", date: "2026-10-01", featured: true, featuredOrder: 1 }),
    ], "en");
    expect(selectBlogPage(catalog, initialBlogState()).visible.map(({ id }) => id)).toEqual(["article:primeiro", "article:segundo", "article:recente"]);
    expect(selectBlogPage(catalog, { ...initialBlogState(), query: "Roblox" }).visible[0].id).toBe("article:recente");
  });

  it("preserva parâmetros alheios e hash, suporta múltiplas tags e restaura links compartilhados", () => {
    const url = new URL("https://example.test/PES_Ricks/pt-br/blogs/?utm_source=journal#lab-notes");
    const state = { query: "world generation", category: "experiments", tags: ["games", "systems"], page: 2 };
    const next = blogStateUrl(url, state);
    expect(readBlogState(next.searchParams)).toEqual(state);
    expect(next.pathname).toBe(url.pathname);
    expect(next.hash).toBe("#lab-notes");
    expect(next.searchParams.get("utm_source")).toBe("journal");
    const clear = blogStateUrl(next, initialBlogState());
    expect(clear.search).toBe("?utm_source=journal");
    expect(url.searchParams.has("q")).toBe(false);
  });

  it("trata URL inválida, filtros removidos e catálogo vazio sem inventar posts", () => {
    for (const page of ["-1", "NaN", "Infinity", "2.3", "9007199254740993"]) expect(readBlogState(new URLSearchParams({ page })).page).toBe(1);
    const missing = selectBlogPage(posts(23), readBlogState(new URLSearchParams("category=removida&page=8")));
    expect(missing).toMatchObject({ total: 0, page: 1, pageCount: 0, active: true, visible: [] });
    expect(selectBlogPage([], initialBlogState())).toMatchObject({ total: 0, pageCount: 0, visible: [] });
    expect(blogFilterOptions([], "en")).toEqual({ categories: [], tags: [] });
    expect(blogPageNumbers(50, 100)).toEqual([1, "…", 49, 50, 51, "…", 100]);
  });

  it("localiza contadores sem inserir a consulta como HTML e mantém paridade dos textos", () => {
    expect(Object.keys(blogCopy("en")).sort()).toEqual(Object.keys(blogCopy("pt-br")).sort());
    expect(blogCount(blogCopy("en"), 1, false, "")).toBe("1 note");
    expect(blogCount(blogCopy("pt-br"), 23, true, "jogos")).toBe("23 resultados para “jogos”");
    expect(blogCount(blogCopy("en"), 0, true, "<script>")).toContain("<script>"); // DOM controller uses textContent.
  });
});
