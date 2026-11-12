import { HOME_NOTE_INTERVAL } from "../config/home-posts";

export function mountHomeNews(root: HTMLElement): () => void {
  const notes = [...root.querySelectorAll<HTMLElement>("[data-news-note]")];
  const images = [...root.querySelectorAll<HTMLElement>("[data-news-image]")];
  const count = new Set(notes.map((note) => note.dataset.notePage)).size;
  if (count < 2 && images.length < 2) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 767px)");
  let page = 0;
  let image = 0;
  let hovered = false;
  let visible = !("IntersectionObserver" in window);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function renderImages() {
    images.forEach((card, index) => {
      card.dataset.imageActive = String(index === image);
      card.inert = mobile.matches && index !== image;
    });
  }
  function schedule() {
    clearTimeout(timer);
    const canAdvance = count > 1 || (mobile.matches && images.length > 1);
    if (canAdvance && !reduced.matches && visible && !document.hidden && !hovered && !root.matches(":focus-within")) {
      timer = setTimeout(advance, HOME_NOTE_INTERVAL);
    }
  }
  function advance() {
    if (count > 1) {
      page = (page + 1) % count;
      notes.forEach((note) => { note.hidden = Number(note.dataset.notePage) !== page; });
    }
    if (mobile.matches && images.length > 1) {
      image = (image + 1) % images.length;
      renderImages();
    }
    schedule();
  }
  root.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { hovered = true; schedule(); } }, { signal });
  root.addEventListener("pointerleave", () => { hovered = false; schedule(); }, { signal });
  root.addEventListener("focusin", schedule, { signal });
  root.addEventListener("focusout", () => queueMicrotask(() => { if (!signal.aborted) schedule(); }), { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  reduced.addEventListener("change", schedule, { signal });
  mobile.addEventListener("change", () => {
    const focusedImage = images.findIndex((card) => card.contains(document.activeElement));
    if (focusedImage >= 0) image = focusedImage;
    renderImages();
    schedule();
  }, { signal });
  const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }) : undefined;
  observer?.observe(root);
  renderImages();
  schedule();
  return () => {
    abort.abort();
    clearTimeout(timer);
    observer?.disconnect();
    images.forEach((card) => { card.inert = false; });
  };
}
