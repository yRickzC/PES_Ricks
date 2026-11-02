import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { preparePublicContent } from "./pipeline.ts";
import type { WidgetRegistry } from "../widgets.ts";

export function contentIntegration(widgets?: WidgetRegistry): AstroIntegration {
  let publicDir: string;
  return {
    name: "lu-content",
    hooks: {
      "astro:config:done": ({ config }) => { publicDir = fileURLToPath(config.publicDir); },
      "astro:build:start": async () => { await preparePublicContent(publicDir, widgets); },
    },
  };
}
