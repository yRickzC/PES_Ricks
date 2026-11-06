export interface HeroParallaxLayer {
  id: string;
  depth: number;
}

export interface HeroParallaxMotion {
  reducedMotionQuery: string;
  desktopQuery: string;
  mobileMultiplier: number;
  travelFraction?: number;
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

// Scene instances share a single passive window scroll subscription.
const scrollSubscribers = new Set<() => void>();
const onScroll = () => scrollSubscribers.forEach((invalidate) => invalidate());
function subscribeScroll(invalidate: () => void): () => void {
  if (!scrollSubscribers.size) window.addEventListener("scroll", onScroll, { passive: true });
  scrollSubscribers.add(invalidate);
  return () => {
    scrollSubscribers.delete(invalidate);
    if (!scrollSubscribers.size) window.removeEventListener("scroll", onScroll);
  };
}

// One frame batch for all visible scenes, including the Hero. Sleeping scenes
// enqueue nothing; observers and events only wake a scene when it needs work.
const renderQueue = new Set<(time: number) => void>();
let sharedFrame = 0;
function enqueueRender(render: (time: number) => void) {
  renderQueue.add(render);
  if (!sharedFrame) sharedFrame = requestAnimationFrame((time) => {
    sharedFrame = 0;
    const batch = [...renderQueue];
    renderQueue.clear();
    batch.forEach((callback) => callback(time));
  });
}
function cancelRender(render: (time: number) => void) {
  renderQueue.delete(render);
  if (!renderQueue.size) { cancelAnimationFrame(sharedFrame); sharedFrame = 0; }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function mobileScrollProgress(bounds: DOMRectReadOnly): number {
  // Below-the-fold scenes start moving as they reach the middle of the viewport.
  // At the top of the page, the current scroll offset keeps the scene at rest.
  const distance = Math.min(window.scrollY, window.innerHeight / 2 - bounds.top);
  return clamp(distance / Math.max(bounds.height, 1), 0, 1);
}

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
  let pendingFrame = false;
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
    cancelRender(render);
    pendingFrame = false;
    previousTime = 0;
  }
  function schedule() {
    if (enabled() && !pendingFrame) { pendingFrame = true; enqueueRender(render); }
  }
  function render(time: number) {
    pendingFrame = false;
    if (!enabled()) return;
    if (boundsDirty) {
      bounds = hero.getBoundingClientRect();
      boundsDirty = false;
    }
    const { maxTravel, travelFraction } = motion;
    const travel = travelFraction === undefined ? maxTravel : Math.min(bounds.height * travelFraction, maxTravel);
    const desktopScroll = travelFraction === undefined
      ? clamp(-bounds.top, 0, maxTravel)
      : clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1) * travel;
    const targetScroll = desktop.matches ? desktopScroll : mobileScrollProgress(bounds) * travel * motion.mobileMultiplier;
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
    if (!desktop.matches) x = y = pointerX = pointerY = 0;
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
  const unsubscribeScroll = subscribeScroll(invalidate);
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
    unsubscribeScroll();
    resize.disconnect();
    intersection.disconnect();
    layers.forEach(({ element }) => element.style.removeProperty("transform"));
    delete hero.dataset.parallaxActive;
  };
}
