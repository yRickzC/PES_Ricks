import { ContentValidationError, type ContentBlock, type ContentDocument, type ContentKey, type Inline, type JsonObject } from "./types.ts";
import { isContentKey, isSafeUrl, parseMetadata } from "./validation.ts";
import { normalizeContentLocale, sourceLocale } from "./locale.ts";
import { normalizeWidgetName, parseProperties } from "./properties.ts";

function configMetadata(props: JsonObject, source: string) {
  const aliases: Record<string, string> = {
    tipo: "kind", type: "kind", titulo: "title", descricao: "description", imagem: "image",
    "imagem-alt": "image-alt", data: "date", idioma: "locale", relacoes: "relations",
  };
  const raw: JsonObject = Object.create(null);
  for (const [key, value] of Object.entries(props)) {
    const canonical = Object.hasOwn(aliases, normalizeWidgetName(key)) ? aliases[normalizeWidgetName(key)]! : key;
    if (Object.hasOwn(raw, canonical)) throw new ContentValidationError([{ source, field: canonical, message: "Campo repetido por alias." }]);
    raw[canonical] = value;
  }
  raw.version ??= 1;
  const folders: Record<string, string> = { articles: "article", blogs: "article", projects: "project", services: "service", locations: "location", changelogs: "changelog" };
  raw.kind ??= source.split(/[\\/]/u).map((part) => Object.hasOwn(folders, part) ? folders[part] : undefined).find(Boolean) ?? (/changelog(?:\.[a-z_-]+)?\.lu$/iu.test(source) ? "changelog" : "article");
  for (const field of ["tags", "relations"]) if (typeof raw[field] === "string") raw[field] = raw[field].split(",").map((item) => item.trim()).filter(Boolean);
  if (typeof raw.image === "string") raw.image = { src: raw.image, alt: raw["image-alt"] ?? raw.title ?? "" };
  else if (raw["image-alt"] !== undefined) throw new ContentValidationError([{ source, field: "image-alt", message: "Use image: caminho com image-alt, ou image.src e image.alt." }]);
  delete raw["image-alt"];
  const filenameLocale = sourceLocale(source);
  if (typeof raw.locale === "string") raw.locale = normalizeContentLocale(raw.locale) ?? raw.locale;
  if (raw.locale === undefined && filenameLocale) raw.locale = filenameLocale;
  // Não introduzir undefined nos metadados serializáveis.
  if (raw.locale === undefined) delete raw.locale;
  return parseMetadata(raw, source);
}

