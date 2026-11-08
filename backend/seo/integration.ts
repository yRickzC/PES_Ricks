import type { AstroIntegration } from "astro";
import { readFile, writeFile } from "node:fs/promises";

const authoredRoot = "https://yrickzc.github.io/PES_Ricks/";

export function siteOrigin(value: string | undefined, owner: string): string {
  const url = new URL(value?.trim() || `https://${owner.toLowerCase()}.github.io`);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("PUBLIC_SITE_URL must be an HTTPS origin; configure its path with PUBLIC_BASE_PATH.");
  }
  return url.origin;
}

export function renderLlms(source: string, site: string, base: string): string {
  const root = new URL(`${base.replace(/\/+$/u, "")}/`, site).href;
  return source.replaceAll(authoredRoot, root);
}

/** Keep the authored public document usable with either deployment base. */
export function discoveryIntegration(): AstroIntegration {
  let source: URL;
  let site: string;
  let base: string;
  const render = async () => renderLlms(await readFile(source, "utf8"), site, base);
  return {
    name: "rickz-discovery",
    hooks: {
      "astro:config:done": ({ config }) => {
        source = new URL("llms.txt", config.publicDir);
        site = config.site!;
        base = config.base;
      },
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (request, response, next) => {
          const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
          if (pathname !== "/llms.txt" && pathname !== `${base.replace(/\/+$/u, "")}/llms.txt`) return next();
          try {
            response.setHeader("Content-Type", "text/plain; charset=utf-8");
            response.end(await render());
          } catch (error) { next(error); }
        });
      },
      "astro:build:done": async ({ dir }) => {
        await writeFile(new URL("llms.txt", dir), await render());
      },
    },
  };
}
