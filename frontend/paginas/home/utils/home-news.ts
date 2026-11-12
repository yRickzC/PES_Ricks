import { HOME_NEWS_SLIDE_INTERVAL, HOME_NOTE_INTERVAL } from "../config/home-posts";

export function mountHomeNews(root: HTMLElement): () => void {
  const notes = [...root.querySelectorAll<HTMLElement>("[data-news-note]")];
  const images = [...root.querySelectorAll<HTMLElement>("[data-news-image]")];
  const board = root.querySelector<HTMLElement>("[data-news-board]");
  const pagination = root.querySelector<HTMLElement>("[data-news-pagination]");
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-news-page]")];
  const status = root.querySelector<HTMLElement>("[data-news-status]");
  const count = new Set(notes.map((note) => note.dataset.notePage)).size;
  if (!board || !pagination || !images.length || buttons.length !== images.length) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 767px)");
  let page = 0;
  let slide = 0;
  let hovered = false;
  let visible = !("IntersectionObserver" in window);
  let imageTimer: ReturnType<typeof setTimeout> | undefined;
  let noteTimer: ReturnType<typeof setTimeout> | undefined;
  let gesture: { id: number; x: number; y: number; dragged: boolean } | undefined;
  let suppressClick = false;

  function renderImages() {
    images.forEach((card, index) => {
      card.dataset.imageActive = String(index === slide);
      card.inert = mobile.matches && index !== slide;
    });
    buttons.forEach((button, index) => {
      button.setAttribute("aria-current", String(index === slide));
    });
    pagination!.hidden = !mobile.matches;
  }
  function canRun() {
    // Foco de toque nas barrinhas não deve travar o ciclo; foco visível pausa a leitura.
    return !reduced.matches && visible && !document.hidden && !hovered && !gesture && !root.querySelector(":focus-visible");
  }
  function scheduleImages() {
    clearTimeout(imageTimer);
    if (mobile.matches && images.length > 1 && canRun()) {
      imageTimer = setTimeout(() => selectSlide(slide + 1), HOME_NEWS_SLIDE_INTERVAL);
    }
  }
  function scheduleNotes() {
    clearTimeout(noteTimer);
    if (count > 1 && canRun()) {
      noteTimer = setTimeout(() => {
        page = (page + 1) % count;
        notes.forEach((note) => { note.hidden = Number(note.dataset.notePage) !== page; });
        scheduleNotes();
      }, HOME_NOTE_INTERVAL);
    }
  }
  function schedule() {
    scheduleImages();
    scheduleNotes();
  }
  function selectSlide(index: number, announce = false) {
    slide = ((index % images.length) + images.length) % images.length;
    renderImages();
    if (status && announce) status.textContent = (root.dataset.positionLabel ?? "{current} / {total}")
      .replace("{current}", String(slide + 1)).replace("{total}", String(images.length));
    scheduleImages();
  }

  buttons.forEach((button, index) => button.addEventListener("click", () => selectSlide(index, true), { signal }));
  pagination.addEventListener("keydown", (event) => {
    const index = event.key === "ArrowLeft" ? slide - 1 : event.key === "ArrowRight" ? slide + 1
      : event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : undefined;
    if (index === undefined) return;
    event.preventDefault();
    selectSlide(index, true);
    buttons[slide].focus({ preventScroll: true });
  }, { signal });

  board.addEventListener("pointerdown", (event) => {
    if (!mobile.matches || event.button !== 0 || gesture) return;
    if (!(event.target instanceof Element) || !event.target.closest("[data-news-image]")) return;
    suppressClick = false;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, dragged: false };
    schedule();
  }, { signal });
  window.addEventListener("pointermove", (event) => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.25) gesture.dragged = true;
    if (gesture.dragged && event.cancelable) event.preventDefault();
  }, { passive: false, signal });
  function finishGesture(event: PointerEvent, cancelled = false) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const swiped = !cancelled && Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.25;
    suppressClick = gesture.dragged || swiped;
    gesture = undefined;
    if (swiped) {
      selectSlide(slide + (dx < 0 ? 1 : -1), true);
      scheduleNotes();
    } else schedule();
  }
  window.addEventListener("pointerup", (event) => finishGesture(event), { signal });
  window.addEventListener("pointercancel", (event) => finishGesture(event, true), { signal });
  board.addEventListener("click", (event) => {
    if (!suppressClick || event.detail === 0) return;
    if (!(event.target instanceof Element) || !event.target.closest("[data-news-image]")) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, { capture: true, signal });
  board.addEventListener("dragstart", (event) => {
    if (mobile.matches && event.target instanceof Element && event.target.closest("[data-news-image]")) event.preventDefault();
  }, { signal });

  root.addEventListener("pointerenter", (event) => { if (!mobile.matches && event.pointerType === "mouse") { hovered = true; schedule(); } }, { signal });
  root.addEventListener("pointerleave", () => { hovered = false; schedule(); }, { signal });
  root.addEventListener("focusin", schedule, { signal });
  root.addEventListener("focusout", () => queueMicrotask(() => { if (!signal.aborted) schedule(); }), { signal });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) gesture = undefined;
    schedule();
  }, { signal });
  window.addEventListener("blur", () => { gesture = undefined; hovered = false; schedule(); }, { signal });
  reduced.addEventListener("change", schedule, { signal });
  mobile.addEventListener("change", () => {
    const focusedImage = images.findIndex((card) => card.contains(document.activeElement));
    if (focusedImage >= 0) slide = focusedImage;
    hovered = false;
    gesture = undefined;
    suppressClick = false;
    renderImages();
    schedule();
  }, { signal });
  const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
    if (visible !== entry.isIntersecting) {
      visible = entry.isIntersecting;
      schedule();
    }
  }) : undefined;
  observer?.observe(board);
  renderImages();
  schedule();
  return () => {
    abort.abort();
    clearTimeout(imageTimer);
    clearTimeout(noteTimer);
    observer?.disconnect();
    images.forEach((card) => { card.inert = false; });
    pagination.hidden = true;
  };
}
