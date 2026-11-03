export function initializeSiteHeader(): void {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const toggle = header?.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  if (!header || !toggle) return;

  const desktop = window.matchMedia("(min-width: 960px)");
  const dropdowns = [...header.querySelectorAll<HTMLDetailsElement>("details")];

  function setDropdownOpen(dropdown: HTMLDetailsElement, open: boolean): void {
    dropdown.open = open;
    dropdown.querySelector("summary")?.setAttribute("aria-expanded", String(open));
  }

  function closeDropdowns(): void {
    for (const dropdown of dropdowns) setDropdownOpen(dropdown, false);
  }

  function setMenu(open: boolean): void {
    if (!header || !toggle) return;
    header.toggleAttribute("data-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", (open ? toggle.dataset.closeLabel : toggle.dataset.openLabel) ?? "");
    if (!open) closeDropdowns();
  }

  toggle.hidden = false;
  header.setAttribute("data-enhanced", "");
  toggle.addEventListener("click", () => setMenu(!header.hasAttribute("data-menu-open")));

  for (const dropdown of dropdowns) {
    setDropdownOpen(dropdown, dropdown.open);
    dropdown.addEventListener("toggle", () => {
      setDropdownOpen(dropdown, dropdown.open);
      if (dropdown.open) {
        for (const other of dropdowns) {
          if (other !== dropdown) setDropdownOpen(other, false);
        }
      }
    });
  }

  header.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (document.querySelector("#site-search[open]")) return;
    if (!(event.target instanceof Node)) return;
    for (const dropdown of dropdowns) {
      if (!dropdown.contains(event.target)) setDropdownOpen(dropdown, false);
    }
    if (!header.contains(event.target)) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.querySelector("#site-search[open]")) return;
    const openDropdown = dropdowns.find((dropdown) => dropdown.open);
    if (openDropdown) {
      setDropdownOpen(openDropdown, false);
      openDropdown.querySelector("summary")?.focus();
    } else if (header.hasAttribute("data-menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  desktop.addEventListener("change", () => {
    const focusWasInPanel = header.querySelector(".site-menu-panel")?.contains(document.activeElement);
    setMenu(false);
    // O foco não deve permanecer em links que acabaram de ficar ocultos.
    if (!desktop.matches && focusWasInPanel) toggle.focus();
  });
}
