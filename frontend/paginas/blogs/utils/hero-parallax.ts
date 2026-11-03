import { blogHeroLayers, blogHeroMotion } from "../config/hero";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function mountBlogHeroParallax(hero: HTMLElement): () => void {
  const reducedMotion = window.matchMedia(blogHeroMotion.reducedMotionQuery);
  const mobile = window.matchMedia(blogHeroMotion.mobileQuery);
  const layers = blogHeroLayers.flatMap((layer) => {
    const element = hero.querySelector<HTMLElement>(`[data-blog-layer="${layer.id}"]`);
    return element ? [{ element, depth: layer.depth }] : [];
  });
  const abort = new AbortController();
  const passive = { passive: true, signal: abort.signal };
  let visible = false;
  let disposed = false;
  let frame = 0;
  let previousTime = 0;
  let distance = 0;
  let target = 0;
  let boundsDirty = true;

  const enabled = () => !disposed && visible && !document.hidden && !reducedMotion.matches;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }

  function schedule() {
    if (enabled() && !frame) frame = requestAnimationFrame(render);
  }

  function render(time: number) {
    frame = 0;
    if (!enabled()) return;

    // Read geometry once per scroll/resize, then only write composited transforms.
    if (boundsDirty) {
      const bounds = hero.getBoundingClientRect();
      const progress = clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1);
      const travel = Math.min(bounds.height * blogHeroMotion.travelFraction, blogHeroMotion.maxTravel);
      target = progress * travel * (mobile.matches ? blogHeroMotion.mobileMultiplier : 1);
      boundsDirty = false;
    }

    const seconds = previousTime ? Math.min((time - previousTime) / 1000, blogHeroMotion.maxFrameSeconds) : 1 / 60;
    previousTime = time;
    distance += (target - distance) * (1 - Math.exp(-blogHeroMotion.damping * seconds));
    const settled = Math.abs(target - distance) <= blogHeroMotion.settlePixels;
    if (settled) distance = target;

    layers.forEach(({ element, depth }) => {
      element.style.transform = `translate3d(0, ${(distance * depth).toFixed(2)}px, 0)`;
    });
    if (!settled) schedule();
    else previousTime = 0;
  }

  function invalidate() {
    boundsDirty = true;
    schedule();
  }

  function updateState() {
    stop();
    hero.dataset.parallaxActive = String(enabled());
    if (reducedMotion.matches) {
      distance = target = 0;
      layers.forEach(({ element }) => element.style.removeProperty("transform"));
    }
    invalidate();
  }

  window.addEventListener("scroll", invalidate, passive);
  window.addEventListener("resize", invalidate, passive);
  document.addEventListener("visibilitychange", updateState, { signal: abort.signal });
  reducedMotion.addEventListener("change", updateState, { signal: abort.signal });
  mobile.addEventListener("change", updateState, { signal: abort.signal });

  const resize = new ResizeObserver(invalidate);
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
    layers.forEach(({ element }) => element.style.removeProperty("transform"));
    delete hero.dataset.parallaxActive;
  };
}
