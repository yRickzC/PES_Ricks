import english from "../../public/i18n/en.json";
import portuguese from "../../public/i18n/pt-br.json";
import type { Locale } from "../config/i18n";

export { documentLanguages, locales, type Locale } from "../config/i18n";

export interface Messages {
  siteTitle: string;
  description: string;
  homeLabel: string;
  languageSelector: string;
  englishOption: string;
  portugueseOption: string;
  labName: string;
  heroEyebrow: string;
  headingLine1: string;
  headingLine2: string;
  heroDescription: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroSupportingText: string;
  heroExploreProjects: string;
  heroViewNotes: string;
  exploreLab: string;
  labStatus: string;
  homeTitle: string;
  navigationLabel: string;
  blogsLabel: string;
  projectsLabel: string;
  servicesLabel: string;
  blogsDescription: string;
  articleTags: string;
  projectsDescription: string;
  servicesDescription: string;
  sectionEmpty: string;
  socialNetworks: string;
  comingSoon: string;
  openMenu: string;
  closeMenu: string;
  skipToContent: string;
  searchLabel: string;
  searchTitle: string;
  closeSearch: string;
  searchPlaceholder: string;
  searchHint: string;
  searchNoResults: string;
  searchResults: string;
}

export const messages: Record<Locale, Messages> = {
  en: english,
  "pt-br": portuguese,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
