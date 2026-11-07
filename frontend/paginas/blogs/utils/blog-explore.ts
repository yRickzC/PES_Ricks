import { blogPageNumbers, blogStateUrl, readBlogState, reduceBlogState, selectBlogPage, type BlogAction, type BlogPost } from "../data/explore";
import { blogCount } from "../data/blog-count";
import type { BlogCopy } from "../data/explore-copy";
import { mountScrollReveal } from "../../../utils/scroll-reveal";

interface BlogPayload { posts: BlogPost[]; copy: BlogCopy }
const SEARCH_DELAY = 160;

/** The only interactive island is this Blog section; no global search events or state. */
function mountBlogExplore(root: HTMLElement): () => void {
  const get = <T extends Element>(selector: string) => root.querySelector<T>(selector)!;
  const { posts, copy } = JSON.parse(get<HTMLScriptElement>("[data-blog-catalog]").textContent!) as BlogPayload;
  const input = get<HTMLInputElement>("[data-blog-query]");
  const category = get<HTMLSelectElement>("[data-blog-category]");
  const tagOptions = get<HTMLFieldSetElement>("[data-blog-tag-options]");
  const tagList = get<HTMLDivElement>("[data-blog-tag-list]");
  const results = get<HTMLDivElement>("[data-blog-results]");
  const list = get<HTMLOListElement>("[data-blog-posts]");
  const empty = get<HTMLDivElement>("[data-blog-empty]");
  const pagination = get<HTMLElement>("[data-blog-pagination]");
  const template = get<HTMLTemplateElement>("[data-blog-result-template]");
  const controller = new AbortController();
  const { signal } = controller;
  let state = readBlogState(new URL(location.href).searchParams);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function postElement(post: BlogPost, horizontal: boolean): HTMLElement {
    const item = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const find = <T extends Element>(selector: string) => item.querySelector<T>(selector)!;
    item.dataset.featured = String(post.featured);
    const image = find<HTMLImageElement>("[data-blog-cover]");
    // Set sizing before src so the browser can choose a responsive candidate immediately.
    image.sizes = horizontal ? "(max-width: 700px) calc(100vw - 32px), 350px"
      : "(max-width: 700px) calc(100vw - 32px), (max-width: 1000px) 48vw, 720px";
    if (post.cover.width) image.width = post.cover.width;
    if (post.cover.height) image.height = post.cover.height;
    if (post.cover.srcset) image.srcset = post.cover.srcset;
    image.alt = post.cover.alt;
    image.src = post.cover.src;
    find<HTMLAnchorElement>("[data-blog-image-link]").href = post.href;
    const link = find<HTMLAnchorElement>("[data-blog-post-link]");
    link.href = post.href;
    link.textContent = post.title;
    find<HTMLElement>("[data-blog-summary]").textContent = post.summary;
    const categories = find<HTMLElement>("[data-blog-post-category]");
    categories.textContent = post.categories.map(({ label }) => label).join(" / ");
    categories.hidden = !post.categories.length;
    const date = find<HTMLTimeElement>("[data-blog-date]");
    date.hidden = !post.createdAt;
    if (post.createdAt) date.dateTime = post.createdAt;
    date.textContent = post.dateLabel ?? "";
    find<HTMLElement>("[data-blog-featured]").hidden = !post.featured;
    const tags = find<HTMLUListElement>("[data-blog-post-tags]");
    tags.replaceChildren(...post.tags.map((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      return li;
    }));
    return item;
  }

  function render() {
    const selection = selectBlogPage(posts, state);
    state = { ...state, page: selection.page };
    input.value = state.query;
    // Keep shared URLs with a removed category/tag visible and clearable, rather than silently dropping filters.
    category.querySelectorAll("[data-unavailable]").forEach((option) => option.remove());
    if (state.category && ![...category.options].some((option) => option.value === state.category)) {
      const option = new Option(state.category, state.category);
      option.dataset.unavailable = "";
      category.add(option);
    }
    category.value = state.category;
    tagList.querySelectorAll("[data-unavailable]").forEach((label) => label.remove());
    for (const tag of state.tags) {
      if ([...tagList.querySelectorAll<HTMLInputElement>("input")].some((checkbox) => checkbox.value === tag)) continue;
      const label = document.createElement("label");
      label.className = "blog-explore-tag-filter";
      label.dataset.unavailable = "";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "tag";
      checkbox.value = tag;
      checkbox.setAttribute("aria-controls", "blog-explore-results");
      const text = document.createElement("span");
      text.textContent = tag;
      label.append(checkbox, text);
      tagList.append(label);
    }
    tagList.querySelectorAll<HTMLInputElement>("input").forEach((checkbox) => { checkbox.checked = state.tags.includes(checkbox.value); });
    tagOptions.hidden = !tagList.childElementCount;
    get<HTMLElement>(".blog-explore-filters [data-blog-clear]").hidden = !selection.active;
    results.dataset.mode = selection.active ? "search" : "discovery";
    list.hidden = selection.total === 0;
    empty.hidden = selection.total !== 0;
    list.replaceChildren(...selection.visible.map((post) => postElement(post, selection.active)));
    get<HTMLElement>("[data-blog-count]").textContent = blogCount(copy, selection.total, selection.active, state.query);
    get<HTMLElement>("[data-blog-page-status]").textContent = selection.pageCount
      ? ". " + copy.page.replace("{page}", String(selection.page)).replace("{count}", String(selection.pageCount)) : "";
    pagination.hidden = selection.pageCount < 2;
    get<HTMLButtonElement>("[data-blog-previous]").disabled = selection.page <= 1;
    get<HTMLButtonElement>("[data-blog-next]").disabled = selection.page >= selection.pageCount;
    get<HTMLDivElement>("[data-blog-page-numbers]").replaceChildren(...blogPageNumbers(selection.page, selection.pageCount).map((page) => {
      if (page === "…") {
        const gap = document.createElement("span");
        gap.textContent = page;
        gap.setAttribute("aria-hidden", "true");
        return gap;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.blogPage = String(page);
      button.textContent = String(page);
      button.setAttribute("aria-label", copy.page.replace("{page}", String(page)).replace("{count}", String(selection.pageCount)));
      if (page === selection.page) button.setAttribute("aria-current", "page");
      return button;
    }));
  }

  function syncUrl(mode: "push" | "replace") {
    const url = blogStateUrl(new URL(location.href), state);
    if (url.href !== location.href) {
      // Preserve Astro/router history metadata and unrelated query parameters/hash.
      if (mode === "push") history.pushState(history.state, "", url);
      else history.replaceState(history.state, "", url);
    }
  }

  function change(action: BlogAction, mode: "push" | "replace" = "push") {
    clearTimeout(timer);
    state = reduceBlogState(state, action);
    render();
    syncUrl(mode);
    if (action.type === "page") {
      results.focus({ preventScroll: true });
      results.scrollIntoView({ block: "start" });
    }
    if (action.type === "reset") input.focus({ preventScroll: true });
  }

  input.addEventListener("input", () => {
    state = reduceBlogState(state, { type: "query", value: input.value });
    clearTimeout(timer);
    timer = setTimeout(() => { render(); syncUrl("replace"); }, SEARCH_DELAY);
  }, { signal });
  get<HTMLFormElement>("[data-blog-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    change({ type: "query", value: input.value }, "replace");
  }, { signal });
  category.addEventListener("change", () => change({ type: "category", value: category.value }), { signal });
  tagOptions.addEventListener("change", () => {
    change({ type: "tags", value: [...tagList.querySelectorAll<HTMLInputElement>("input:checked")].map(({ value }) => value) });
  }, { signal });
  root.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>("button");
    if (!button || button.disabled) return;
    if (button.hasAttribute("data-blog-clear")) change({ type: "reset" });
    if (button.dataset.blogPage) change({ type: "page", value: Number(button.dataset.blogPage) });
    if (button.hasAttribute("data-blog-previous")) change({ type: "page", value: state.page - 1 });
    if (button.hasAttribute("data-blog-next")) change({ type: "page", value: state.page + 1 });
  }, { signal });
  window.addEventListener("popstate", () => {
    clearTimeout(timer);
    state = readBlogState(new URL(location.href).searchParams);
    render();
    syncUrl("replace");
  }, { signal });
  render();
  const revealTargets = root.querySelectorAll<HTMLElement>([
    ".blog-explore-search > :is(input, button)",
    ".blog-explore-filters > *",
    ".blog-explore-status",
    ".blog-explore-posts > *",
    ".blog-explore-empty > *",
    ".blog-explore-pagination > *",
  ].join(", "));
  mountScrollReveal(root, revealTargets);
  syncUrl("replace");
  return () => { clearTimeout(timer); controller.abort(); };
}

export class BlogExplore extends HTMLElement {
  private dispose?: () => void;
  connectedCallback() { this.dispose ??= mountBlogExplore(this); }
  disconnectedCallback() { this.dispose?.(); this.dispose = undefined; }
}
