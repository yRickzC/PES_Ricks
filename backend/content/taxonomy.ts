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
  // Lucide outlines, rendered by the existing TaxonomyIcon component.
  globe: { path: "M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20 M2 12h20" },
  gamepad: { path: "M6 11L10 11 M8 9L8 13 M15 12L15.01 12 M18 10L18.01 10 M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" },
  cpu: { path: "M12 20v2 M12 2v2 M17 20v2 M17 2v2 M2 12h2 M2 17h2 M2 7h2 M20 12h2 M20 17h2 M20 7h2 M7 20v2 M7 2v2 M6 4H18a2 2 0 0 1 2 2V18a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2V6a2 2 0 0 1 2 -2Z M9 8H15a1 1 0 0 1 1 1V15a1 1 0 0 1 -1 1H9a1 1 0 0 1 -1 -1V9a1 1 0 0 1 1 -1Z" },
  smartphone: { path: "M7 2H17a2 2 0 0 1 2 2V20a2 2 0 0 1 -2 2H7a2 2 0 0 1 -2 -2V4a2 2 0 0 1 2 -2Z M12 18h.01" },
  package: { path: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z M12 22V12 M3.29 7 12 12 20.71 7 M0 0 m7.5 4.27 9 5.15" },
  brainCircuit: { path: "M12 13h4 M12 18h6a2 2 0 012 2v1 M12 8h8 M12 9a4.17 4.17 0 01-3 4 M16 8V5a2 2 0 012-2 M6 18a4 4 0 01-2-7.465 M6.004 5.125a4 4 0 00-2.526 5.77 M6.294 6.294A3 3 0 1112 5v13a4 4 0 11-7.967-.518 M15.5 13a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0 M17.5 3a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0 M19.5 21a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0 M19.5 8a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0" },
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
      "low-level": { name: "projectLowLevel", icon: icons.cpu },
      "game-dev": { name: "projectGameDev", icon: icons.gamepad },
      products: { name: "projectProducts", icon: icons.package },
      "machine-learning": { name: "projectMachineLearning", icon: icons.brainCircuit },
      mobile: { name: "projectMobile", icon: icons.smartphone },
      web: { name: "projectWeb", icon: icons.globe },
    },
  },
  service: {
    kind: "service", name: "service", icon: icons.consulting,
    categories: {
      "internal-systems": { name: "serviceSystems", icon: icons.business },
      websites: { name: "serviceWeb", icon: icons.web },
      "mobile-apps": { name: "serviceMobile", icon: icons.mobile },
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
