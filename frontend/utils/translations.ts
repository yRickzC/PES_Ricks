import english from "../../public/i18n/en.json";
import portuguese from "../../public/i18n/pt-br.json";
import type { Locale } from "../config/i18n";

export { documentLanguages, locales, type Locale } from "../config/i18n";

export interface Messages {
  description: string;
  homeLabel: string;
  languageSelector: string;
  englishOption: string;
  portugueseOption: string;
  labName: string;
  headingLine1: string;
  headingLine2: string;
  heroDescription: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroSupportingText: string;
  heroExploreProjects: string;
  heroGetInTouch: string;
  heroViewNotes: string;
  exploreLab: string;
  labStatus: string;
  homeTitle: string;
  homeWorkInProgress: string;
  homeFeaturedProjects: string;
  homeProjectsEmpty: string;
  homeProjectSlotEmpty: string;
  homeProjectSlot: string;
  homeProjectPrevious: string;
  homeProjectNext: string;
  homeProjectPosition: string;
  homeProjectDeckHint: string;
  homeAllProjects: string;
  homeViewProject: string;
  homeLatestPosts: string;
  homePostsEmpty: string;
  homeBlogHighlight: string;
  homeBlogNote: string;
  homeBlogEmptySlot: string;
  homeBlogImageEmpty: string;
  homeNewsPagination: string;
  homeNewsSlide: string;
  homeNewsPosition: string;
  homeAllPosts: string;
  homeAboutTitle: string;
  homeAboutHeadline: string;
  homeAboutIntro: string;
  homeAboutDescription: string;
  homeServicesTitle: string;
  homeServicesDescription: string;
  homeExploreServices: string;
  navigationLabel: string;
  blogsLabel: string;
  projectsLabel: string;
  servicesLabel: string;
  blogsDescription: string;
  blogHeroTitle: string;
  blogHeroSubtitle: string;
  blogExploreNotes: string;
  blogViewProjects: string;
  articleTags: string;
  projectsDescription: string;
  projectCategoriesLabel: string;
  servicesDescription: string;
  servicesUnderConstruction: string;
  serviceHeroTitleLine1: string;
  serviceHeroTitleLine2: string;
  serviceHeroSubtitle: string;
  serviceRequestQuote: string;
  serviceExploreSolutions: string;
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
  searchType: string;
  searchCategory: string;
  searchAllTypes: string;
  searchAllCategories: string;
  searchEmptyHint: string;
  searchResultsLabel: string;
}

export const messages: Record<Locale, Messages> = {
  en: english,
  "pt-br": portuguese,
};

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
