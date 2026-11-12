export function mountProjectDeck(root: HTMLElement): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("[data-deck-card]"));
  const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-slot]"));
  const stage = root.querySelector<HTMLElement>(".project-deck-stage");
  const controls = root.querySelector<HTMLElement>("[data-deck-controls]");
  const previous = root.querySelector<HTMLButtonElement>("[data-deck-previous]");
  const next = root.querySelector<HTMLButtonElement>("[data-deck-next]");
  const counter = root.querySelector<HTMLElement>("[data-deck-counter]");
  const status = root.querySelector<HTMLElement>("[data-deck-status]");
  if (!cards.length || slots.length !== cards.length || !stage || !controls || !previous || !next) return () => {};

  const listeners = new AbortController();
  const { signal } = listeners;
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const mobile = matchMedia("(max-width: 767px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const firstProject = cards.findIndex((card) => card instanceof HTMLAnchorElement);
  let active = firstProject >= 0 ? firstProject : mobile.matches ? 0 : Math.floor(cards.length / 2);
  let pressed: { index: number; wasActive: boolean } | undefined;
  let scrollTimer: ReturnType<typeof setTimeout> | undefined;

  function centerActive(behavior: ScrollBehavior = "auto") {
    if (!mobile.matches) return;
    const slot = slots[active];
    stage!.scrollTo({ left: slot.offsetLeft - (stage!.clientWidth - slot.offsetWidth) / 2, behavior });
  }

  function select(index: number, announce = false, focus = false, scroll = true) {
    clearTimeout(scrollTimer);
    active = Math.max(0, Math.min(cards.length - 1, index));
    cards.forEach((card, position) => {
      const distance = Math.abs(position - active);
      const slot = slots[position];
      slot.dataset.active = String(position === active);
      slot.style.setProperty("--deck-depth", String(cards.length - distance));
      slot.style.setProperty("--deck-scale", String(position === active ? 1.035 : 0.96 - distance * 0.025));
      if (card instanceof HTMLButtonElement) card.setAttribute("aria-pressed", String(position === active));
    });
    previous!.disabled = active === 0;
    next!.disabled = active === cards.length - 1;
    if (counter) counter.textContent = `${active + 1} / ${cards.length}`;
    if (status && announce) status.textContent = (root.dataset.positionLabel ?? "{current} / {total}")
      .replace("{current}", String(active + 1)).replace("{total}", String(cards.length));
    if (focus) cards[active].focus({ preventScroll: true });
    if (scroll) centerActive(reducedMotion.matches ? "auto" : "smooth");
  }

  // A rolagem nativa cuida do gesto; sincronize a seleção quando o encaixe terminar.
  stage.addEventListener("scroll", () => {
    if (!mobile.matches) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = stage.scrollLeft + stage.clientWidth / 2;
      const closest = slots.reduce((nearest, slot, index) =>
        Math.abs(slot.offsetLeft + slot.offsetWidth / 2 - center)
          < Math.abs(slots[nearest].offsetLeft + slots[nearest].offsetWidth / 2 - center) ? index : nearest, 0);
      if (closest !== active) select(closest, true, false, false);
    }, 120);
  }, { passive: true, signal });

  const resizeObserver = new ResizeObserver(() => centerActive());
  resizeObserver.observe(stage);
  mobile.addEventListener("change", () => {
    clearTimeout(scrollTimer);
    if (mobile.matches) centerActive();
    else stage.scrollLeft = 0;
  }, { signal });

  cards.forEach((card, index) => {
    card.addEventListener("pointerenter", (event) => {
      if (hover.matches && event instanceof PointerEvent && event.pointerType !== "touch") select(index);
    }, { signal });
    card.addEventListener("pointerdown", () => {
      // O foco do toque chega antes do click: preserve a seleção anterior.
      pressed = { index, wasActive: index === active };
    }, { signal });
    card.addEventListener("pointercancel", () => { pressed = undefined; }, { signal });
    card.addEventListener("focus", () => select(index), { signal });
    card.addEventListener("click", (event) => {
      if (event instanceof MouseEvent && event.detail > 0 && pressed?.index === index && !pressed.wasActive) event.preventDefault();
      select(index, card instanceof HTMLButtonElement);
      pressed = undefined;
    }, { signal });
  });
  previous.addEventListener("click", () => select(active - 1, true), { signal });
  next.addEventListener("click", () => select(active + 1, true), { signal });
  root.addEventListener("keydown", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest("[data-deck-card], [data-deck-controls]")) return;
    const index = event.key === "ArrowLeft" ? active - 1 : event.key === "ArrowRight" ? active + 1
      : event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : undefined;
    if (index === undefined) return;
    event.preventDefault();
    select(index, true, true);
  }, { signal });

  select(active, false, false, false);
  centerActive();
  root.dataset.deckReady = "true";
  return () => {
    clearTimeout(scrollTimer);
    resizeObserver.disconnect();
    listeners.abort();
    delete root.dataset.deckReady;
  };
}
