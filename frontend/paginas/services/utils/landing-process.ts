/** Enhance the semantic list without changing its reading order or scroll behavior. */
export function mountLandingProcess(root: HTMLElement): () => void {
  const timeline = root.querySelector<HTMLElement>("[data-process-timeline]");
  const fill = root.querySelector<HTMLElement>("[data-process-fill]");
  const steps = [...root.querySelectorAll<HTMLElement>("[data-process-step]")];
  const markers = [...root.querySelectorAll<HTMLElement>("[data-process-marker]")];
  if (!timeline || !fill || markers.length < 2 || markers.length !== steps.length ||
      !("IntersectionObserver" in window) || !("ResizeObserver" in window)) return () => {};

  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let frame: number | undefined;
  let visible = false;
  let disposed = false;
  let active = -1;
  let geometry = "";

  function reset() {
    delete root.dataset.processEnhanced;
    timeline!.removeAttribute("style");
    fill!.removeAttribute("style");
    steps.forEach(step => {
      delete step.dataset.processActive;
      delete step.dataset.processReached;
    });
    active = -1;
    geometry = "";
  }

  function draw() {
    frame = undefined;
    if (disposed || reduced.matches || !visible || document.hidden) return;

    // Batch all geometry reads before writes. Real centers handle wrapped copy,
    // resizing and layout shifts above this section without cached scroll offsets.
    const bounds = timeline!.getBoundingClientRect();
    const points = markers.map(marker => {
      const rect = marker.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    const first = points[0];
    const last = points[points.length - 1];
    const height = Math.max(1, last.y - first.y);
    const readingLine = window.innerHeight * .55;
    const progress = Math.max(0, Math.min(1, (readingLine - first.y) / height));
    const nextActive = points.reduce((index, point, i) => point.y <= readingLine ? i : index, -1);
    const nextGeometry = [first.x - bounds.left, first.y - bounds.top, height].map(n => n.toFixed(2));

    if (nextGeometry.join(",") !== geometry) {
      timeline!.style.setProperty("--process-track-left", `${nextGeometry[0]}px`);
      timeline!.style.setProperty("--process-track-top", `${nextGeometry[1]}px`);
      timeline!.style.setProperty("--process-track-height", `${nextGeometry[2]}px`);
      geometry = nextGeometry.join(",");
    }
    fill!.style.setProperty("--process-progress", String(progress));
    if (active !== nextActive) {
      steps.forEach((step, index) => {
        step.toggleAttribute("data-process-active", index === nextActive);
        step.toggleAttribute("data-process-reached", index <= nextActive);
      });
      active = nextActive;
    }
    root.dataset.processEnhanced = "";
  }

  function schedule() {
    if (!disposed && !reduced.matches && visible && !document.hidden && frame === undefined) {
      frame = requestAnimationFrame(draw);
    }
  }
  function configure() {
    if (reduced.matches) {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      reset();
    } else schedule();
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }, { rootMargin: "15% 0px" });
  observer.observe(root);
  const resize = new ResizeObserver(schedule);
  resize.observe(timeline);
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", schedule, { passive: true, signal });
  window.addEventListener("pageshow", schedule, { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  reduced.addEventListener("change", configure, { signal });

  return () => {
    disposed = true;
    abort.abort();
    observer.disconnect();
    resize.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    reset();
  };
}
