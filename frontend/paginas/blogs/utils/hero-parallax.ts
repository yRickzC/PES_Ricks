import { mountHeroParallax } from "../../../utils/hero-parallax";
import { blogHeroLayers, blogHeroMotion } from "../config/hero";

export function mountBlogHeroParallax(hero: HTMLElement): () => void {
  return mountHeroParallax(hero, {
    layers: blogHeroLayers,
    motion: blogHeroMotion,
    layerAttribute: "data-blog-layer",
  });
}
