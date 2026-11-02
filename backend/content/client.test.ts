import { describe, expect, it, vi } from "vitest";
import { createContentClient } from "./client.ts";
import { entry, lu } from "./test-fixtures.ts";

describe("cliente estático de conteúdo", () => {
  it("carrega índice uma vez e busca corpos sob demanda, deduplicando chamadas", async () => {
    const item = entry();
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(JSON.stringify({ version: 1, entries: [item] }))).mockResolvedValueOnce(new Response(lu()));
    const client = createContentClient({ fetch: request, basePath: "/lab/" });
    const [a, b] = await Promise.all([client.load(), client.load()]);
    expect(a).toBe(b);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenNthCalledWith(1, "/lab/content/index.json");
    const [first, second] = await Promise.all([client.document(item.key), client.document(item.key)]);
    expect(first).toBe(second);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenNthCalledWith(2, `/lab${item.path}`);
  });

  it("permite nova tentativa após erro e detecta índice antigo", async () => {
    const item = entry();
    const request = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("Falha", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ version: 1, entries: [item] })))
      .mockResolvedValueOnce(new Response(lu({}, "Conteúdo alterado")))
      .mockResolvedValueOnce(new Response(lu()));
    const client = createContentClient({ fetch: request });
    await expect(client.load()).rejects.toThrow("503");
    await expect(client.document(item.key)).rejects.toThrow("índice desatualizado");
    await expect(client.document(item.key)).resolves.toMatchObject({ metadata: { id: "experimento" } });
    client.clear();
    expect(request).toHaveBeenCalledTimes(4);
  });

  it("mantém traduções no cache por chave real e deduplica pedidos por id e idioma", async () => {
    const en = entry({ locale: "en", title: "Experiment" });
    const pt = entry({ locale: "pt-br", title: "Experimento" });
    const request = vi.fn<typeof fetch>().mockImplementation(async (url) => {
      if (String(url).endsWith("index.json")) return new Response(JSON.stringify({ version: 1, entries: [en, pt] }));
      if (String(url) === pt.path) return new Response(lu({ locale: "pt-br", title: "Experimento" }));
      return new Response(lu({ locale: "en", title: "Experiment" }));
    });
    const client = createContentClient({ fetch: request });
    const [a, b, c] = await Promise.all([
      client.document("article:experimento", "pt-br"), client.document(pt.key), client.document(en.key),
    ]);
    expect(a).toBe(b);
    expect(a.metadata.locale).toBe("pt-br");
    expect(c.metadata.locale).toBe("en");
    expect(request).toHaveBeenCalledTimes(3);
  });
});
