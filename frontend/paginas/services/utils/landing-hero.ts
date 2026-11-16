import { landingTimeline } from "./landing-timeline";

export function mountLandingHero(root: HTMLElement): () => void {
  const pin = root.querySelector<HTMLElement>("[data-landing-pin]");
  const viewports = [...root.querySelectorAll<HTMLElement>("[data-landing-viewport]")];
  if (!pin || !("ResizeObserver" in window) || !("IntersectionObserver" in window)) return () => {};
  const abort = new AbortController();
  const { signal } = abort;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let frame: number | undefined;
  let start = 0, distance = 1;
  let enabled = false;
  let visible = true;

  function draw() {
    frame = undefined;
    if (!enabled || !visible || document.hidden) return;
    const state = landingTimeline((scrollY - start) / distance);
    root.style.setProperty("--lp-m", String(state.morph));
    root.style.setProperty("--lp-approach", String(state.approach));
    root.style.setProperty("--lp-takeover", String(state.takeover));
    root.style.setProperty("--lp-preview", String(state.preview));
    root.style.setProperty("--lp-pain", String(state.pain));
    root.style.setProperty("--lp-browse", String(state.browse));
    state.questions.forEach((question, index) => {
      root.style.setProperty(`--lp-q${index}`, String(question));
    });
  }
  function schedule() {
    if (frame === undefined && enabled && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function syncActivity() {
    root.dataset.active = enabled && visible && !document.hidden ? "true" : "false";
    schedule();
  }
  function measure() {
    if (!enabled) return;
    start = root.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(pin!).top || "0");
    distance = Math.max(1, root.offsetHeight - pin!.offsetHeight);
    // Cache each scene viewport's overflow on resize, never in the scroll draw.
    const travels = viewports.map(viewport => ({
      device: viewport.dataset.landingViewport,
      pixels: Math.max(0, (viewport.firstElementChild?.scrollHeight ?? 0) - viewport.clientHeight),
    }));
    travels.forEach(({ device, pixels }) => {
      root.style.setProperty(`--lp-${device}-travel`, `${pixels}px`);
    });
    schedule();
  }
  function configure() {
    enabled = !reduced.matches;
    root.dataset.motion = enabled ? "on" : "off";
    if (!enabled) {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      root.removeAttribute("style");
    } else measure();
    syncActivity();
  }
  const resize = new ResizeObserver(measure);
  resize.observe(pin);
  viewports.forEach(viewport => {
    resize.observe(viewport);
    if (viewport.firstElementChild) resize.observe(viewport.firstElementChild);
  });
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncActivity(); });
  observer.observe(root);
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", measure, { passive: true, signal });
  window.addEventListener("pageshow", measure, { signal });
  document.addEventListener("visibilitychange", syncActivity, { signal });
  reduced.addEventListener("change", configure, { signal });
  configure();
  return () => {
    abort.abort();
    resize.disconnect(); observer.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    delete root.dataset.motion;
    delete root.dataset.active;
    root.removeAttribute("style");
  };
}
