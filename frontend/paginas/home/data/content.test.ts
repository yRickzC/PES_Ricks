import { describe, expect, it } from "vitest";
import { createContentDatabase } from "../../../../backend/content/database";
import { entry } from "../../../../backend/content/test-fixtures";
import { selectHomeContent } from "./content";

describe("conteúdo real da Home", () => {
  it("mantém seções de conteúdo vazias quando não há publicações ou destaques", () => {
    const database = createContentDatabase([entry({ kind: "project", id: "sem-destaque" }), entry({ kind: "service" })]);
    expect(selectHomeContent(database, "en")).toEqual({ projects: [], posts: [] });
  });

  it("seleciona até sete projetos destacados pela ordem editorial e depois pela data", () => {
    const database = createContentDatabase([
      entry({ kind: "project", id: "sem-destaque", date: "2026-11-07" }),
      entry({ kind: "project", id: "oitavo", featured: true, date: "2026-09-01" }),
      entry({ kind: "project", id: "setimo", featured: true, date: "2026-09-02" }),
      entry({ kind: "project", id: "sexto", featured: true, date: "2026-09-03" }),
      entry({ kind: "project", id: "quinto", featured: true, date: "2026-09-04" }),
      entry({ kind: "project", id: "quarto", featured: true, date: "2026-10-01" }),
      entry({ kind: "project", id: "terceiro", featured: true, date: "2026-11-01" }),
      entry({ kind: "project", id: "segundo", featured: true, featuredOrder: 2 }),
      entry({ kind: "project", id: "primeiro", featured: true, featuredOrder: 0 }),
    ]);
    const before = database.list();
    expect(selectHomeContent(database, "en").projects.map(({ metadata }) => metadata.id)).toEqual(["primeiro", "segundo", "terceiro", "quarto", "quinto", "sexto", "setimo"]);
    expect(database.list()).toEqual(before);
  });

  it("ordena o catálogo de posts pela publicação, independentemente do destaque ou atualização", () => {
    const database = createContentDatabase([
      entry({ id: "antigo", featured: true, date: "2026-10-01", updatedAt: "2026-11-07" }),
      entry({ id: "recente", date: "2026-11-07" }),
      entry({ id: "segundo", date: "2026-11-06" }),
      entry({ id: "terceiro", date: "2026-11-05" }),
      entry({ id: "sem-data" }),
    ]);
    expect(selectHomeContent(database, "en").posts.map(({ id }) => id)).toEqual(["article:recente", "article:segundo", "article:terceiro", "article:antigo", "article:sem-data"]);
  });

  it("reutiliza traduções, fallback do catálogo e base de publicação sem duplicar conteúdos", () => {
    const database = createContentDatabase([
      entry({ kind: "project", id: "jogo", locale: "en", featured: true }),
      entry({ kind: "project", id: "jogo", locale: "pt-br", title: "Jogo", featured: true }),
      entry({ id: "nota", locale: "en", date: "2026-11-01" }),
      entry({ id: "nota", locale: "pt-br", title: "Nota", date: "2026-11-01" }),
      entry({ id: "fallback", locale: "en", date: "2026-10-01" }),
    ]);
    const result = selectHomeContent(database, "pt-br", "/PES_Ricks/");
    expect(result.projects.map(({ key }) => key)).toEqual(["project:jogo@pt-br"]);
    expect(result.posts.map(({ id }) => id)).toEqual(["article:nota@pt-br", "article:fallback@en"]);
    expect(result.posts[0].title).toBe("Nota");
    expect(result.posts[0].href).toBe("/PES_Ricks/pt-br/blogs/nota/");
  });
});
