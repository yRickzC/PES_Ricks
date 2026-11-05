/** The server queries the shared content database for each category, including
 * multi-category projects. This controller only selects the resulting section;
 * it does not introduce a second set of content matching rules. */
export class ProjectExplore extends HTMLElement {
  connectedCallback() {
    window.addEventListener("hashchange", this.update);
    this.addEventListener("click", this.toggleSelectedCategory);
    this.update();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.update);
    this.removeEventListener("click", this.toggleSelectedCategory);
  }

  private toggleSelectedCategory = (event: MouseEvent) => {
    if (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest<HTMLAnchorElement>("[data-project-filter]");
    if (!link || link.hash !== window.location.hash) return;

    event.preventDefault();
    window.location.hash = "#projects-all";
  };

  private update = () => {
    const sections = [...this.querySelectorAll<HTMLElement>("[data-project-section]")];
    const selected = sections.find((section) => `#${section.id}` === window.location.hash);
    this.querySelectorAll<HTMLAnchorElement>("[data-project-filter]").forEach((link) => {
      const active = link.dataset.projectFilter === selected?.dataset.projectSection;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    selected?.dispatchEvent(new CustomEvent("project-category-change", {
      detail: selected?.dataset.projectSection,
    }));
    // Align the category after :target reveals it.
    selected?.scrollIntoView({ block: "start" });
  };
}
