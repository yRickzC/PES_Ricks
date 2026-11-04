import type { ContentEntry } from "../../../../backend/content/types";
import { contentCategories, resolveContentType } from "../../../../backend/content/taxonomy";
import type { Locale } from "../../../config/i18n";
import { articleDate, articleHref } from "./articles";
import { normalizeBlogText, type BlogPost } from "./explore";

/** Build-time boundary: only published Blog articles, never navigation or other domains. */
export function createBlogPosts(entries: readonly ContentEntry[], locale: Locale, basePath = "/"): BlogPost[] {
  return entries.filter(({ metadata }) => metadata.kind === "article"
    && resolveContentType(metadata.kind, metadata.contentType) === "blog")
    .map(({ key, metadata }): BlogPost => {
      const categories = contentCategories(metadata, locale).map(({ id, label }) => ({ id, label }));
      return {
        id: key, title: metadata.title, summary: metadata.description,
        cover: { ...metadata.image }, categories, tags: [...metadata.tags], keywords: [...(metadata.keywords ?? [])],
        createdAt: metadata.date, updatedAt: metadata.updatedAt, dateLabel: articleDate(metadata.date, locale),
        featured: metadata.featured === true, featuredOrder: metadata.featuredOrder,
        href: articleHref(metadata.id, locale, basePath),
        searchText: normalizeBlogText([metadata.title, metadata.description,
          ...categories.flatMap(({ id, label }) => [id, label]), ...metadata.tags, ...(metadata.keywords ?? [])].join(" ")),
      };
    }).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || a.id.localeCompare(b.id));
}
