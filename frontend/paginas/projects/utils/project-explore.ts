/** The server queries the shared content database for each category, including
 * multi-category projects. This controller only selects the resulting section;
 * it does not introduce a second set of content matching rules. */
export class ProjectExplore extends HTMLElement {
  connectedCallback() {
    window.addEventListener("hashchange", this.update);
    this.update();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.update);
  }

  private update = () => {
    const sections = [...this.querySelectorAll<HTMLElement>("[data-project-section]")];
    const selected = sections.find((section) => `#${section.id}` === window.location.hash);
    for (const section of sections) section.hidden = !!selected && section !== selected;
    this.querySelectorAll<HTMLAnchorElement>("[data-project-filter], [data-project-show-all]").forEach((link) => {
      const active = selected ? link.dataset.projectFilter === selected.dataset.projectSection : link.hasAttribute("data-project-show-all");
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    // A previously hidden section must be visible before following its anchor.
    selected?.scrollIntoView({ block: "start" });
  };
}