export function parseInline(value: string, source: string, line: number): Inline[] {
  const result: Inline[] = [];
  // Inline deliberadamente sem HTML, execução, nesting ou avaliação de expressões.
  const pattern = /`([^`]+)`|!\[([^\]]*)\]\(([^\s)]+)\)|\[\[([^\]]+)\]\]|\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/gu;
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    const index = match.index;
    if (index > cursor) result.push({ type: "text", value: value.slice(cursor, index) });
    if (match[1] !== undefined) result.push({ type: "code", value: match[1] });
    else if (match[4] !== undefined) {
      const [target, ...label] = match[4].split("|");
      if (!isContentKey(target)) throw new ContentValidationError([{ source, line, field: "reference", message: `Referência inválida: ${target}.` }]);
      result.push({ type: "reference", target, ...(label.length ? { label: label.join("|") } : {}) });
    } else if (match[2] !== undefined || match[5] !== undefined) {
      const image = match[2] !== undefined;
      const label = image ? match[2]! : match[5]!;
      const url = image ? match[3]! : match[6]!;
      if (!isSafeUrl(url, image)) throw new ContentValidationError([{ source, line, field: image ? "image" : "link", message: `URL não permitida: ${url}.` }]);
      if (image && !label.trim()) throw new ContentValidationError([{ source, line, field: "image", message: "Imagem precisa de descrição alternativa." }]);
      result.push({ type: image ? "image" : "link", label, url });
    } else result.push({ type: match[7] !== undefined ? "strong" : "emphasis", value: match[7] ?? match[8]! });
    cursor = index + match[0].length;
  }
  if (cursor < value.length) result.push({ type: "text", value: value.slice(cursor) });
  return result;
}

export function parseLu(input: string, source = "content.lu"): ContentDocument {
  const lines = input.replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n").split("\n");
  const fail = (line: number, message: string): never => { throw new ContentValidationError([{ source, line, field: "syntax", message }]); };
  let config: JsonObject | undefined;
  const blocks: ContentBlock[] = [];
  const isStart = (line: string) => /^(#{1,6}\s|`{3,}|>\s?|[-*]\s|\d+\.\s|---\s*$)/u.test(line);
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]!;
    const number = index + 1;
    if (!line.trim()) { index++; continue; }
    const fence = /^(`{3,})([^`]*)$/u.exec(line);
    if (fence) {
      const info = fence[2]!.trim();
      const start = ++index;
      const closing = new RegExp(`^\x60{${fence[1]!.length},}\\s*$`, "u");
      while (index < lines.length && !closing.test(lines[index]!)) index++;
      if (index === lines.length) fail(number, "Bloco sem fechamento de crases correspondente.");
      const body = lines.slice(start, index);
      if (info.startsWith("$")) {
        const name = normalizeWidgetName(info.slice(1));
        if (!/^[a-z][a-z0-9-]*$/u.test(name)) fail(number, "Informe um nome de widget válido depois de $.");
        const props = parseProperties(body, source, start + 1);
        if (name === "config") {
          if (config) fail(number, "Use somente um bloco $Config por arquivo.");
          config = props;
        } else blocks.push({ type: "widget", name, props, line: number });
      } else if (info.startsWith("@")) {
        const code = /^@([a-zA-Z0-9_+#.-]+)(?:\(([^\r\n]+)\))?$/u.exec(info);
        if (!code) fail(number, "Use @linguagem ou @linguagem(nome do arquivo).");
        blocks.push({ type: "code", language: code![1]!, ...(code![2] ? { filename: code![2] } : {}), value: body.join("\n") });
      } else {
        const literalInfo = info.replace(/^\\(?=[@$])/u, "");
        blocks.push({ type: "code", language: /^[a-zA-Z0-9_+#.-]+$/u.test(literalInfo) ? literalInfo : "", value: body.join("\n") });
      }
      index++;
      continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/u.exec(line);
    if (heading) { blocks.push({ type: "heading", level: heading[1]!.length, content: parseInline(heading[2]!, source, number) }); index++; continue; }
    if (/^---\s*$/u.test(line)) { blocks.push({ type: "separator" }); index++; continue; }
    const list = /^(?:([-*])|(\d+)\.)\s+(.+)$/u.exec(line);
    if (list) {
      const ordered = list[2] !== undefined;
      const items: Inline[][] = [];
      while (index < lines.length) {
        const item = /^(?:([-*])|(\d+)\.)\s+(.+)$/u.exec(lines[index]!);
        if (!item || (item[2] !== undefined) !== ordered) break;
        items.push(parseInline(item[3]!, source, index + 1));
        index++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }
    if (/^>/u.test(line)) {
      const quotes: string[] = [];
      while (index < lines.length && /^>/u.test(lines[index]!)) quotes.push(lines[index++]!.replace(/^>\s?/u, ""));
      blocks.push({ type: "quote", content: parseInline(quotes.join(" "), source, number) });
      continue;
    }
    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index]!.trim() && !isStart(lines[index]!)) paragraph.push(lines[index++]!);
    blocks.push({ type: "paragraph", content: parseInline(paragraph.join(" "), source, number) });
  }
  if (!config) fail(1, "Adicione um bloco ```$Config com os metadados do conteúdo.");
  return { metadata: configMetadata(config!, source), blocks, source };
}

export function documentInlines(document: ContentDocument): Inline[] {
  return document.blocks.flatMap((block) => block.type === "list" ? block.items.flat() : "content" in block ? block.content : []);
}

export function documentReferences(document: ContentDocument): ContentKey[] {
  return [...new Set(documentInlines(document).flatMap((inline) => inline.type === "reference" ? [inline.target] : []))];
}
