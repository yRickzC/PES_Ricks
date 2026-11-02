import { describe, expect, it } from "vitest";
import { createContentDatabase, parseManifest } from "./database.ts";
import { parseLu } from "./parser.ts";
import { parseProperties } from "./properties.ts";
import { renderLu } from "./render.ts";
import { entry, lu } from "./test-fixtures.ts";
import { createWidgetRegistry } from "./widgets.ts";

const minimal = [
  '```$Config', 'id: experimento', 'título: Meu experimento',
  'descrição: O que aprendi.', 'imagem: /images/cover.svg',
  'tags: roblox, game-design', 'data: 2026-11-02', '```',
].join("\n");

describe("escrita LU sem cabeçalho JSON", () => {
  it("aceita campos em português, infere tipo e idioma e mantém --- como barra", () => {
    const document = parseLu(`---\n${minimal}\n---\nTexto\n---`, "/content/projects/experimento.pt_br.lu");
    expect(document.metadata).toMatchObject({ kind: "project", locale: "pt-br", title: "Meu experimento", date: "2026-11-02", image: { src: "/images/cover.svg", alt: "Meu experimento" }, tags: ["roblox", "game-design"] });
    expect(document.blocks.map((block) => block.type)).toEqual(["separator", "separator", "paragraph", "separator"]);
  });

  it("separa código com nome de arquivo, widgets e cercas comuns ou escapadas", () => {
    const body = [
      '```@typescript(main.ts)', 'const value = "<script>";', '---', '```',
      '```$Meu Widget', 'title: Olá', 'limit: 3', '```',
      '```', '$Config', '---', '```',
      '```\\@typescript(arquivo.ts)', '[[project:literal]]', '```',
      '```\\$Config', 'qualquer texto', '```',
    ].join("\n");
    const document = parseLu(lu({}, body));
    expect(document.blocks).toEqual([
      { type: "code", language: "typescript", filename: "main.ts", value: 'const value = "<script>";\n---' },
      { type: "widget", name: "meu-widget", props: { title: "Olá", limit: 3 }, line: expect.any(Number) },
      { type: "code", language: "", value: "$Config\n---" },
      { type: "code", language: "", value: "[[project:literal]]" },
      { type: "code", language: "", value: "qualquer texto" },
    ]);
    const registry = createWidgetRegistry({ "Meu Widget": { validate: () => [], render: (props) => `<aside>${Number(props.limit)}</aside>` } });
    const html = renderLu(document, { database: createContentDatabase([]) }, registry);
    expect(html).toContain("<figcaption>main.ts</figcaption>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<aside>3</aside>");
  });

  it("permite cercas maiores para mostrar exemplos com três crases", () => {
    const document = parseLu(lu({}, '````\n```$timeline\n```\n````'));
    expect(document.blocks).toEqual([{ type: "code", language: "", value: "```$timeline\n```" }]);
  });

  it("escapa nome de arquivo no HTML", () => {
    const document = parseLu(lu({}, '```@html(<img onerror=alert(1)>)\n<div>\n```'));
    expect(renderLu(document, { database: createContentDatabase([]) })).toContain("<figcaption>&lt;img onerror=alert(1)&gt;</figcaption>");
  });

  it("rejeita Config repetido, aliases conflitantes e abertura de código inválida", () => {
    expect(() => parseLu(`${minimal}\n${minimal}`)).toThrow("somente um bloco $Config");
    expect(() => parseLu(minimal.replace("título:", "title: Outro\ntítulo:"))).toThrow("Campo repetido por alias");
    expect(() => parseLu(`${minimal}\n\x60\x60\x60@\ntexto\n\x60\x60\x60`)).toThrow("Use @linguagem");
    expect(() => createWidgetRegistry({ Config: { validate: () => [], render: () => "" } })).toThrow("reservado");
  });

  it("lê propriedades com listas, objetos e texto multilinha sem avaliar expressões", () => {
    expect(parseProperties([
      'title: |', '  Primeira linha: com dois pontos', '  Segunda linha',
      'labels: [um, "dois, três", \'quatro\']', 'active: true', 'limit: 4',
      'style.color: violet', 'items.0.title: Item', 'items.0.url: https://example.com',
      'expression: ${naoExecutar()}',
    ], "widget.lu", 2)).toEqual({
      title: "Primeira linha: com dois pontos\nSegunda linha", labels: ["um", "dois, três", "quatro"], active: true, limit: 4,
      style: { color: "violet" }, items: [{ title: "Item", url: "https://example.com" }], expression: "${naoExecutar()}",
    });
    for (const lines of [["title: a", "title: b"], ["style: a", "style.color: b"], ["__proto__.polluted: true"], ["items.99.title: a"], ["list: [a,,b]"]]) {
      expect(() => parseProperties(lines, "bad.lu", 5)).toThrow("bad.lu:");
    }
  });
});

