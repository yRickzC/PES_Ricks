function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

// Todos os termos precisam aparecer; caixa e acentos não afetam a busca.
export function matchesSearch(text: string, query: string): boolean {
  const haystack = normalize(text);
  return normalize(query).split(/\s+/u).every((term) => haystack.includes(term));
}
