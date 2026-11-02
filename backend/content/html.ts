import { isSafeUrl } from "./validation.ts";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function safeHref(value: string): string {
  if (!isSafeUrl(value)) throw new Error(`URL não permitida: ${value}`);
  return escapeHtml(value);
}
