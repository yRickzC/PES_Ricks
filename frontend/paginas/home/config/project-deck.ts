export const PROJECT_DECK_SIZE = 7;

export function getProjectDeckMiddle(count: number): number {
  return Math.max(0, Math.floor((count - 1) / 2));
}
