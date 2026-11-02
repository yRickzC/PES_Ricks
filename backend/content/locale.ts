import { ContentValidationError, type ContentLocale } from "./types.ts";

export function normalizeContentLocale(value: string): ContentLocale | undefined {
  const locale = value.toLowerCase().replace(/_/gu, "-");
  return locale === "en" || locale === "pt-br" ? locale : undefined;
}

export function sourceLocale(source: string): ContentLocale | undefined {
  const suffix = /\.([a-z]{2}(?:[-_][a-z]{2})?)\.lu$/iu.exec(source)?.[1];
  if (!suffix) return undefined;
  const locale = normalizeContentLocale(suffix);
  if (!locale) throw new ContentValidationError([{ source, field: "locale", message: `Idioma não suportado: ${suffix}. Use .en.lu ou .pt_br.lu.` }]);
  return locale;
}
