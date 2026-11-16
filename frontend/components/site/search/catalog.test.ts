import { describe, expect, it } from "vitest";
import { prepareSearchEntry, prepareSearchQuery, searchEntryScore } from "../../../../backend/search/discovery";
import type { SearchFilters } from "../../../../backend/search/search";
import type { ContentEntry } from "../../../../backend/content/types";
import { locales, type Locale } from "../../../config/i18n";
import { getServiceCopy } from "../../../paginas/services/config/catalog";
import { getMessages } from "../../../utils/translations";
import { createSearchCatalog } from "./catalog";

const all = { type: "all", category: "all" } as const;
function catalog(locale: Locale = "pt-br", base = "/") {
  return createSearchCatalog([], locale, getMessages(locale), base);
}
function score(query: string, locale: Locale = "pt-br", filters: Pick<SearchFilters, "type" | "category"> = all) {
  const landing = catalog(locale).find(({ id }) => id === "service:landing-page")!;
  return searchEntryScore(prepareSearchEntry(landing), prepareSearchQuery(query), filters);
}

describe("descoberta de serviços na pesquisa", () => {
  it.each(locales)("remove Home e indexa somente o serviço disponível: %s", (locale) => {
    const records = catalog(locale);
    expect(records.map(({ id }) => id)).not.toContain("page:home");
    expect(records.filter(({ id }) => id.startsWith("service:")).map(({ id }) => id)).toEqual(["service:landing-page"]);
    const landing = records.find(({ id }) => id === "service:landing-page")!;
    expect(landing.title).toBe(getServiceCopy(locale).websites.offers[1]!.title);
    expect(landing.description).toBe(getServiceCopy(locale).websites.offers[1]!.description);
    expect(landing.categories.map(({ value }) => value)).toEqual(["service:websites"]);
  });

  it.each([
    ["en", "/", "/services/landing-page/"],
    ["en", "/PES_Ricks", "/PES_Ricks/services/landing-page/"],
    ["pt-br", "/", "/pt-br/services/landing-page/"],
    ["pt-br", "/PES_Ricks/", "/PES_Ricks/pt-br/services/landing-page/"],
  ] as const)("mantém idioma e base nas URLs: %s %s", (locale, base, expected) => {
    const records = catalog(locale, base);
    expect(records.find(({ id }) => id === "service:landing-page")!.href).toBe(expected);
    expect(records.find(({ id }) => id === "page:services")!.href).toBe(expected.replace("landing-page/", ""));
  });

  it.each([
    "landing page", "laddingpage", "lading page", "landig page", "ladning page", "landding page",
    "site para meu produto", "site para minha padaria", "site pra minha clínica",
    "quero um site para vender meus doces", "siti para meu restaurante", "siet para minha marca",
    "PÁGINA DE VENDAS!", "divugar meu produto", "divulgação da minha empresa", "captar clientes",
    "gerar leads", "site profissional", "página de captura",
  ])("encontra por nome, finalidade e erros comuns: %s", (query) => {
    expect(score(query)).toBeGreaterThan(0);
  });

  it.each(["landingpage", "website for my bakery", "I need a website for my candles",
    "webpage for my product", "promote my product", "sales page", "capture leads"])(
    "atende consultas leigas em inglês: %s", (query) => {
      expect(score(query, "en")).toBeGreaterThan(0);
    },
  );

  it.each(["banco de dados sqlite", "compilador rust", "termoabsolutamenteinexistente"])(
    "não usa a intenção de serviços para qualquer texto: %s", (query) => {
      expect(score(query)).toBe(0);
    },
  );

  it("preserva tipo e categoria inclusive nas consultas por intenção", () => {
    expect(score("site para minha padaria", "pt-br", { type: "service", category: "service:websites" })).toBeGreaterThan(0);
    expect(score("site para minha padaria", "pt-br", { type: "project", category: "all" })).toBe(0);
    expect(score("site para minha padaria", "pt-br", { type: "service", category: "service:mobile-apps" })).toBe(0);
  });

  it("prioriza o nome da oferta sobre menções em outras páginas", () => {
    const landing = prepareSearchEntry(catalog().find(({ id }) => id === "service:landing-page")!);
    const mention = prepareSearchEntry({ ...landing, title: "Serviços", searchText: "Informações sobre landing page" });
    const query = prepareSearchQuery("landing page");
    expect(searchEntryScore(landing, query, all)).toBeGreaterThan(searchEntryScore(mention, query, all));
  });

  it("limita consultas extensas e conserva sugestões e filtros sem texto", () => {
    expect(score("produto ".repeat(100))).toBe(0);
    expect(score(Array.from({ length: 17 }, (_, index) => `palavra${index}`).join(" "))).toBe(0);
    expect(score("")).toBeGreaterThan(0);
    expect(score("", "pt-br", { type: "blog", category: "all" })).toBe(0);
  });

  it("não aproxima palavras curtas nem relaxa as buscas de artigos", () => {
    const article = prepareSearchEntry({ type: "blog" as const, categories: [], title: "API local", searchText: "API local" });
    expect(searchEntryScore(article, prepareSearchQuery("app"), all)).toBe(0);
    expect(searchEntryScore(article, prepareSearchQuery("API remoto"), all)).toBe(0);
  });

  it("preserva as URLs dos artigos e o catálogo sem novas publicações", () => {
    const article: ContentEntry = {
      key: "article:minha-nota", path: "nota.lu", revision: "1", references: [],
      metadata: {
        version: 1, kind: "article", id: "minha-nota", locale: "pt-br", title: "Minha nota",
        description: "Uma nota real do catálogo.", image: { src: "/images/example.webp", alt: "" },
        tags: [], links: [], relations: [],
      },
    };
    const records = createSearchCatalog([article], "pt-br", getMessages("pt-br"), "/PES_Ricks");
    expect(records.find(({ id }) => id === "article:minha-nota")!.href).toBe("/PES_Ricks/pt-br/blogs/minha-nota/");
  });
});
