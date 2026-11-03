import { describe, expect, it } from "vitest";
import { contentCategories, taxonomyCategories, taxonomyTypes } from "../content/taxonomy.ts";
import { matchesSearch, matchesSearchFilters, searchCategories, searchRecordText, type SearchRecord } from "./search.ts";

const research = taxonomyCategories("blog", "pt-br").find(({ id }) => id === "experiments")!;
const systems = taxonomyCategories("project", "pt-br").find(({ id }) => id === "systems")!;
const categoryCatalog = taxonomyTypes("pt-br").flatMap(({ categories }) => categories);
const article: SearchRecord = {
  id: "article:estado-local",
  title: "Memória e estado",
  description: "Notas sobre sincronização de dados.",
  type: "blog",
  typeLabel: "Blogs",
  categories: [research],
  tags: ["offline"],
  href: "/pt-br/blogs/estado-local/",
  priority: 50,
  featured: false,
  searchText: "",
};
const entries = [
  { ...article, searchText: searchRecordText(article) },
  { type: "project" as const, categories: [systems], searchText: "Sistemas locais" },
  { type: "home" as const, categories: [], searchText: "Início" },
];

describe("busca local", () => {
  it("combina termos sem depender de caixa, acentos ou ordem", () => {
    expect(matchesSearch("Memória e sincronização", " SINCRONIZACAO memoria ")).toBe(true);
    expect(matchesSearch("Memória e sincronização", "memoria remota")).toBe(false);
    expect(matchesSearch("Memória", "  ")).toBe(true);
  });

  it.each(["memoria", "sincronizacao", "blog", "experimentos", "offline", "estado-local"])(
    "encontra o conteúdo por metadados e URL: %s", (query) => {
      expect(matchesSearchFilters(entries[0]!, { query, type: "all", category: "all" })).toBe(true);
    },
  );

  it("exige que termo, tipo e categoria correspondam ao mesmo resultado", () => {
    const filters = { query: "memoria", type: "blog" as const, category: research.value };
    expect(entries.filter((entry) => matchesSearchFilters(entry, filters))).toEqual([entries[0]]);
    expect(matchesSearchFilters(entries[0]!, { ...filters, type: "project" })).toBe(false);
    expect(matchesSearchFilters(entries[0]!, { ...filters, category: systems.value })).toBe(false);
    expect(entries.filter((entry) => matchesSearchFilters(entry, { ...filters, query: "inexistente" }))).toEqual([]);
  });

  it("mantém os filtros ativos mesmo sem texto digitado", () => {
    expect(entries.filter((entry) => matchesSearchFilters(entry, {
      query: "", type: "project", category: systems.value,
    }))).toEqual([entries[1]]);
  });

  it("oferece todas as categorias cadastradas, mesmo sem publicações", () => {
    const available = searchCategories(categoryCatalog, "all", "pt-br");
    expect(available).toHaveLength(categoryCatalog.length);
    expect(new Set(available.map(({ type }) => type))).toEqual(new Set(["blog", "project", "service"]));
    expect(available.some(({ value }) => value === "service:mobile-apps")).toBe(true);
  });

  it("limita as opções ao tipo escolhido e invalida uma categoria de outro domínio", () => {
    for (const type of ["blog", "project", "service"] as const) {
      expect(searchCategories(categoryCatalog, type).every((category) => category.type === type)).toBe(true);
    }
    const available = searchCategories(categoryCatalog, "service");
    expect(available.some(({ value }) => value === systems.value)).toBe(false);
    expect(available.some(({ value }) => value === "service:internal-systems")).toBe(true);
  });

  it("mantém IDs estáveis entre traduções e isola categorias de mesmo nome", () => {
    const pt = taxonomyCategories("project", "pt-br");
    const en = taxonomyCategories("project", "en");
    expect(pt.map(({ value }) => value)).toEqual(en.map(({ value }) => value));
    const serviceCategory = { ...systems, type: "service" as const, value: "service:systems" };
    const entry = { type: "service" as const, categories: [serviceCategory], searchText: "Sistema interno" };
    expect(matchesSearchFilters(entry, { query: "sistema", type: "all", category: systems.value })).toBe(false);
    expect(matchesSearchFilters(entry, { query: "sistema", type: "service", category: serviceCategory.value })).toBe(true);
  });

  it("mantém Home nas sugestões gerais sem criar uma opção de tipo Home", () => {
    expect(taxonomyTypes("en").map(({ id }) => id)).toEqual(["blog", "project", "service"]);
    expect(matchesSearchFilters(entries[2]!, { query: "", type: "all", category: "all" })).toBe(true);
    expect(matchesSearchFilters(entries[2]!, { query: "", type: "blog", category: "all" })).toBe(false);
  });

  it("não transforma tags livres em categorias registradas", () => {
    const categories = contentCategories({ kind: "article", categories: ["article"] }, "pt-br");
    const entry = { ...article, tags: ["offline"], categories };
    const searchable = { ...entry, searchText: searchRecordText(entry) };
    expect(matchesSearchFilters(searchable, { query: "offline", type: "blog", category: "blog:article" })).toBe(true);
    expect(matchesSearchFilters(searchable, { query: "", type: "blog", category: "blog:offline" })).toBe(false);
  });
});
