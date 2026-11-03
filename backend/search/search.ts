import type { ContentType, TaxonomyCategory, TaxonomyIcon } from "../content/taxonomy.ts";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

// Todos os termos precisam aparecer; caixa e acentos não afetam a busca.
export function matchesSearch(text: string, query: string): boolean {
  const haystack = normalize(text);
  return normalize(query).split(/\s+/u).every((term) => haystack.includes(term));
}

export type SearchType = ContentType | "home";
export type SearchTypeFilter = ContentType | "all";
export type SearchCategory = Pick<TaxonomyCategory, "value" | "label" | "type">;

export interface SearchableEntry {
  type: SearchType;
  categories: readonly SearchCategory[];
  searchText: string;
}

export interface SearchRecord extends SearchableEntry {
  id: string;
  title: string;
  description: string;
  typeLabel: string;
  typeIcon?: TaxonomyIcon;
  tags: readonly string[];
  href: string;
  priority: number;
  featured: boolean;
}

export interface SearchFilters {
  query: string;
  type: SearchTypeFilter;
  category: string;
}

export function searchRecordText(record: Omit<SearchRecord, "searchText">, extra = ""): string {
  return [record.title, record.description, record.type, record.typeLabel,
    ...record.categories.flatMap(({ label, value }) => [label, value]), ...record.tags, record.href, extra].join(" ");
}

export function matchesSearchFilters(entry: SearchableEntry, filters: SearchFilters): boolean {
  return (filters.type === "all" || entry.type === filters.type)
    && (filters.category === "all" || entry.categories.some(({ value }) => value === filters.category))
    && matchesSearch(entry.searchText, filters.query);
}

export function searchCategories(catalog: readonly SearchCategory[], type: SearchTypeFilter, locale = "en"): SearchCategory[] {
  return catalog.filter((category) => type === "all" || category.type === type)
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}
