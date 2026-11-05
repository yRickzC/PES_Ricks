import english from "../../../../public/i18n/blog.en.json";
import portuguese from "../../../../public/i18n/blog.pt-br.json";
import type { Locale } from "../../../config/i18n";
export type BlogCopy = typeof english;
const messages: Record<Locale, BlogCopy> = { en: english, "pt-br": portuguese };
export function blogCopy(locale: Locale): BlogCopy { return messages[locale]; }

export { blogCount } from "./blog-count";
