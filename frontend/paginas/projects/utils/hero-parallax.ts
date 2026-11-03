import { mountHeroParallax } from "../../../utils/hero-parallax";
import { projectHeroLayers, projectHeroMotion } from "../config/hero";

export function mountProjectHeroParallax(hero: HTMLElement): () => void {
  return mountHeroParallax(hero, {
    layers: projectHeroLayers,
    motion: projectHeroMotion,
    layerAttribute: "data-project-layer",
  });
}