describe("idiomas dos arquivos e do catálogo", () => {
  const projectEn = entry({ kind: "project", id: "jogo", locale: "en", title: "Game" });
  const projectPt = entry({ kind: "project", id: "jogo", locale: "pt-br", title: "Jogo" });
  const articleEn = entry({ locale: "en", title: "Experiment", relations: ["project:jogo"] });
  const articlePt = entry({ locale: "pt-br", title: "Experimento", relations: ["project:jogo"] });

  it("normaliza pt_br e PT-BR e detecta contradição com o arquivo", () => {
    expect(parseLu(minimal, "post.pt-br.lu").metadata.locale).toBe("pt-br");
    expect(parseLu(minimal.replace("id: experimento", "idioma: PT_BR\nid: experimento")).metadata.locale).toBe("pt-br");
    expect(() => parseLu(lu({ locale: "en" }), "post.pt_br.lu")).toThrow("corresponder ao sufixo");
    expect(() => parseLu(minimal, "post.fr.lu")).toThrow("Idioma não suportado");
  });

  it("agrupa traduções pelo mesmo id e resolve relações no idioma de origem", () => {
    const entries = [projectEn, projectPt, articleEn, articlePt];
    const db = createContentDatabase(parseManifest({ version: 1, entries }).entries);
    expect(db.get("project:jogo", "pt-br")?.key).toBe("project:jogo@pt-br");
    expect(db.get("project:jogo")?.metadata.title).toBe("Game");
    expect(db.get("project:jogo@en", "pt-br")?.metadata.title).toBe("Game");
    expect(db.translations("article:experimento")).toHaveLength(2);
    expect(db.list({ locale: "pt-br", kind: "article" })).toEqual([articlePt]);
    expect(db.related("project:jogo", "incoming", "pt-br")).toEqual([articlePt]);
    expect(db.graph().edges).toContainEqual({ source: articlePt.key, target: projectPt.key, type: "relation" });
    expect(db.card("project:jogo", "pt-br")?.key).toBe(projectPt.key);
    const document = parseLu(lu({ locale: "pt-br" }, '[[project:jogo]]'));
    expect(renderLu(document, { database: db })).toContain('data-content-ref="project:jogo@pt-br">Jogo</span>');
  });

  it("aplica fallback pedido → neutro → inglês sem duplicar cards ou misturar buscas", () => {
    const shared = entry({ id: "comum" });
    const onlyEn = entry({ id: "ingles", locale: "en" });
    const onlyPt = entry({ id: "portugues", locale: "pt-br" });
    const neutral = entry({ id: "experimento", tags: ["neutro"] });
    const db = createContentDatabase([shared, onlyEn, onlyPt, neutral, articleEn, { ...articlePt, metadata: { ...articlePt.metadata, relations: [] } }, projectEn]);
    expect(db.get("article:ingles", "pt-br")?.key).toBe(onlyEn.key);
    expect(db.get("article:portugues", "en")).toBeUndefined();
    expect(db.get("article:comum", "pt-br")?.key).toBe(shared.key);
    expect(db.list({ locale: "pt-br", tags: ["neutro"] })).toEqual([]);
    expect(db.list({ locale: "pt-br", kind: "article" })).toHaveLength(4);
  });
});
