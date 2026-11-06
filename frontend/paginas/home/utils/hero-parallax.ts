import { heroDepths, heroMotion } from "../config/hero";
import { mobileScrollProgress } from "../../../utils/hero-parallax";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function mountHeroParallax(hero: HTMLElement): () => void {
  const reducedMotion = window.matchMedia(heroMotion.reducedMotionQuery);
  const desktop = window.matchMedia(heroMotion.desktopQuery);
  const layers = Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-layer]"))
    .flatMap((element) => {
      const depth = heroDepths[element.dataset.heroLayer ?? ""];
      return depth ? [{ element, depth }] : [];
    });
  const abort = new AbortController();
  const listener = { passive: true, signal: abort.signal };
  let bounds = hero.getBoundingClientRect();
  let boundsDirty = true;
  let visible = false;
  let frame = 0;
  let previousTime = 0;
  let pointerX = 0;
  let pointerY = 0;
  let x = 0;
  let y = 0;
  let scroll = 0;
  let disposed = false;

  const enabled = () => !disposed && visible && !document.hidden && !reducedMotion.matches;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }

  function reset() {
    x = y = scroll = pointerX = pointerY = 0;
    layers.forEach(({ element }) => element.style.removeProperty("transform"));
  }

  function schedule() {
    if (enabled() && !frame) frame = requestAnimationFrame(render);
  }

  function render(time: number) {
    frame = 0;
    if (!enabled()) return;
    if (boundsDirty) {
      bounds = hero.getBoundingClientRect();
      boundsDirty = false;
    }

    const targetScroll = desktop.matches
      ? clamp(-bounds.top / Math.max(bounds.height, 1), 0, heroMotion.maxScrollProgress)
      : mobileScrollProgress(bounds) * heroMotion.mobileMultiplier;
    const seconds = previousTime ? Math.min((time - previousTime) / 1000, heroMotion.maxFrameSeconds) : 1 / 60;
    const blend = 1 - Math.exp(-heroMotion.damping * seconds);
    previousTime = time;
    x += (pointerX - x) * blend;
    y += (pointerY - y) * blend;
    scroll += (targetScroll - scroll) * blend;

    layers.forEach(({ element, depth }) => {
      const moveX = x * depth.pointer;
      const moveY = y * depth.pointer + scroll * depth.scroll;
      element.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
    });

    if (Math.max(Math.abs(pointerX - x), Math.abs(pointerY - y), Math.abs(targetScroll - scroll)) > heroMotion.settleThreshold) {
      schedule();
    } else {
      previousTime = 0;
    }
  }

  function updateState() {
    stop();
    const active = enabled();
    hero.dataset.motionActive = String(active);
    hero.dataset.parallaxActive = String(active);
    if (!active) reset();
    if (!desktop.matches) x = y = pointerX = pointerY = 0;
    boundsDirty = true;
    schedule();
  }

  hero.addEventListener("pointermove", (event) => {
    if (!enabled() || !desktop.matches || event.pointerType !== "mouse") return;
    if (boundsDirty) {
      bounds = hero.getBoundingClientRect();
      boundsDirty = false;
    }
    pointerX = clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1) * 2 - 1, -1, 1);
    pointerY = clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1) * 2 - 1, -1, 1);
    schedule();
  }, listener);
  hero.addEventListener("pointerleave", () => {
    pointerX = pointerY = 0;
    schedule();
  }, listener);
  window.addEventListener("scroll", () => {
    boundsDirty = true;
    schedule();
  }, listener);
  window.addEventListener("resize", () => {
    boundsDirty = true;
    schedule();
  }, listener);
  document.addEventListener("visibilitychange", updateState, { signal: abort.signal });
  reducedMotion.addEventListener("change", updateState, { signal: abort.signal });
  desktop.addEventListener("change", updateState, { signal: abort.signal });

  const resize = new ResizeObserver(() => {
    boundsDirty = true;
    schedule();
  });
  resize.observe(hero);

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    updateState();
  });
  intersection.observe(hero);
  updateState();

  return () => {
    disposed = true;
    stop();
    abort.abort();
    resize.disconnect();
    intersection.disconnect();
    reset();
    delete hero.dataset.motionActive;
    delete hero.dataset.parallaxActive;
  };
}
