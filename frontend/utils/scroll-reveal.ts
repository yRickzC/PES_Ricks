export function mountScrollReveal(root: Element, targets: Iterable<HTMLElement>) {
  if (!matchMedia("(prefers-reduced-motion: no-preference)").matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!(target instanceof HTMLElement) || !isIntersecting || target.dataset.scrollRevealState !== "waiting") continue;
      observer.unobserve(target);
      target.dataset.scrollRevealState = "entering";
    }
  });

  for (const target of targets) {
    if (target.matches(":focus-within")) continue;
    target.dataset.scrollRevealState = "waiting";
    observer.observe(target);
  }

  function revealFocused(event: Event) {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>("[data-scroll-reveal-state]");
    if (!target) return;
    observer.unobserve(target);
    delete target.dataset.scrollRevealState;
  }

  function finishReveal(event: Event) {
    if (!(event instanceof AnimationEvent) || event.animationName !== "scroll-fade-in-up") return;
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.scrollRevealState === "entering") {
      delete target.dataset.scrollRevealState;
    }
  }

  root.addEventListener("focusin", revealFocused);
  // Clearing the state prevents a hidden category from replaying when shown again.
  root.addEventListener("animationend", finishReveal);
  root.addEventListener("animationcancel", finishReveal);
  document.addEventListener("astro:before-swap", () => {
    observer.disconnect();
    root.removeEventListener("focusin", revealFocused);
    root.removeEventListener("animationend", finishReveal);
    root.removeEventListener("animationcancel", finishReveal);
  }, { once: true });
}
