import { HOME_NOTE_INTERVAL } from "../config/home-posts";

export function mountHomeNews(root: HTMLElement): () => void {
  const notes = [...root.querySelectorAll<HTMLElement>("[data-news-note]")];
  const count = new Set(notes.map((note) => note.dataset.notePage)).size;
  if (count < 2) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let page = 0;
  let hovered = false;
  let visible = !("IntersectionObserver" in window);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function schedule() {
    clearTimeout(timer);
    if (!reduced.matches && visible && !document.hidden && !hovered && !root.matches(":focus-within")) {
      timer = setTimeout(advance, HOME_NOTE_INTERVAL);
    }
  }
  function advance() {
    page = (page + 1) % count;
    notes.forEach((note) => { note.hidden = Number(note.dataset.notePage) !== page; });
    schedule();
  }
  root.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { hovered = true; schedule(); } }, { signal });
  root.addEventListener("pointerleave", () => { hovered = false; schedule(); }, { signal });
  root.addEventListener("focusin", schedule, { signal });
  root.addEventListener("focusout", () => queueMicrotask(() => { if (!signal.aborted) schedule(); }), { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  reduced.addEventListener("change", schedule, { signal });
  const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }) : undefined;
  observer?.observe(root);
  schedule();
  return () => { abort.abort(); clearTimeout(timer); observer?.disconnect(); };
}
