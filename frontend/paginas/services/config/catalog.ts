import type { contentTaxonomy } from "../../../../backend/content/taxonomy";
import english from "../../../../public/i18n/services.en.json";
import portuguese from "../../../../public/i18n/services.pt-br.json";
import type { Locale } from "../../../config/i18n";

export const serviceCategoryIds = ["websites", "internal-systems", "mobile-apps", "automation"] as const satisfies readonly (keyof typeof contentTaxonomy.service.categories)[];

// Stable URLs shared by the catalog and static detail routes, in offer order.
export const serviceOfferSlugs = {
  websites: ["company-website", "landing-page", "online-store"],
  "internal-systems": ["custom-erp", "internal-portal"],
  "mobile-apps": ["customer-app", "field-app"],
  automation: ["workflow-automation", "system-integrations"],
} as const satisfies Record<(typeof serviceCategoryIds)[number], readonly string[]>;

const messages: Record<Locale, typeof english> = { en: english, "pt-br": portuguese };

export function getServiceCopy(locale: Locale) {
  return messages[locale];
}
