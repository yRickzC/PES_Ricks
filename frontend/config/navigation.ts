import { defaultLocale, locales } from "./i18n";

// Caminhos sem prefixo de idioma; Astro aplica o locale nos links.
export const navigation = {
  home: "",
  labStatus: "#lab-status",
} as const;

export const sitePages = [
  {
    id: "home",
    path: "",
    titleKey: "homeTitle",
    descriptionKey: "description",
    entrypoint: "./frontend/paginas/home/HomePage.astro",
  },
  {
    id: "blogs",
    path: "blogs",
    titleKey: "blogsLabel",
    descriptionKey: "blogsDescription",
    entrypoint: "./frontend/paginas/blogs/BlogsPage.astro",
  },
  {
    id: "projects",
    path: "projects",
    titleKey: "projectsLabel",
    descriptionKey: "projectsDescription",
    entrypoint: "./frontend/paginas/projects/ProjectsPage.astro",
  },
  {
    id: "services",
    path: "services",
    titleKey: "servicesLabel",
    descriptionKey: "servicesDescription",
    entrypoint: "./frontend/paginas/services/ServicesPage.astro",
  },
] as const;

export type PageId = (typeof sitePages)[number]["id"];

export const primaryNavigation = sitePages.filter((page) => page.id !== "home");

// Registro explícito: componentes e layouts não viram rotas públicas.
export const pageRoutes = locales.flatMap((locale) => {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return [
    ...sitePages.map((page) => ({
      pattern: page.path ? `${prefix}/${page.path}/` : `${prefix}/`,
      entrypoint: page.entrypoint,
    })),
    {
      pattern: `${prefix}/blogs/[id]/`,
      entrypoint: "./frontend/paginas/blogs/subpaginas/ArticlePage.astro",
    },
    {
      pattern: `${prefix}/services/[id]/`,
      entrypoint: "./frontend/paginas/services/subpaginas/ServicePage.astro",
    },
  ];
});
