import { roadmapArt } from "../config/roadmap-art";

const outlines = roadmapArt.map((strokes) =>
  strokes.map((points) => points.split(/[ ,]+/).map(Number)),
);
const coordinateCounts = outlines[0].map((_, index) =>
  Math.max(...outlines.map((strokes) => strokes[index].length)),
);
const drawings = outlines.map((strokes) =>
  strokes.map((stroke, index) => subdivideStroke(stroke, coordinateCounts[index])),
);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Split the longest segment first so every stroke can morph without changing its resting shape.
function subdivideStroke(points: number[], coordinateCount: number) {
  const stroke = [...points];
  while (stroke.length < coordinateCount) {
    let splitAt = 2;
    let longest = 0;
    for (let index = 2; index < stroke.length; index += 2) {
      const dx = stroke[index] - stroke[index - 2];
      const dy = stroke[index + 1] - stroke[index - 1];
      const lengthSquared = dx * dx + dy * dy;
      if (lengthSquared > longest) {
        longest = lengthSquared;
        splitAt = index;
      }
    }
    const x = stroke[splitAt - 2];
    const y = stroke[splitAt - 1];
    stroke.splice(splitAt, 0, (x + (stroke[splitAt] ?? x)) / 2, (y + (stroke[splitAt + 1] ?? y)) / 2);
  }
  return stroke;
}

class ServiceRoadmap extends HTMLElement {
  #index = 0;
  #frame = 0;
  #drawing = drawings[0];
  #strokes: SVGPolylineElement[] = [];

  connectedCallback() {
    if (this.hasAttribute("data-ready")) return;

    const nav = this.querySelector<HTMLElement>("[data-roadmap-nav]");
    const rail = this.querySelector<HTMLElement>("[data-roadmap-tabs]");
    const art = this.querySelector<HTMLElement>("[data-roadmap-art]");
    const previous = this.querySelector<HTMLButtonElement>("[data-roadmap-prev]");
    const next = this.querySelector<HTMLButtonElement>("[data-roadmap-next]");
    const status = this.querySelector<HTMLElement>("[data-roadmap-status]");
    if (!nav || !rail || !art || !previous || !next || !status) return;

    const tabs = Array.from(rail.querySelectorAll<HTMLButtonElement>("[role='tab']"));
    const panels = Array.from(this.querySelectorAll<HTMLElement>("[data-roadmap-panel]"));
    this.#strokes = Array.from(art.querySelectorAll("polyline"));
    if (tabs.length !== drawings.length || panels.length !== tabs.length || this.#strokes.length !== drawings[0].length) return;

    const select = (index: number) => {
      if (index === this.#index || index < 0 || index >= tabs.length) return;
      this.#index = index;
      status.textContent = "";
      tabs.forEach((tab, position) => {
        const active = position === index;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[position].hidden = !active;
      });
      // Reveal the active tab without moving the page vertically.
      const bounds = rail.getBoundingClientRect();
      const tabBounds = tabs[index].getBoundingClientRect();
      rail.scrollLeft += Math.min(0, tabBounds.left - bounds.left - 4)
        + Math.max(0, tabBounds.right - bounds.right + 4);
      this.#morph();
    };

    const adjacentIndex = (offset: number) => (this.#index + offset + tabs.length) % tabs.length;

    const move = (offset: number) => {
      const index = adjacentIndex(offset);
      select(index);
      status.textContent = panels[index].querySelector("h3")?.textContent ?? "";
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index));
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      panels[index].tabIndex = 0;
      panels[index].hidden = index !== 0;
    });
    rail.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      let index: number;
      switch (event.key) {
        case "ArrowLeft": index = adjacentIndex(-1); break;
        case "ArrowRight": index = adjacentIndex(1); break;
        case "Home": index = 0; break;
        case "End": index = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      select(index);
      tabs[index].focus({ preventScroll: true });
    });
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));

    this.setAttribute("data-ready", "");
    nav.hidden = false;
    art.hidden = false;
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.#frame);
    this.#draw(drawings[this.#index]);
  }

  #draw(drawing: number[][]) {
    this.#drawing = drawing;
    this.#strokes.forEach((stroke, index) => stroke.setAttribute("points", drawing[index].join(" ")));
  }

  #morph() {
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
    const target = drawings[this.#index];
    if (reducedMotion.matches) {
      this.#draw(target);
      return;
    }

    // Start from the current geometry so fast navigation never snaps to an old step.
    const origin = this.#drawing;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.max(0, (now - start) / 520);
      if (progress >= 1 || reducedMotion.matches) {
        this.#frame = 0;
        this.#draw(target);
        return;
      }
      const eased = progress * progress * (3 - 2 * progress);
      this.#draw(origin.map((stroke, index) =>
        stroke.map((point, coordinate) => point + (target[index][coordinate] - point) * eased),
      ));
      this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }
}

if (!customElements.get("service-roadmap")) {
  customElements.define("service-roadmap", ServiceRoadmap);
}
