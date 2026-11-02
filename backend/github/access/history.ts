import { documentReferences, parseLu } from "../../content/parser.ts";
import { contentKey, freezeContent, type ContentDocument } from "../../content/types.ts";
import { githubPropsErrors, githubSnapshotKey, type GithubWidgetProps } from "../../content/widgets.ts";
import { isObject } from "../../content/validation.ts";

export type GithubHistoryResult =
  | { status: "ready"; key: string; documents: readonly ContentDocument[] }
  | { status: "unavailable"; key: string; message: string };

export interface GithubHistoryOptions {
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  maxFiles?: number;
  maxFileBytes?: number;
  signal?: AbortSignal;
}

// Repositórios públicos somente. Nenhuma credencial é aceita ou enviada.
export async function loadGithubHistory(config: GithubWidgetProps, options: GithubHistoryOptions = {}): Promise<GithubHistoryResult> {
  const key = githubSnapshotKey(config);
  const errors = githubPropsErrors(config);
  if (errors.length) return { status: "unavailable", key, message: errors.join(" ") };
  const request = options.fetch ?? globalThis.fetch;
  const maxFiles = options.maxFiles ?? 50;
  const maxFileBytes = options.maxFileBytes ?? 256_000;
  const timeoutMs = options.timeoutMs ?? 15_000;
  if (!Number.isInteger(maxFiles) || maxFiles < 1 || maxFiles > 200
    || !Number.isInteger(maxFileBytes) || maxFileBytes < 1 || maxFileBytes > 2_000_000
    || !Number.isFinite(timeoutMs) || timeoutMs < 1 || timeoutMs > 120_000) {
    return { status: "unavailable", key, message: "Limites de importação GitHub inválidos." };
  }
  const controller = new AbortController();
  const abort = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) abort();
  else options.signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const api = `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
  const get = async (url: string): Promise<unknown> => {
    const response = await request(url, { signal: controller.signal, credentials: "omit", headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub indisponível: HTTP ${response.status}${response.status === 403 || response.status === 429 ? " (acesso ou limite de requisições)" : ""}.`);
    return response.json();
  };
  try {
    const tree = await get(`${api}/git/trees/${encodeURIComponent(config.ref)}?recursive=1`);
    if (!isObject(tree) || !Array.isArray(tree.tree) || typeof tree.truncated !== "boolean") throw new Error("Resposta inválida da árvore GitHub.");
    if (tree.truncated) throw new Error("Árvore GitHub truncada; espelhe os changelogs em public/content para garantir o histórico completo.");
    const directory = config.directory ?? ".github";
    const files = tree.tree.filter((entry): entry is { type: string; path: string; sha: string; size?: number } =>
      isObject(entry) && entry.type === "blob" && typeof entry.path === "string"
      && entry.path.startsWith(`${directory}/`) && /^changelog(?:\.[a-z]{2}(?:[-_][a-z]{2})?)?\.lu$/u.test(entry.path.split("/").at(-1)!)
      && typeof entry.sha === "string" && /^[a-f0-9]{40,64}$/u.test(entry.sha));
    files.sort((a, b) => a.path.localeCompare(b.path));
    if (files.length > maxFiles) throw new Error(`Histórico excede o limite de ${maxFiles} arquivos; nenhum histórico parcial foi importado.`);
    const documents: ContentDocument[] = [];
    const keys = new Set<string>();
    // Sequencial por padrão para limitar chamadas à API e memória.
    for (const file of files) {
      if (typeof file.size === "number" && file.size > maxFileBytes) throw new Error(`${file.path}: arquivo muito grande.`);
      // SHA do blob fixa o conteúdo mesmo se a branch mudar durante a leitura.
      const blob = await get(`${api}/git/blobs/${file.sha}`);
      if (!isObject(blob) || blob.encoding !== "base64" || typeof blob.content !== "string"
        || (typeof blob.size === "number" && blob.size > maxFileBytes)
        || blob.content.length > Math.ceil(maxFileBytes / 3) * 4 + Math.ceil(maxFileBytes / 40) + 16) throw new Error(`${file.path}: blob inválido ou muito grande.`);
      const binary = atob(blob.content.replace(/\s/gu, ""));
      if (binary.length > maxFileBytes) throw new Error(`${file.path}: arquivo muito grande.`);
      const source = new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
      const document = parseLu(source, `${config.owner}/${config.repo}@${config.ref}/${file.path}`);
      if (document.metadata.kind !== "changelog") throw new Error(`${file.path}: kind precisa ser changelog.`);
      // Conteúdo remoto não injeta widgets ou ligações no catálogo local.
      if (document.blocks.some((block) => block.type === "widget") || documentReferences(document).length || document.metadata.relations.length) throw new Error(`${file.path}: espelhe em public/content para usar widgets e relações locais.`);
      const documentKey = contentKey(document.metadata);
      if (keys.has(documentKey)) throw new Error(`${file.path}: changelog duplicado: ${documentKey}.`);
      keys.add(documentKey);
      documents.push(document);
    }
    documents.sort((a, b) => b.metadata.date!.localeCompare(a.metadata.date!) || a.metadata.id.localeCompare(b.metadata.id));
    return freezeContent({ status: "ready" as const, key, documents });
  } catch (error) {
    return { status: "unavailable", key, message: controller.signal.aborted ? "Leitura do histórico GitHub cancelada ou tempo limite excedido." : error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}

export function createGithubHistoryClient(options: GithubHistoryOptions = {}) {
  const cache = new Map<string, Promise<GithubHistoryResult>>();
  return Object.freeze({
    load: (config: GithubWidgetProps): Promise<GithubHistoryResult> => {
      const key = githubSnapshotKey(config);
      let pending = cache.get(key);
      if (!pending) {
        pending = loadGithubHistory(config, options);
        cache.set(key, pending);
        const current = pending;
        void current.then((result) => { if (result.status === "unavailable" && cache.get(key) === current) cache.delete(key); });
      }
      return pending;
    },
    clear: () => cache.clear(),
  });
}
