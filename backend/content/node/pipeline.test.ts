import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { preparePublicContent, readPublicContent } from "./pipeline.ts";
import { lu } from "../test-fixtures.ts";

const directories: string[] = [];
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "ricks-lu-"));
  directories.push(root);
  await mkdir(join(root, "content/nested"), { recursive: true });
  await mkdir(join(root, "images"));
  await writeFile(join(root, "images/cover.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  return root;
}
afterEach(async () => { await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))); });

describe("validação de public antes do build", () => {
  it("descobre arquivos recursivos e produz índice determinístico sem o corpo", async () => {
    const root = await fixture();
    await writeFile(join(root, "content/nested/article.lu"), lu());
    await preparePublicContent(root);
    const first = await readFile(join(root, "content/index.json"), "utf8");
    expect(JSON.parse(first).entries[0]).toMatchObject({ key: "article:experimento", path: "/content/nested/article.lu" });
    expect(first).not.toContain("Conteúdo do artigo");
    await preparePublicContent(root);
    expect(await readFile(join(root, "content/index.json"), "utf8")).toBe(first);
  });

  it("agrega problemas de vários arquivos e preserva o índice anterior", async () => {
    const root = await fixture();
    await writeFile(join(root, "content/index.json"), "índice anterior");
    await writeFile(join(root, "content/a.lu"), lu({ title: "TODO" }));
    await writeFile(join(root, "content/b.lu"), lu({ id: "segundo", image: { src: "/images/missing.png", alt: "Capa" }, relations: ["project:ausente"] }));
    let message = "";
    try { await preparePublicContent(root); } catch (error) { message = (error as Error).message; }
    expect(message).toContain("/content/a.lu");
    expect(message).toContain("[title]");
    expect(message).toContain("missing.png");
    expect(message).toContain("project:ausente");
    expect(await readFile(join(root, "content/index.json"), "utf8")).toBe("índice anterior");
  });

  it("valida imagens inline, propriedades de widgets e referências inline", async () => {
    const root = await fixture();
    await writeFile(join(root, "content/article.lu"), lu({}, '![Diagrama](/images/missing.png)\n\n[[project:ausente]]\n\n```$timeline\nerro: true\n```'));
    await expect(readPublicContent(root)).rejects.toThrow("Propriedade desconhecida: erro");
    await expect(readPublicContent(root)).rejects.toThrow("project:ausente");
    await expect(readPublicContent(root)).rejects.toThrow("missing.png");
  });

  it("aceita catálogo vazio sem inventar publicações", async () => {
    const root = await fixture();
    expect((await readPublicContent(root)).database.size).toBe(0);
  });

  it("indexa o mesmo id em dois idiomas e recusa duas grafias do mesmo locale", async () => {
    const root = await fixture();
    await writeFile(join(root, "content/nested/post.en.lu"), lu());
    await writeFile(join(root, "content/nested/post.pt_br.lu"), lu());
    const result = await preparePublicContent(root);
    expect(result.database.get("article:experimento", "pt-br")?.path).toBe("/content/nested/post.pt_br.lu");
    expect(result.database.translations("article:experimento")).toHaveLength(2);
    await writeFile(join(root, "content/nested/post.pt-br.lu"), lu());
    await expect(preparePublicContent(root)).rejects.toThrow("Chave duplicada: article:experimento@pt-br");
  });
});
