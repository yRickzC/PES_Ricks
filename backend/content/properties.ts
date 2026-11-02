import { ContentValidationError, type JsonObject, type JsonValue } from "./types.ts";

/** Nomes de widgets são independentes de caixa, acentos, espaços e underscores. */
export function normalizeWidgetName(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase().replace(/[\s_]+/gu, "-");
}

/** Propriedades LU: chave: valor, caminhos com ponto, listas e texto multilinha. Sem avaliação. */
export function parseProperties(lines: readonly string[], source: string, firstLine: number): JsonObject {
  const result: JsonObject = Object.create(null);
  const assigned = new Set<string>();
  const fail = (offset: number, message: string): never => {
    throw new ContentValidationError([{ source, line: firstLine + offset, field: "properties", message }]);
  };
  const scalar = (text: string, offset: number): JsonValue => {
    const value = text.trim();
    if (value.startsWith('"')) {
      try { const decoded: unknown = JSON.parse(value); if (typeof decoded === "string") return decoded; } catch { /* diagnostic below */ }
      return fail(offset, "Texto entre aspas duplas inválido.");
    }
    if (value.startsWith("'")) {
      if (!value.endsWith("'") || value.length < 2) return fail(offset, "Feche as aspas simples.");
      return value.slice(1, -1).replace(/''/gu, "'");
    }
    if (value.startsWith("[")) {
      if (!value.endsWith("]")) return fail(offset, "Feche a lista com ].");
      const body = value.slice(1, -1);
      if (!body.trim()) return [];
      const parts: string[] = [];
      let quote = "";
      let start = 0;
      for (let index = 0; index < body.length; index++) {
        const character = body[index]!;
        if (quote) {
          if (quote === '"' && character === "\\") { index++; continue; }
          if (quote === "'" && character === "'" && body[index + 1] === "'") { index++; continue; }
          if (character === quote) quote = "";
        } else if (character === '"' || character === "'") quote = character;
        else if (character === "[" || character === "]") return fail(offset, "Listas aninhadas usam caminhos com ponto, como items.0.title.");
        else if (character === ",") { parts.push(body.slice(start, index)); start = index + 1; }
      }
      parts.push(body.slice(start));
      if (quote || parts.some((part) => !part.trim())) return fail(offset, "Lista inválida: confira aspas e valores entre vírgulas.");
      return parts.map((part) => scalar(part, offset));
    }
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/u.test(value)) {
      const number = Number(value);
      if (!Number.isFinite(number)) return fail(offset, "Número fora do intervalo suportado.");
      return number;
    }
    return value;
  };
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]!;
    if (!line.trim() || /^\s*#/u.test(line)) continue;
    const match = /^([^\s:]+)\s*:\s*(.*)$/u.exec(line);
    if (!match) fail(index, "Use chave: valor. Texto multilinha usa chave: | e linhas recuadas.");
    const path = match![1]!.split(".");
    if (path.some((key) => !/^[\p{L}\p{N}_-]+$/u.test(key) || ["__proto__", "prototype", "constructor"].includes(key))) fail(index, "Caminho de propriedade inválido.");
    const keyPath = path.join(".");
    if ([...assigned].some((key) => key === keyPath || key.startsWith(`${keyPath}.`) || keyPath.startsWith(`${key}.`))) fail(index, `Propriedade repetida ou conflitante: ${keyPath}.`);
    assigned.add(keyPath);
    let value: JsonValue;
    if (match![2]!.trim() === "|") {
      const text: string[] = [];
      while (index + 1 < lines.length && /^(?:\s+|$)/u.test(lines[index + 1]!)) text.push(lines[++index]!);
      const indent = Math.min(...text.filter((item) => item.trim()).map((item) => /^\s*/u.exec(item)![0].length));
      value = text.map((item) => item.slice(Number.isFinite(indent) ? indent : 0)).join("\n").trimEnd();
    } else value = scalar(match![2]!, index);
    let parent: JsonObject | JsonValue[] = result;
    for (let part = 0; part < path.length; part++) {
      const key = path[part]!;
      if (Array.isArray(parent)) {
        if (!/^(?:0|[1-9]\d*)$/u.test(key) || Number(key) > parent.length) fail(index, "Índices de lista devem ser sequenciais, começando em 0.");
        if (part === path.length - 1) parent[Number(key)] = value;
        else {
          parent[Number(key)] ??= /^\d+$/u.test(path[part + 1]!) ? [] : Object.create(null) as JsonObject;
          parent = parent[Number(key)] as JsonObject | JsonValue[];
        }
      } else if (part === path.length - 1) parent[key] = value;
      else {
        parent[key] ??= /^\d+$/u.test(path[part + 1]!) ? [] : Object.create(null) as JsonObject;
        parent = parent[key] as JsonObject | JsonValue[];
      }
    }
  }
  return result;
}
