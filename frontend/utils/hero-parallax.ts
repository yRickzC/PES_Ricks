export interface HeroParallaxLayer {
  id: string;
  depth: number;
}

export interface HeroParallaxMotion {
  reducedMotionQuery: string;
  desktopQuery: string;
  mobileMultiplier: number;
  maxTravel: number;
  pointerTravel: number;
  damping: number;
  settlePixels: number;
}

interface HeroParallaxOptions {
  layers: readonly HeroParallaxLayer[];
  motion: HeroParallaxMotion;
  layerAttribute: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function mountHeroParallax(hero: HTMLElement, options: HeroParallaxOptions): () => void {
  const { layers: configuration, motion, layerAttribute } = options;
  const reducedMotion = window.matchMedia(motion.reducedMotionQuery);
  const desktop = window.matchMedia(motion.desktopQuery);
  const layers = configuration.flatMap(({ id, depth }) => {
    const element = hero.querySelector<HTMLElement>(`[${layerAttribute}="${id}"]`);
    return element ? [{ element, depth }] : [];
  });
  const abort = new AbortController();
  const passive = { passive: true, signal: abort.signal };
  let visible = false;
  let disposed = false;
  let frame = 0;
  let previousTime = 0;
  let bounds = hero.getBoundingClientRect();
  let boundsDirty = true;
  let pointerX = 0;
  let pointerY = 0;
  let x = 0;
  let y = 0;
  let scroll = 0;

  const enabled = () => !disposed && visible && !document.hidden && !reducedMotion.matches;
  function stop() {
    cancelAnimationFrame(frame);
    frame = previousTime = 0;
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
    const multiplier = desktop.matches ? 1 : motion.mobileMultiplier;
    const targetScroll = clamp(-bounds.top, 0, motion.maxTravel) * multiplier;
    const seconds = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
    previousTime = time;
    const blend = 1 - Math.exp(-motion.damping * seconds);
    x += (pointerX - x) * blend;
    y += (pointerY - y) * blend;
    scroll += (targetScroll - scroll) * blend;
    const settled = Math.max(Math.abs(pointerX - x), Math.abs(pointerY - y), Math.abs(targetScroll - scroll)) < motion.settlePixels;
    if (settled) { x = pointerX; y = pointerY; scroll = targetScroll; }
    layers.forEach(({ element, depth }) => {
      element.style.transform = `translate3d(${(x * depth).toFixed(2)}px, ${((y + scroll) * depth).toFixed(2)}px, 0)`;
    });
    if (!settled) schedule();
    else previousTime = 0;
  }
  function invalidate() { boundsDirty = true; schedule(); }
  function resetPointer() { pointerX = pointerY = 0; schedule(); }
  function updateState() {
    stop();
    if (!desktop.matches) pointerX = pointerY = 0;
    hero.dataset.parallaxActive = String(enabled());
    if (reducedMotion.matches) {
      x = y = scroll = pointerX = pointerY = 0;
      layers.forEach(({ element }) => element.style.removeProperty("transform"));
    }
    invalidate();
  }

  hero.addEventListener("pointermove", (event) => {
    if (!enabled() || !desktop.matches || event.pointerType !== "mouse") return;
    if (boundsDirty) { bounds = hero.getBoundingClientRect(); boundsDirty = false; }
    pointerX = clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5, -0.5, 0.5) * motion.pointerTravel;
    pointerY = clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5, -0.5, 0.5) * motion.pointerTravel;
    schedule();
  }, passive);
  hero.addEventListener("pointerleave", resetPointer, passive);
  window.addEventListener("scroll", invalidate, passive);
  window.addEventListener("resize", invalidate, passive);
  document.addEventListener("visibilitychange", updateState, { signal: abort.signal });
  desktop.addEventListener("change", updateState, { signal: abort.signal });
  reducedMotion.addEventListener("change", updateState, { signal: abort.signal });
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
