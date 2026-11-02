import { describe, expect, it, vi } from "vitest";
import { createGithubHistoryClient, loadGithubHistory } from "./history.ts";
import { lu } from "../../content/test-fixtures.ts";
import { renderLu } from "../../content/render.ts";
import { createContentDatabase } from "../../content/database.ts";
import { parseLu } from "../../content/parser.ts";

const config = { owner: "example", repo: "project", ref: "main" };
const sha = "a".repeat(40);
const tree = { truncated: false, tree: [
  { type: "blob", path: ".github/releases/v1/changelog.lu", sha },
  { type: "blob", path: "docs/changelog.lu", sha: "b".repeat(40) },
] };
const blob = (source: string) => new Response(JSON.stringify({ encoding: "base64", size: Buffer.byteLength(source), content: Buffer.from(source).toString("base64") }));

describe("histórico GitHub público", () => {
  it("descobre changelog.lu em .github, fixa blobs por SHA e renderiza conteúdo", async () => {
    const source = lu({ kind: "changelog", id: "release-1", date: "2026-11-02" }, "## Mudanças\n\nNovo sistema de conteúdo.");
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(JSON.stringify(tree))).mockResolvedValueOnce(blob(source));
    const result = await loadGithubHistory(config, { fetch: request });
    expect(result.status).toBe("ready");
    if (result.status !== "ready") throw new Error(result.message);
    expect(result.documents).toHaveLength(1);
    expect(request).toHaveBeenNthCalledWith(2, `https://api.github.com/repos/example/project/git/blobs/${sha}`, expect.objectContaining({ credentials: "omit" }));
    const page = lu({ kind: "project", id: "project" }, '```$github-history\nowner: example\nrepo: project\nref: main\n```');
    const html = renderLu(parseLu(page), { database: createContentDatabase([]), githubHistory: new Map([[result.key, result.documents]]) });
    expect(html).toContain("<h2>Mudanças</h2>");
    expect(html).toContain("Novo sistema de conteúdo.");
  });

  it("recusa árvore truncada e erros HTTP sem apresentar histórico parcial", async () => {
    const truncated = await loadGithubHistory(config, { fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ ...tree, truncated: true }))) });
    expect(truncated).toMatchObject({ status: "unavailable", message: expect.stringContaining("truncada") });
    const limited = await loadGithubHistory(config, { fetch: vi.fn<typeof fetch>().mockResolvedValue(new Response("Limite", { status: 403 })) });
    expect(limited).toMatchObject({ status: "unavailable", message: expect.stringContaining("403") });
  });

  it("rejeita changelog incompleto, excesso de arquivos e widgets remotos", async () => {
    const incomplete = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(JSON.stringify(tree))).mockResolvedValueOnce(blob(lu({ kind: "changelog", date: "2026-11-02", title: "TODO" })));
    expect(await loadGithubHistory(config, { fetch: incomplete })).toMatchObject({ status: "unavailable", message: expect.stringContaining("preset") });
    const nested = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(JSON.stringify(tree))).mockResolvedValueOnce(blob(lu({ kind: "changelog", date: "2026-11-02" }, '```$timeline\n```')));
    expect(await loadGithubHistory(config, { fetch: nested })).toMatchObject({ status: "unavailable", message: expect.stringContaining("espelhe") });
    const many = { truncated: false, tree: [tree.tree[0], { ...tree.tree[0], path: ".github/releases/v2/changelog.lu" }] };
    const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(many)));
    expect(await loadGithubHistory(config, { fetch: request, maxFiles: 1 })).toMatchObject({ status: "unavailable", message: expect.stringContaining("limite de 1") });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("deduplica requisições e permite tentar novamente após indisponibilidade", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response("Erro", { status: 503 })).mockResolvedValueOnce(new Response(JSON.stringify({ truncated: false, tree: [] })));
    const client = createGithubHistoryClient({ fetch: request });
    const [first, second] = await Promise.all([client.load(config), client.load(config)]);
    expect(first).toBe(second);
    expect(first.status).toBe("unavailable");
    expect((await client.load(config)).status).toBe("ready");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("aceita traduções da mesma release e o widget escolhe o idioma da página", async () => {
    const localizedTree = { truncated: false, tree: [
      { type: "blob", path: ".github/v1/changelog.en.lu", sha },
      { type: "blob", path: ".github/v1/changelog.pt_br.lu", sha: "b".repeat(40) },
    ] };
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify(localizedTree)))
      .mockResolvedValueOnce(blob(lu({ kind: "changelog", id: "release-1", date: "2026-11-02", title: "English release" }, "English body")))
      .mockResolvedValueOnce(blob(lu({ kind: "changelog", id: "release-1", date: "2026-11-02", title: "Versão em português" }, "Corpo traduzido")));
    const result = await loadGithubHistory(config, { fetch: request });
    if (result.status !== "ready") throw new Error(result.message);
    expect(result.documents).toHaveLength(2);
    const page = parseLu(lu({ kind: "project", locale: "pt-br" }, '```$github-history\nowner: example\nrepo: project\nref: main\n```'));
    const html = renderLu(page, { database: createContentDatabase([]), githubHistory: new Map([[result.key, result.documents]]) });
    expect(html).toContain("Corpo traduzido");
    expect(html).not.toContain("English body");
  });
});
