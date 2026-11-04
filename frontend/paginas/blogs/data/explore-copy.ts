import english from "../../../../public/i18n/blog.en.json";
import portuguese from "../../../../public/i18n/blog.pt-br.json";
import type { Locale } from "../../../config/i18n";
export type BlogCopy = typeof english;
const messages: Record<Locale, BlogCopy> = { en: english, "pt-br": portuguese };
export function blogCopy(locale: Locale): BlogCopy { return messages[locale]; }

export function blogCount(copy: BlogCopy, total: number, active: boolean, query: string): string {
  const message = active ? (total === 1 ? copy.resultsOne : copy.resultsMany) : (total === 1 ? copy.notesOne : copy.notesMany);
  const count = message.replace("{count}", String(total));
  return query.trim() ? copy.queryCount.replace("{count}", count).replace("{query}", query.trim()) : count;
}
