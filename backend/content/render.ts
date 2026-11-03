import { contentKey, ContentValidationError, type ContentDocument, type Inline } from "./types.ts";
import { escapeHtml, safeHref } from "./html.ts";
import type { WidgetContext, WidgetRegistry } from "./widgets.ts";
import { siteWidgets } from "./site-widgets.ts";

export function renderLu(document: ContentDocument, context: Omit<WidgetContext, "current" | "renderDocument">, registry: WidgetRegistry = siteWidgets, depth = 0): string {
  if (depth > 8) throw new Error("Limite de widgets aninhados excedido.");
  const current = contentKey(document.metadata);
  const widgetContext = { ...context, current, locale: document.metadata.locale ?? context.locale, renderDocument: (child: ContentDocument) => renderLu(child, context, registry, depth + 1) };
  const inline = (items: Inline[]): string => items.map((item) => {
    switch (item.type) {
      case "text": return escapeHtml(item.value);
      case "code": return `<code>${escapeHtml(item.value)}</code>`;
      case "strong": return `<strong>${escapeHtml(item.value)}</strong>`;
      case "emphasis": return `<em>${escapeHtml(item.value)}</em>`;
      case "image": return `<img src="${safeHref(context.resolveUrl?.(item.url) ?? item.url)}" alt="${escapeHtml(item.label)}" loading="lazy" decoding="async">`;
      case "link": return `<a href="${safeHref(context.resolveUrl?.(item.url) ?? item.url)}">${escapeHtml(item.label)}</a>`;
      case "reference": {
        const entry = context.database.get(item.target, widgetContext.locale);
        if (!entry) throw new ContentValidationError([{ source: document.source, field: "reference", message: `Destino inexistente: ${item.target}.` }]);
        const href = context.resolveHref?.(entry);
        const label = escapeHtml(item.label ?? entry.metadata.title);
        return href ? `<a href="${safeHref(href)}" data-content-ref="${escapeHtml(entry.key)}">${label}</a>` : `<span data-content-ref="${escapeHtml(entry.key)}">${label}</span>`;
      }
    }
  }).join("");
  return document.blocks.map((block): string => {
    switch (block.type) {
      case "heading": return `<h${block.level}>${inline(block.content)}</h${block.level}>`;
      case "paragraph": return `<p>${inline(block.content)}</p>`;
      case "quote": return `<blockquote><p>${inline(block.content)}</p></blockquote>`;
      case "list": {
        const tag = block.ordered ? "ol" : "ul";
        return `<${tag}>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`;
      }
      case "code": {
        const code = `<pre><code${block.language ? ` class="language-${escapeHtml(block.language)}"` : ""}>${escapeHtml(block.value)}</code></pre>`;
        return block.filename ? `<figure data-widget="code"><figcaption>${escapeHtml(block.filename)}</figcaption>${code}</figure>` : code;
      }
      case "separator": return "<hr>";
      case "widget": {
        const definition = registry.get(block.name);
        const messages = definition?.validate(block.props) ?? [`Widget desconhecido: ${block.name}.`];
        if (messages.length) throw new ContentValidationError(messages.map((message) => ({ source: document.source, line: block.line, field: "widget", message })));
        return definition!.render(block.props, widgetContext);
      }
    }
  }).join("\n");
}
