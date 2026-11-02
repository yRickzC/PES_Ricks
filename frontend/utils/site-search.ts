import { matchesSearch } from "../../backend/search/search";

export function initializeSiteSearch(): void {
  const dialog = document.querySelector<HTMLDialogElement>("[data-site-search]");
  const input = dialog?.querySelector<HTMLInputElement>("input");
  const status = dialog?.querySelector<HTMLElement>("[role='status']");
  const empty = dialog?.querySelector<HTMLElement>("[data-search-empty]");
  if (!dialog || !input || !status || !empty) return;

  const entries = [...dialog.querySelectorAll<HTMLElement>("[data-search-entry]")];
  let previousFocus: HTMLElement | null = null;

  function filter(): void {
    if (!dialog || !input || !status || !empty) return;
    let count = 0;
    for (const entry of entries) {
      const matches = matchesSearch(entry.dataset.searchText ?? "", input.value);
      entry.hidden = !matches;
      if (matches) count++;
    }
    empty.hidden = count > 0;
    status.textContent = input.value.trim()
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

  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("search-is-open");
    input.value = "";
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
}
