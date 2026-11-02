import { describe, expect, it } from "vitest";
import { createContentDatabase, parseManifest } from "./database.ts";
import { documentReferences, parseLu } from "./parser.ts";
import { renderLu } from "./render.ts";
import { ContentValidationError } from "./types.ts";
import { createWidgetRegistry } from "./widgets.ts";
import { config, entry, lu, metadata } from "./test-fixtures.ts";

describe("LU com blocos declarativos", () => {
  it("aceita BOM, CRLF e preserva metadados e blocos declarativos", () => {
    const source = lu({}, '# Título\n\n**Forte** e *ênfase* e `código`.\n\n- Um\n- Dois\n\n> Citação\n\n```ts\nconst x = 1;\n```\n\n```$timeline\n```');
    const document = parseLu(`\uFEFF${source.replace(/\n/gu, "\r\n")}`, "exemplo.lu");
    expect(document.blocks.map((block) => block.type)).toEqual(["heading", "paragraph", "list", "quote", "code", "widget"]);
    expect(document.metadata.tags).toEqual(["game-design"]);
  });

  it("agrega campos mínimos ausentes e rejeita presets incompletos", () => {
    try {
      parseLu('```$Config\nid: incompleto\ntitle: TODO\n```');
      expect.fail("Deveria falhar");
    } catch (error) {
      expect(error).toBeInstanceOf(ContentValidationError);
      expect((error as ContentValidationError).issues.map((issue) => issue.field)).toEqual(expect.arrayContaining(["title", "description", "image", "tags"]));
    }
  });

  it.each<[Record<string, unknown>, string]>([
    [{ tags: [] }, "tags"],
    [{ tags: ["game-design", "game-design"] }, "tags"],
    [{ date: "2026-02-30" }, "date"],
    [{ kind: "changelog" }, "date"],
    [{ kind: "project", status: "PAUSED" }, "status"],
    [{ image: { src: "/../secret.png", alt: "Capa" } }, "image"],
    [{ image: { src: "/images/file.txt", alt: "Capa" } }, "image"],
    [{ links: [{ label: "Link", url: "javascript:alert(1)" }] }, "links"],
    [{ extra: "Campo com erro" }, "extra"],
  ])("rejeita configuração inválida %j", (overrides, field) => {
    expect(() => parseLu(config({ ...metadata(), ...overrides }))).toThrow(`[${field}]`);
  });

  it("informa arquivo e linha de sintaxe incorreta", () => {
    expect(() => parseLu(lu({}, "```$timeline\nsem chave\n```"), "bad.lu")).toThrow(/bad\.lu:\d+ \[properties\]/u);
    expect(() => parseLu(lu({}, "```ts\nsem fechamento"))).toThrow("sem fechamento");
    expect(() => parseLu("---\n{ ruim }\n---")).toThrow("$Config");
  });

  it("extrai referências reais e ignora referências dentro de código", () => {
    const document = parseLu(lu({}, '[[project:meu-jogo|Projeto]]\n\n`[[project:ignorado]]`\n\n```md\n[[service:ignorado]]\n```'));
    expect(documentReferences(document)).toEqual(["project:meu-jogo"]);
  });

  it("escapa HTML e atributos e rejeita protocolos executáveis", () => {
    const document = parseLu(lu({}, '<script>alert("x")</script> **<img>** [Site](https://example.com/?a="x")'));
    const html = renderLu(document, { database: createContentDatabase([]) });
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<strong>&lt;img&gt;</strong>");
    expect(html).toContain("&quot;x&quot;");
    expect(html).not.toContain("<script>");
    expect(() => parseLu(lu({}, "[Link](javascript:alert)"))).toThrow("URL não permitida");
    expect(() => parseLu(lu({}, "![Imagem](//evil.test/a.png)"))).toThrow("URL não permitida");
  });
});

describe("catálogo e relações", () => {
  const project = entry({ kind: "project", id: "meu-jogo", status: "PROTOTYPE" });
  const service = entry({ kind: "service", id: "jogos" });
  const location = entry({ kind: "location", id: "laboratorio" });
  const article = entry({ relations: ["project:meu-jogo", "service:jogos", "location:laboratorio"], date: "2026-11-02" });

  it("consulta tags, texto sem acento e vínculos nos dois sentidos", () => {
    const db = createContentDatabase([project, service, location, article]);
    expect(db.list({ kind: "article", tags: ["game-design"], search: "criacao jogos" }).map((item) => item.key)).toEqual([article.key]);
    expect(db.list({ tags: ["inexistente"] })).toEqual([]);
    expect(db.related(project.key, "incoming").map((item) => item.key)).toEqual([article.key]);
    expect(db.related(article.key, "outgoing")).toHaveLength(3);
    expect(db.graph().edges).toHaveLength(3);
    expect(db.timeline(project.key).map((item) => item.key)).toEqual([article.key]);
    expect(db.tags()).toEqual([{ tag: "game-design", count: 4 }]);
    expect(db.card(article.key)).toMatchObject({ title: article.metadata.title, sourceUrl: article.path, image: article.metadata.image });
  });

  it("protege o catálogo contra mutação externa", () => {
    const original = entry();
    const db = createContentDatabase([original]);
    original.metadata.title = "Mudado";
    expect(db.get(original.key)?.metadata.title).toBe("Experimento Roblox");
    expect(() => db.get(original.key)!.metadata.tags.push("nova")).toThrow();
  });

  it("rejeita IDs duplicados, referências pendentes e autorreferências", () => {
    expect(() => createContentDatabase([article])).toThrow("Destino inexistente");
    expect(() => createContentDatabase([project, project])).toThrow("Chave duplicada");
    expect(() => createContentDatabase([entry({ relations: ["article:experimento"] })])).toThrow("si mesmo");
    expect(() => parseManifest({ version: 1, entries: [{ ...project, path: "/../private.lu" }] })).toThrow("Entrada inválida");
  });

  it("renderiza referências com rotas fornecidas e widgets consultando o catálogo", () => {
    const db = createContentDatabase([project, service, location, article]);
    const document = parseLu(lu({ kind: "project", id: "meu-jogo" }, '[[article:experimento|Leia o artigo]]\n\n```$timeline\n```\n\n```$related-content\nkind: article\n```'));
    const html = renderLu(document, { database: db, resolveHref: (item) => `/conteudo/${item.metadata.id}/` });
    expect(html).toContain('href="/conteudo/experimento/"');
    expect(html).toContain('data-widget="timeline"');
    expect(html).toContain('<time datetime="2026-11-02">');
    expect(() => renderLu(parseLu(lu({}, '```$desconhecido\n```')), { database: db })).toThrow("Widget desconhecido");
    expect(() => renderLu(parseLu(lu({}, '```$youtube\nid: x\ntitle: Vídeo\n```')), { database: db })).toThrow("11 caracteres");
  });

  it("permite registrar um widget confiável e mostra fallback do GitHub", () => {
    const registry = createWidgetRegistry({ aviso: { validate: () => [], render: () => "<aside>Aviso</aside>" } });
    expect(renderLu(parseLu(lu({}, '```$aviso\n```')), { database: createContentDatabase([]) }, registry)).toBe("<aside>Aviso</aside>");
    expect(renderLu(parseLu(lu({}, '```$github-history\nowner: org\nrepo: repo\nref: main\n```')), { database: createContentDatabase([]) })).toContain('data-state="unavailable"');
  });
});
