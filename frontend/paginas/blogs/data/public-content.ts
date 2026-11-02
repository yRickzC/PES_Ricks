import { publicDir } from "astro:config/server";
import { fileURLToPath } from "node:url";
import { readPublicContent } from "../../../../backend/content/node/pipeline.ts";

// Apenas no frontmatter/geração estática; usa o diretório resolvido pelo Astro.
export function readBlogContent() {
  return readPublicContent(fileURLToPath(publicDir));
}
