import { landingTimeline } from "./landing-timeline";

export function mountLandingHero(root: HTMLElement): () => void {
  const pin = root.querySelector<HTMLElement>("[data-landing-pin]");
  const messages = [...root.querySelectorAll<HTMLElement>("[data-landing-message]")];
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
    root.style.setProperty("--lp-cut", `${state.cut}%`);
    root.style.setProperty("--lp-preview", String(state.preview));
    root.style.setProperty("--lp-camera", String(state.camera));
    messages.forEach((message, index) => {
      message.style.opacity = String(state.messages[index] ?? 0);
    });
  }
  function schedule() {
    if (frame === undefined && enabled && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function measure() {
    if (!enabled) return;
    start = root.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(pin!).top || "0");
    distance = Math.max(1, root.offsetHeight - pin!.offsetHeight);
    schedule();
  }
  function configure() {
    enabled = !reduced.matches;
    root.dataset.motion = enabled ? "on" : "off";
    if (!enabled) {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      root.removeAttribute("style");
      messages.forEach(message => { message.style.removeProperty("opacity"); });
    } else measure();
  }
  const resize = new ResizeObserver(measure);
  resize.observe(pin);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
  observer.observe(root);
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", measure, { passive: true, signal });
  window.addEventListener("pageshow", measure, { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  reduced.addEventListener("change", configure, { signal });
  configure();
  return () => {
    abort.abort();
    resize.disconnect(); observer.disconnect();
    if (frame !== undefined) cancelAnimationFrame(frame);
    delete root.dataset.motion;
    root.removeAttribute("style");
    messages.forEach(message => { message.style.removeProperty("opacity"); });
  };
}
