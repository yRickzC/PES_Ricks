import type { Locale } from "../../../config/i18n";

export const PAGE_SIZE = 10;
export interface BlogCategory { id: string; label: string }
export interface BlogCover { src: string; alt: string; srcset?: string; width?: number; height?: number }
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  cover: BlogCover;
  categories: BlogCategory[];
  tags: string[];
  keywords: string[];
  createdAt?: string;
  updatedAt?: string;
  dateLabel?: string;
  featured: boolean;
  featuredOrder?: number;
  href: string;
  searchText: string;
}
export interface BlogState { query: string; category: string; tags: string[]; page: number }
export type BlogAction =
  | { type: "query" | "category"; value: string }
  | { type: "tags"; value: string[] }
  | { type: "page"; value: number }
  | { type: "reset" };

export function normalizeBlogText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

export function blogFilterOptions(posts: readonly BlogPost[], locale: Locale) {
  const categories = new Map(posts.flatMap((post) => post.categories.map((category) => [category.id, category] as const)));
  return {
    categories: [...categories.values()].sort((a, b) => a.label.localeCompare(b.label, locale)),
    tags: [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, locale)),
  };
}

export function initialBlogState(): BlogState { return { query: "", category: "", tags: [], page: 1 }; }

export function reduceBlogState(state: BlogState, action: BlogAction): BlogState {
  if (action.type === "reset") return initialBlogState();
  if (action.type === "page") return { ...state, page: Number.isSafeInteger(action.value) ? Math.max(1, action.value) : 1 };
  if (action.type === "tags") return { ...state, tags: [...new Set(action.value)], page: 1 };
  return { ...state, [action.type]: action.value, page: 1 };
}

export function selectBlogPage(posts: readonly BlogPost[], state: BlogState) {
  const terms = normalizeBlogText(state.query).split(/\s+/u).filter(Boolean);
  const active = terms.length > 0 || !!state.category || state.tags.length > 0;
  const filtered = posts.filter((post) => terms.every((term) => post.searchText.includes(term))
    && (!state.category || post.categories.some(({ id }) => id === state.category))
    && state.tags.every((tag) => post.tags.includes(tag)));
  if (!active) filtered.sort((a, b) => Number(b.featured) - Number(a.featured)
    || (a.featured && b.featured ? (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER) : 0)
    || (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || a.id.localeCompare(b.id));
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const page = Math.min(Math.max(1, Number.isSafeInteger(state.page) ? state.page : 1), Math.max(1, pageCount));
  return {
    active, total: filtered.length, pageCount, page,
    visible: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  };
}

export function readBlogState(params: URLSearchParams): BlogState {
  const value = params.get("page") ?? "1";
  const page = /^\d+$/u.test(value) && Number.isSafeInteger(Number(value)) ? Math.max(1, Number(value)) : 1;
  return { query: params.get("q") ?? "", category: params.get("category") ?? "",
    tags: [...new Set(params.getAll("tag").filter(Boolean))], page };
}

export function blogStateUrl(url: URL, state: BlogState): URL {
  const next = new URL(url);
  for (const key of ["q", "category", "tag", "page"]) next.searchParams.delete(key);
  if (state.query.trim()) next.searchParams.set("q", state.query.trim());
  if (state.category) next.searchParams.set("category", state.category);
  for (const tag of state.tags) next.searchParams.append("tag", tag);
  if (state.page > 1) next.searchParams.set("page", String(state.page));
  return next;
}

/** A bounded window keeps pagination usable even with hundreds of pages. */
export function blogPageNumbers(page: number, count: number): (number | "…")[] {
  const values = [...new Set([1, page - 1, page, page + 1, count])].filter((value) => value >= 1 && value <= count).sort((a, b) => a - b);
  return values.flatMap<number | "…">((value, index) => index && value - values[index - 1]! > 1 ? ["…", value] : [value]);
}
