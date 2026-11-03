import en from "../../public/i18n/taxonomy.en.json";
import ptBR from "../../public/i18n/taxonomy.pt-br.json";
import type { ContentKind, ContentLocale, ContentMetadata } from "./types.ts";

export interface TaxonomyIcon {
  path: string;
  viewBox?: string;
}

type NameKey = keyof typeof en;
interface NamedDefinition { name: NameKey; icon: TaxonomyIcon }
interface TypeDefinition extends NamedDefinition {
  kind: ContentKind;
  categories: Readonly<Record<string, NamedDefinition>>;
}

const icons = {
  article: { path: "M6 3h9l4 4v14H5V3h1Zm8 0v5h5M8 12h8M8 16h6" },
  video: { path: "M3 5h18v14H3zM10 9l5 3-5 3V9Z" },
  code: { path: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" },
  stories: { path: "M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3V4Zm9 2v15" },
  research: { path: "M9 3h6m-5 0v6l-6 10a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3M7 15h10" },
  ai: { path: "M12 3v3m0 12v3M3 12h3m12 0h3M6 6l2 2m8 8 2 2M6 18l2-2M16 8l2-2M8 8h8v8H8z" },
  games: { path: "M8 7h8c3 0 5 9 3 10-2 1-4-3-4-3H9s-2 4-4 3C3 16 5 7 8 7ZM7 10v4m-2-2h4m6-1h.01M17 13h.01" },
  systems: { path: "M7 3v4m5-4v4m5-4v4M7 17v4m5-4v4m5-4v4M3 7h4m-4 5h4m-4 5h4M17 7h4m-4 5h4m-4 5h4M7 7h10v10H7z" },
  products: { path: "m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7 6l9 5" },
  web: { path: "M3 4h18v16H3V4Zm0 5h18M6 6.5h.01M9 6.5h.01" },
  server: { path: "M4 3h16v7H4V3Zm0 11h16v7H4v-7ZM7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" },
  business: { path: "M4 21V5h10v16M14 10h6v11M2 21h20M7 8h4M7 12h4M7 16h4M17 13h.01M17 17h.01" },
  mobile: { path: "M7 2h10v20H7V2Zm0 4h10M11 18h2" },
  automation: { path: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z" },
  consulting: { path: "M4 3h16v13h-8l-5 5v-5H4V3Zm4 5h8M8 12h5" },
} satisfies Record<string, TaxonomyIcon>;

// IDs são permanentes; nome e SVG são obrigatórios em cada cadastro.
export const contentTaxonomy = {
  blog: {
    kind: "article", name: "blog", icon: icons.article,
    categories: {
      article: { name: "blogArticle", icon: icons.article },
      youtube: { name: "blogYoutube", icon: icons.video },
      "dev-log": { name: "blogDevLog", icon: icons.code },
      stories: { name: "blogStories", icon: icons.stories },
      experiments: { name: "blogExperiments", icon: icons.research },
    },
  },
  project: {
    kind: "project", name: "project", icon: icons.products,
    categories: {
      ai: { name: "projectAI", icon: icons.ai },
      games: { name: "projectGames", icon: icons.games },
      systems: { name: "projectSystems", icon: icons.systems },
      research: { name: "projectResearch", icon: icons.research },
      products: { name: "projectProducts", icon: icons.products },
      frontend: { name: "projectFrontend", icon: icons.web },
      backend: { name: "projectBackend", icon: icons.server },
    },
  },
  service: {
    kind: "service", name: "service", icon: icons.consulting,
    categories: {
      "internal-systems": { name: "serviceSystems", icon: icons.business },
      websites: { name: "serviceWeb", icon: icons.web },
      "mobile-apps": { name: "serviceMobile", icon: icons.mobile },
      automation: { name: "serviceAutomation", icon: icons.automation },
      consulting: { name: "serviceConsulting", icon: icons.consulting },
    },
  },
} as const satisfies Record<string, TypeDefinition>;

export type ContentType = keyof typeof contentTaxonomy;
export interface NamedTaxonomy { label: string; icon: TaxonomyIcon }
export interface TaxonomyCategory extends NamedTaxonomy {
  id: string;
  type: ContentType;
  value: string;
}
export interface TaxonomyType extends NamedTaxonomy {
  id: ContentType;
  kind: ContentKind;
  categories: TaxonomyCategory[];
}

const messages: Record<ContentLocale, Record<NameKey, string>> = { en, "pt-br": ptBR };

export function resolveContentType(kind: ContentKind, requested?: string): ContentType | undefined {
  const ids = Object.keys(contentTaxonomy) as ContentType[];
  return requested === undefined
    ? ids.find((id) => contentTaxonomy[id].kind === kind)
    : ids.find((id) => id === requested && contentTaxonomy[id].kind === kind);
}

export function taxonomyTypes(locale: ContentLocale): TaxonomyType[] {
  const copy = messages[locale];
  return (Object.entries(contentTaxonomy) as [ContentType, TypeDefinition][]).map(([id, definition]) => ({
    id, kind: definition.kind, label: copy[definition.name], icon: definition.icon,
    categories: Object.entries(definition.categories).map(([categoryId, category]) => ({
      id: categoryId, type: id, value: `${id}:${categoryId}`, label: copy[category.name], icon: category.icon,
    })),
  }));
}

export function taxonomyCategories(type: ContentType, locale: ContentLocale): TaxonomyCategory[] {
  return taxonomyTypes(locale).find(({ id }) => id === type)?.categories ?? [];
}

export function contentCategoryIds(metadata: Pick<ContentMetadata, "kind" | "contentType" | "categories" | "youtube">): readonly string[] {
  const type = resolveContentType(metadata.kind, metadata.contentType);
  if (!type) return [];
  return metadata.categories ?? (type === "blog" ? [metadata.youtube ? "youtube" : "article"] : []);
}

export function contentCategories(metadata: Pick<ContentMetadata, "kind" | "contentType" | "categories" | "youtube">, locale: ContentLocale): TaxonomyCategory[] {
  const type = resolveContentType(metadata.kind, metadata.contentType);
  if (!type) return [];
  const ids = contentCategoryIds(metadata);
  return taxonomyCategories(type, locale).filter(({ id }) => ids.includes(id));
}
