interface BlogCountMessages {
  resultsOne: string;
  resultsMany: string;
  notesOne: string;
  notesMany: string;
  queryCount: string;
}

export function blogCount(copy: BlogCountMessages, total: number, active: boolean, query: string): string {
  const message = active ? (total === 1 ? copy.resultsOne : copy.resultsMany) : (total === 1 ? copy.notesOne : copy.notesMany);
  const count = message.replace("{count}", String(total));
  return query.trim() ? copy.queryCount.replace("{count}", count).replace("{query}", query.trim()) : count;
}
