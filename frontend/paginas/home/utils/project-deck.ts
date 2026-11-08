export function mountProjectDeck(root: HTMLElement): () => void {
  const cards = Array.from(root.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("[data-deck-card]"));
  const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-deck-slot]"));
  const controls = root.querySelector<HTMLElement>("[data-deck-controls]");
  const previous = root.querySelector<HTMLButtonElement>("[data-deck-previous]");
  const next = root.querySelector<HTMLButtonElement>("[data-deck-next]");
  const counter = root.querySelector<HTMLElement>("[data-deck-counter]");
  const status = root.querySelector<HTMLElement>("[data-deck-status]");
  if (!cards.length || slots.length !== cards.length || !controls || !previous || !next) return () => {};

  const listeners = new AbortController();
  const { signal } = listeners;
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const firstProject = cards.findIndex((card) => card instanceof HTMLAnchorElement);
  let active = firstProject >= 0 ? firstProject : matchMedia("(min-width: 768px)").matches ? Math.floor(cards.length / 2) : 0;
  let pressed: { index: number; wasActive: boolean } | undefined;

  function select(index: number, announce = false, focus = false) {
    active = Math.max(0, Math.min(cards.length - 1, index));
    cards.forEach((card, position) => {
      const distance = Math.abs(position - active);
      const slot = slots[position];
      slot.dataset.active = String(position === active);
      slot.style.setProperty("--deck-offset", String(position - active));
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
  }

  cards.forEach((card, index) => {
    card.addEventListener("pointerenter", (event) => {
      if (hover.matches && event instanceof PointerEvent && event.pointerType !== "touch") select(index);
    }, { signal });
    card.addEventListener("pointerdown", () => {
      // O foco do toque chega antes do click: preserve a seleção anterior.
      pressed = { index, wasActive: index === active };
    }, { signal });
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

  select(active);
  root.dataset.deckReady = "true";
  return () => {
    listeners.abort();
    delete root.dataset.deckReady;
  };
}
