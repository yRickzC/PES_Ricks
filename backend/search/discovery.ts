import { normalizeSearchText, type SearchableEntry, type SearchFilters } from "./search.ts";

const stopWords = new Set((
  "a as o os de da das do dos e em na nas no nos um uma uns umas para pra por com que " +
  "me meu meus minha minhas eu quero preciso gostaria ter sobre como qual the a an and of in on to for " +
  "with my me i want need would like have about how what is"
).split(" "));
const pageWords = ["site", "sites", "website", "websites", "webpage", "pagina", "page", "landing", "landingpage"];
const purposeWords = ["produto", "product", "servico", "service", "negocio", "business", "vender", "sell",
  "vendas", "sales", "divulgar", "promote", "campanha", "campaign", "lancamento", "launch", "clientes", "leads"];
const requestWords = ["quero", "preciso", "criar", "fazer", "montar", "want", "need", "create", "build", "make"];

function words(text: string): string[] {
  return text.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

// At most one insertion, deletion, substitution or adjacent transposition.
// Short words must match exactly, avoiding unrelated results such as "app" / "api".
function nearby(word: string, candidate: string): boolean {
  if (word === candidate) return true;
  if (Math.min(word.length, candidate.length) < 4 || Math.max(word.length, candidate.length) > 48
    || Math.abs(word.length - candidate.length) > 1) return false;
  let index = 0;
  while (word[index] === candidate[index]) index++;
  if (word.length === candidate.length) {
    return word.slice(index + 1) === candidate.slice(index + 1)
      || (word[index] === candidate[index + 1] && word[index + 1] === candidate[index]
        && word.slice(index + 2) === candidate.slice(index + 2));
  }
  return word.length > candidate.length
    ? word.slice(index + 1) === candidate.slice(index)
    : word.slice(index) === candidate.slice(index + 1);
}

function containsAny(tokens: readonly string[], vocabulary: readonly string[]): boolean {
  return tokens.some((token) => vocabulary.some((candidate) => nearby(token, candidate)));
}

export function prepareSearchQuery(value: string) {
  // Bound work per keystroke, including unusually long pasted text.
  const text = normalizeSearchText(value.slice(0, 513));
  const tokens = words(text);
  const terms = [...new Set(tokens.filter((token) => !stopWords.has(token)))];
  const hasPage = containsAny(tokens, pageWords);
  const pageForSomething = tokens.some((token, index) => containsAny([token], pageWords)
    && ["para", "pra", "for"].includes(tokens[index + 1] ?? "")
    && tokens.slice(index + 2).some((word) => !stopWords.has(word)));
  return {
    text, terms,
    tooLong: value.length > 512 || terms.length > 16,
    landingIntent: hasPage && (pageForSomething || containsAny(tokens, purposeWords) || containsAny(tokens, requestWords)),
  };
}

export function prepareSearchEntry<T extends SearchableEntry & { title?: string }>(entry: T) {
  const text = normalizeSearchText(entry.searchText);
  const title = normalizeSearchText(entry.title ?? "");
  return { ...entry, text, title, words: [...new Set(words(text))], titleWords: words(title) };
}

export function searchEntryScore(
  entry: ReturnType<typeof prepareSearchEntry>,
  query: ReturnType<typeof prepareSearchQuery>,
  filters: Pick<SearchFilters, "type" | "category">,
): number {
  if (query.tooLong || (filters.type !== "all" && entry.type !== filters.type)
    || (filters.category !== "all" && !entry.categories.some(({ value }) => value === filters.category))) return 0;
  if (!query.terms.length) return 1;

  let score = entry.title === query.text ? 400 : 100;
  for (const term of query.terms) {
    if (entry.text.includes(term)) {
      if (entry.title.includes(term)) score += 20;
    } else if (entry.words.some((word) => nearby(term, word))) {
      score -= 5;
      if (entry.titleWords.some((word) => nearby(term, word))) score += 10;
    } else {
      // Business names need not appear in the index: "site para minha padaria".
      return entry.searchIntent === "landing-page" && query.landingIntent ? 10 : 0;
    }
  }
  return score;
}
