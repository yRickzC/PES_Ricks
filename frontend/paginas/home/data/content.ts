import type { ContentDatabase } from "../../../../backend/content/database";
import type { Locale } from "../../../config/i18n";
import { createBlogPosts } from "../../blogs/data/explore-catalog";
import { PROJECT_DECK_SIZE } from "../config/project-deck";

export function selectHomeContent(database: ContentDatabase, locale: Locale, basePath = "/") {
  const projects = database.list({ contentType: "project", locale })
    .filter(({ metadata }) => metadata.featured === true)
    .sort((a, b) => (a.metadata.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.metadata.featuredOrder ?? Number.MAX_SAFE_INTEGER)
      || (b.metadata.date ?? "").localeCompare(a.metadata.date ?? "") || a.key.localeCompare(b.key))
    .slice(0, PROJECT_DECK_SIZE);
  // O adaptador do Blog já ordena por publicação, sem priorizar destaques.
  const posts = createBlogPosts(database.list({ kind: "article", contentType: "blog", locale }), locale, basePath);

  return { projects, posts };
}
