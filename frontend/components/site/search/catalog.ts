import { getRelativeLocaleUrl } from "astro:i18n";
import type { ContentEntry } from "../../../../backend/content/types";
import { contentCategories, resolveContentType, taxonomyTypes } from "../../../../backend/content/taxonomy";
import { searchRecordText, type SearchRecord, type SearchType } from "../../../../backend/search/search";
import type { Locale } from "../../../config/i18n";
import { sitePages, type PageId } from "../../../config/navigation";
import { articleHref } from "../../../paginas/blogs/data/articles";
import type { Messages } from "../../../utils/translations";

const pageTypes: Record<PageId, SearchType> = {
  home: "home", blogs: "blog", projects: "project", services: "service",
};

export function createSearchCatalog(articles: readonly ContentEntry[], locale: Locale, copy: Messages, basePath = "/"): SearchRecord[] {
  const types = taxonomyTypes(locale);
  const pages = sitePages.map((page): SearchRecord => {
    const type = types.find(({ id }) => id === pageTypes[page.id]);
    const record = {
      id: `page:${page.id}`,
      title: copy[page.titleKey],
      description: copy[page.descriptionKey],
      type: pageTypes[page.id],
      typeLabel: type?.label ?? copy[page.titleKey],
      ...(type ? { typeIcon: type.icon } : {}),
      // As seções são destinos de navegação, não publicações individuais.
      categories: type?.categories ?? [],
      tags: [],
      href: getRelativeLocaleUrl(locale, page.path),
      priority: 100,
      featured: true,
    };
    return { ...record, searchText: searchRecordText(record, page.id) };
  });

  // Somente artigos têm rotas de detalhe publicadas nesta etapa.
  const notes = articles.filter(({ metadata }) => metadata.kind === "article").map(({ metadata }): SearchRecord => {
    const typeId = resolveContentType(metadata.kind, metadata.contentType) ?? "blog";
    const type = types.find(({ id }) => id === typeId)!;
    const record = {
      id: `article:${metadata.id}`,
      title: metadata.title,
      description: metadata.description,
      type: typeId,
      typeLabel: type.label,
      typeIcon: type.icon,
      categories: contentCategories(metadata, locale),
      tags: metadata.tags,
      href: articleHref(metadata.id, locale, basePath),
      priority: 50,
      featured: false,
    };
    return { ...record, searchText: searchRecordText(record, metadata.id) };
  });

  return [...pages, ...notes].sort((a, b) => Number(b.featured) - Number(a.featured) || b.priority - a.priority);
}
