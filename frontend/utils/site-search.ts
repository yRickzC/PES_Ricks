import { matchesSearchFilters, searchCategories, type SearchCategory, type SearchType, type SearchTypeFilter } from "../../backend/search/search";

export function initializeSiteSearch(): void {
  const dialog = document.querySelector<HTMLDialogElement>("[data-site-search]");
  const input = dialog?.querySelector<HTMLInputElement>("input");
  const status = dialog?.querySelector<HTMLElement>("[role='status']");
  const empty = dialog?.querySelector<HTMLElement>("[data-search-empty]");
  const form = dialog?.querySelector<HTMLFormElement>("[data-search-form]");
  const type = dialog?.querySelector<HTMLSelectElement>("select[data-search-type]");
  const category = dialog?.querySelector<HTMLSelectElement>("[data-search-category]");
  if (!dialog || !input || !status || !empty || !form || !type || !category) return;

  const entries = [...dialog.querySelectorAll<HTMLElement>("[data-search-entry]")].flatMap((element) => {
    const link = element.querySelector<HTMLAnchorElement>("a");
    if (!link) return [];
    return [{
      element, link,
      type: element.dataset.searchType as SearchType,
      categories: JSON.parse(element.dataset.searchCategories ?? "[]") as SearchCategory[],
      searchText: element.dataset.searchText ?? "",
    }];
  });
  const allCategoriesLabel = category.options[0]?.text ?? "";
  const categoryCatalog: SearchCategory[] = [...category.options].flatMap((option) => {
    const type = option.dataset.categoryType as SearchCategory["type"] | undefined;
    return type ? [{ value: option.value, label: option.text, type }] : [];
  });
  let previousFocus: HTMLElement | null = null;

  function updateCategories(): void {
    if (!dialog || !type || !category) return;
    const selected = category.value;
    const available = searchCategories(categoryCatalog, type.value as SearchTypeFilter, dialog.dataset.locale);
    category.replaceChildren(new Option(allCategoriesLabel, "all"), ...available.map(({ label, value }) => new Option(label, value)));
    category.value = available.some(({ value }) => value === selected) ? selected : "all";
    category.disabled = !available.length;
  }

  function filter(): void {
    if (!dialog || !input || !status || !empty || !type || !category) return;
    const filters = { query: input.value, type: type.value as SearchTypeFilter, category: category.value };
    let count = 0;
    for (const entry of entries) {
      const matches = matchesSearchFilters(entry, filters);
      entry.element.hidden = !matches;
      if (matches) count++;
    }
    empty.hidden = count > 0;
    status.textContent = input.value.trim() || type.value !== "all" || category.value !== "all"
      ? (dialog.dataset.resultTemplate ?? "{count}").replace("{count}", String(count))
      : (dialog.dataset.searchHint ?? "");
  }

  function open(): void {
    if (!dialog || !input || dialog.open) return;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    document.documentElement.classList.add("search-is-open");
    input.focus();
  }

  for (const trigger of document.querySelectorAll<HTMLButtonElement>("[data-open-search]")) {
    trigger.addEventListener("click", open);
  }
  dialog.querySelector("[data-close-search]")?.addEventListener("click", () => dialog.close());
  input.addEventListener("input", filter);
  type.addEventListener("change", () => { updateCategories(); filter(); });
  category.addEventListener("change", filter);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filter();
    entries.find(({ element }) => !element.hidden)?.link.focus();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const active = document.activeElement;
    if (active !== input && !entries.some(({ link }) => link === active)) return;
    const visible = entries.filter(({ element }) => !element.hidden);
    if (!visible.length) return;
    event.preventDefault();
    const index = visible.findIndex(({ link }) => link === active);
    const next = index < 0
      ? (event.key === "ArrowDown" ? 0 : visible.length - 1)
      : (index + (event.key === "ArrowDown" ? 1 : -1) + visible.length) % visible.length;
    visible[next]?.link.focus();
  });

  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("search-is-open");
    input.value = "";
    type.value = "all";
    category.value = "all";
    updateCategories();
    filter();
    const returnTarget = previousFocus?.getClientRects().length
      ? previousFocus
      : document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    returnTarget?.focus({ preventScroll: true });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
    }
  });
  filter();
}
