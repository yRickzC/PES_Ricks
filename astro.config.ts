import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { defaultLocale, locales } from "./frontend/config/i18n";
import { pageRoutes } from "./frontend/config/navigation";
import { contentIntegration } from "./backend/content/node/integration.ts";

export default defineConfig({
  srcDir: "./frontend",
  publicDir: "./public",
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    contentIntegration(),
    {
      name: "domain-pages",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          for (const route of pageRoutes) {
            injectRoute(route);
          }
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
