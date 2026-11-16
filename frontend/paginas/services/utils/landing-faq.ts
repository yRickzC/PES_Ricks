import { mountScrollReveal } from "../../../utils/scroll-reveal";

export function mountLandingFaq(root: HTMLElement): () => void {
  mountScrollReveal(root, root.querySelectorAll<HTMLElement>("[data-faq-reveal]"));
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const items = Array.from(root.querySelectorAll<HTMLDetailsElement>("details"), (details) => ({
    details,
    summary: details.querySelector<HTMLElement>("summary")!,
    answer: details.querySelector<HTMLElement>(".lp-faq-answer")!,
    expanded: details.open,
    animation: undefined as Animation | undefined,
  }));

  function setExpanded(item: typeof items[number], expanded: boolean) {
    const start = item.details.open ? item.answer.getBoundingClientRect().height : 0;
    item.animation?.cancel();
    item.animation = undefined;
    item.expanded = expanded;
    item.details.dataset.faqExpanded = String(expanded);
    item.summary.setAttribute("aria-expanded", String(expanded));
    item.details.open = true;

    if (motion.matches || !item.answer.animate) {
      item.details.open = expanded;
      return;
    }

    const animation = item.answer.animate([
      { height: `${start}px`, opacity: start ? 1 : 0 },
      { height: `${expanded ? item.answer.scrollHeight : 0}px`, opacity: expanded ? 1 : 0 },
    ], { duration: 260, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "both" });
    item.animation = animation;
    animation.onfinish = () => {
      if (item.animation !== animation) return;
      item.details.open = item.expanded;
      animation.cancel();
      item.animation = undefined;
    };
  }

  for (const item of items) {
    // Native details remain usable without JS; enhancement controls animated closing.
    item.details.removeAttribute("name");
    item.summary.setAttribute("aria-expanded", String(item.expanded));
    item.summary.addEventListener("click", (event) => {
      event.preventDefault();
      const expanded = !item.expanded;
      if (expanded) {
        for (const other of items) {
          if (other !== item && other.expanded) setExpanded(other, false);
        }
      }
      setExpanded(item, expanded);
    }, { signal: controller.signal });
  }

  motion.addEventListener("change", () => {
    if (motion.matches) {
      for (const item of items) {
        item.animation?.cancel();
        item.animation = undefined;
        item.details.open = item.expanded;
      }
    }
  }, { signal: controller.signal });

  return () => {
    controller.abort();
    for (const item of items) {
      item.animation?.cancel();
      item.details.open = item.expanded;
      item.details.name = "landing-faq";
      delete item.details.dataset.faqExpanded;
      item.summary.removeAttribute("aria-expanded");
    }
  };
}
