import en from "../../../../public/i18n/landing.en.json";
import pt from "../../../../public/i18n/landing.pt-br.json";
import type { Locale } from "../../../config/i18n";

export type LandingCopy = typeof en;
const copy: Record<Locale, LandingCopy> = { en, "pt-br": pt };
export const getLandingCopy = (locale: Locale): LandingCopy => copy[locale];

export const landingInitialMonths = 6;
export type LandingPlanId = keyof LandingCopy["pricing"]["plans"];
interface LandingPlanDefinition {
  id: LandingPlanId;
  development: number;
  monthly: number;
  recommended: boolean;
}
export const landingPlanDefinitions = [
  { id: "essential", development: 400, monthly: 100, recommended: false },
  { id: "professional", development: 800, monthly: 200, recommended: true },
  { id: "advanced", development: 1200, monthly: 250, recommended: false },
] as const satisfies readonly LandingPlanDefinition[];

export function getLandingPlans(locale: Locale) {
  const pricing = getLandingCopy(locale).pricing;
  const currency = new Intl.NumberFormat(locale, {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  });
  return landingPlanDefinitions.map((plan) => ({
    ...plan,
    ...pricing.plans[plan.id],
    developmentPrice: currency.format(plan.development),
    monthlyPrice: currency.format(plan.monthly),
    initialTotal: currency.format(plan.development + plan.monthly * landingInitialMonths),
  }));
}
