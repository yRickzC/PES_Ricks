import en from "../../../../public/i18n/landing.en.json";
import pt from "../../../../public/i18n/landing.pt-br.json";
import type { Locale } from "../../../config/i18n";

export type LandingCopy = typeof en;
const copy: Record<Locale, LandingCopy> = { en, "pt-br": pt };
export const getLandingCopy = (locale: Locale): LandingCopy => copy[locale];
