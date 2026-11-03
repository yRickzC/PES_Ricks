import type { PublicContent } from "../../../../backend/content/node/pipeline.ts";
import { renderLu } from "../../../../backend/content/render.ts";
import type { ContentDocument } from "../../../../backend/content/types.ts";
import { defaultLocale, documentLanguages, locales, type Locale } from "../../../config/i18n";
import { withBasePath } from "../../../utils/base-path";

export function articleHref(id: string, locale: Locale, basePath = "/"): string {
  const route = (locale === defaultLocale ? "" : "/" + locale) + "/blogs/" + encodeURIComponent(id) + "/";
  return withBasePath(route, basePath);
}

export function articleDate(date: string | undefined, locale: Locale): string | undefined {
  if (!date) return undefined;
  return new Intl.DateTimeFormat(documentLanguages[locale], {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(date + "T00:00:00Z"));
}

export interface ArticlePageProps {
  document: ContentDocument;
  html: string;
  locale: Locale;
  languagePaths: Partial<Record<Locale, string>>;
}

// Uma página por identidade/idioma, incluindo os fallbacks escolhidos pelo catálogo.
export function articlePages(content: PublicContent, locale: Locale, basePath = "/") {
  return content.database.list({ kind: "article", locale }).map((entry) => {
    const document = content.documents.get(entry.path);
    if (!document) throw new Error("Corpo LU ausente: " + entry.path + ".");
    const languagePaths: ArticlePageProps["languagePaths"] = {};
    for (const language of locales) {
      if (content.database.get("article:" + entry.metadata.id, language)) {
        languagePaths[language] = articleHref(entry.metadata.id, language, basePath);
      }
    }
    const props: ArticlePageProps = {
      document, locale, languagePaths,
      html: renderLu(document, {
        database: content.database, locale,
        resolveUrl: (url) => withBasePath(url, basePath),
        resolveHref: (target) => target.metadata.kind === "article"
          ? articleHref(target.metadata.id, target.metadata.locale ?? locale, basePath) : undefined,
      }),
    };
    return { params: { id: entry.metadata.id }, props };
  });
}