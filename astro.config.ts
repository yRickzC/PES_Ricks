import { defineConfig } from "astro/config";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import { defaultLocale, locales } from "./frontend/config/i18n";
import { pageRoutes } from "./frontend/config/navigation";
import { contentIntegration } from "./backend/content/node/integration.ts";

const [repositoryOwner = "yRickzC", repositoryName = "PES_Ricks"] = (
  process.env.GITHUB_REPOSITORY ?? "yRickzC/PES_Ricks"
).split("/");
const isUserOrOrganizationSite = repositoryName.toLowerCase() === repositoryOwner.toLowerCase() + ".github.io";
const defaultBasePath = process.env.GITHUB_ACTIONS === "true" && !isUserOrOrganizationSite
  ? "/" + repositoryName
  : "/";
const configuredBasePath = process.env.PUBLIC_BASE_PATH?.trim() || defaultBasePath;
const base = configuredBasePath === "/"
  ? "/"
  : "/" + configuredBasePath.replace(/^\/+|\/+$/gu, "");
const site = (process.env.PUBLIC_SITE_URL?.trim() || "https://" + repositoryOwner.toLowerCase()).replace(/\/+$/u, "");

export default defineConfig({
  output: "static",
  site,
  base,
  srcDir: "./frontend",
  publicDir: "./public",
  build: {
    inlineStylesheets: "always",
  },
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
        "astro:config:setup": ({ injectRoute, addWatchFile }) => {
          // Rebuild the injected route manifest when its configuration changes.
          addWatchFile(new URL("./frontend/config/navigation.ts", import.meta.url));
          addWatchFile(new URL("./frontend/config/i18n.ts", import.meta.url));

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
