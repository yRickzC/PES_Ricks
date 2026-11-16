import type { ContentEntry } from "../../../../backend/content/types";
import { contentCategories, resolveContentType, taxonomyTypes } from "../../../../backend/content/taxonomy";
import { searchRecordText, type SearchRecord, type SearchType } from "../../../../backend/search/search";
import { defaultLocale, type Locale } from "../../../config/i18n";
import { primaryNavigation, type PageId } from "../../../config/navigation";
import { articleHref } from "../../../paginas/blogs/data/articles";
import { getServiceCopy, serviceOfferSlugs } from "../../../paginas/services/config/catalog";
import { withBasePath } from "../../../utils/base-path";
import type { Messages } from "../../../utils/translations";

const pageTypes: Record<Exclude<PageId, "home">, SearchType> = {
  blogs: "blog", projects: "project", services: "service",
};

export function createSearchCatalog(articles: readonly ContentEntry[], locale: Locale, copy: Messages, basePath = "/"): SearchRecord[] {
  const types = taxonomyTypes(locale);
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const href = (path: string) => withBasePath(`${prefix}/${path.replace(/\/+$/u, "")}/`, basePath);
  const pages = primaryNavigation.map((page): SearchRecord => {
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
      href: href(page.path),
      priority: 100,
      featured: true,
    };
    return { ...record, searchText: searchRecordText(record, page.id) };
  });

  // Only this offer is available; the other service cards are under construction.
  const slug = "landing-page";
  const offer = getServiceCopy(locale).websites.offers[serviceOfferSlugs.websites.indexOf(slug)]!;
  const serviceType = types.find(({ id }) => id === "service")!;
  const landing: Omit<SearchRecord, "searchText"> = {
    id: `service:${slug}`, title: offer.title, description: offer.description,
    type: "service", typeLabel: serviceType.label, typeIcon: serviceType.icon,
    categories: serviceType.categories.filter(({ id }) => id === "websites"), tags: [],
    href: href(`services/${slug}`), priority: 110, featured: true, searchIntent: slug,
  };
  const aliases = locale === "pt-br"
    ? "landingpage hotsite site profissional criacao pagina unica vendas vender divulgar divulgacao promover apresentar produto servico negocio empresa loja curso evento campanha lancamento gerar captar conseguir clientes leads captura contato orcamento lista de espera conversao"
    : "landingpage website webpage professional single sales page sell advertise promote product service business company shop course event campaign launch generate attract customers leads capture contact quote waitlist conversion";
  const services = [{ ...landing, searchText: searchRecordText(landing, aliases) }];

  // Articles retain their actual published detail URLs.
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

  return [...pages, ...services, ...notes].sort((a, b) => Number(b.featured) - Number(a.featured) || b.priority - a.priority);
}
