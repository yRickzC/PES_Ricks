import { mountHeroParallax } from "../../../utils/hero-parallax";
import { projectBiomes } from "../config/biomes";
import { projectHeroMotion } from "../config/hero";

export function mountProjectBiome(scene: HTMLElement): () => void {
  const section = scene.closest<HTMLElement>("[data-project-section]");
  const biome = projectBiomes.find(({ id }) => id === scene.dataset.projectBiome);
  if (!section || !biome) return () => {};
  let disposed = false;
  let loading = false;
  let stop: (() => void) | undefined;
  async function loadImage(image: HTMLImageElement) {
    if (disposed) return;
    if (!image.hasAttribute("src")) {
      if (image.dataset.biomeSrcset) image.srcset = image.dataset.biomeSrcset;
      image.src = image.dataset.biomeSrc!;
    }
    try {
      await image.decode();
      if (!disposed) image.dataset.biomeReady = "true";
    } catch { /* A failed decorative layer must not hide the other layers. */ }
  }
  async function load() {
    if (disposed || loading || !section!.matches(":target") || scene.dataset.ready === "true") return;
    loading = true;
    try {
      const images = [...scene.querySelectorAll<HTMLImageElement>("[data-biome-src]")];
      const background = scene.querySelector<HTMLImageElement>(".project-biome-layer--cave-background [data-biome-src]");
      // Make the backdrop available before requesting nonessential foreground art.
      if (background) await loadImage(background);
      if (disposed) return;
      scene.dataset.ready = "true";
      stop = mountHeroParallax(section!, {
        layers: biome!.layers,
        motion: { ...projectHeroMotion, maxTravel: 64, pointerTravel: 24, ...biome!.motion },
        layerAttribute: "data-project-biome-layer",
      });
      // Each layer fades in independently; a rejection never holds the scene back.
      await Promise.allSettled(images.filter((image) => image !== background).map(loadImage));
    } catch { /* Keep the section readable on its original dark background. */ }
    finally { loading = false; }
  }
  const visible = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) void load();
  }, { rootMargin: "180px 0px" });
  visible.observe(section);
  // Load the selected biome immediately, even before it enters the viewport.
  const selected = () => { void load(); };
  section.addEventListener("project-category-change", selected);
  if (window.location.hash === `#${section.id}`) void load();
  return () => {
    disposed = true;
    visible.disconnect();
    section.removeEventListener("project-category-change", selected);
    stop?.();
  };
}
