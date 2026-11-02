import { resolve } from "node:path";
import { preparePublicContent, readPublicContent } from "./pipeline.ts";

const command = process.argv[2];
try {
  if (command !== "validate" && command !== "prepare") throw new Error("Uso: node backend/content/node/cli.ts <validate|prepare>");
  const publicDir = resolve(process.cwd(), "public");
  const result = await (command === "prepare" ? preparePublicContent(publicDir) : readPublicContent(publicDir));
  console.log(`Conteúdo válido: ${result.database.size} arquivo(s) .lu.${command === "prepare" ? " Índice atualizado." : ""}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
