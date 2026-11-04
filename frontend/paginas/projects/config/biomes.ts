import type { HeroParallaxLayer } from "../../../utils/hero-parallax";

interface Placement {
  width: string;
  bottom: string;
  top: string;
  scale: number;
  x?: string;
}

interface ProjectBiomeLayer extends HeroParallaxLayer {
  src: string;
  zIndex: number;
  className: string;
  opacity?: number;
  desktop?: Placement;
  mobile?: Placement;
  animation?: { duration: string; travel: string; lift: string };
}

interface ProjectBiome {
  id: string;
  category: string;
  layers: readonly ProjectBiomeLayer[];
}

export const projectBiomes = [
  {
    id: "crystal-cave",
    category: "web",
    layers: [
      { id: "cave-background", src: "/images/Service_Crystal_Background.png", className: "cave-background", depth: 0.035, zIndex: 0, opacity: 1,
        desktop: { width: "calc(100% + 48px)", bottom: "-24px", top: "-24px", scale: 1 },
        mobile: { width: "calc(100% + 32px)", bottom: "-16px", top: "-16px", scale: 1 },
      },
      { id: "cave-small", src: "/images/Service_Crystal_Small.png", className: "cave-small", depth: 0.1, zIndex: 1, opacity: 0.72,
        desktop: { width: "max(110%, 1800px)", bottom: "-16px", top: "auto", scale: 1 },
        mobile: { width: "max(160%, 1000px)", bottom: "-10px", top: "auto", scale: 1, x: "-5%" },
      },
      { id: "cave-fog", src: "/images/Service_Crystal_Fog.png", className: "cave-fog", depth: 0.13, zIndex: 2, opacity: 0.18,
        desktop: { width: "max(122%, 2000px)", bottom: "-56px", top: "auto", scale: 1 },
        mobile: { width: "max(190%, 1200px)", bottom: "-30px", top: "auto", scale: 1 },
        animation: { duration: "125s", travel: "22px", lift: "4px" },
      },
      { id: "cave-medium", src: "/images/Service_Crystal_Medium.png", className: "cave-medium", depth: 0.2, zIndex: 3, opacity: 1,
        desktop: { width: "max(118%, 1940px)", bottom: "-58px", top: "auto", scale: 1 },
        mobile: { width: "max(175%, 1100px)", bottom: "-40px", top: "auto", scale: 1, x: "125%" },
      },
      { id: "cave-top", src: "/images/Service_Crystal_Top.png", className: "cave-top", depth: 0.25, zIndex: 4, opacity: 1,
        desktop: { width: "max(110%, 1680px)", bottom: "auto", top: "-30px", scale: 1 },
        mobile: { width: "max(220%, 1050px)", bottom: "auto", top: "-18px", scale: 1 },
      },
    ],
  },
] as const satisfies readonly ProjectBiome[];
export function projectLayerStyle(layer: ProjectBiomeLayer): string {
  const values = [`z-index: ${layer.zIndex}`];
  if (layer.opacity !== undefined) values.push(`opacity: ${layer.opacity}`);
  for (const viewport of ["desktop", "mobile"] as const) {
    const placement = layer[viewport];
    if (placement) for (const [name, value] of Object.entries(placement)) values.push(`--${viewport}-${name}: ${value}`);
  }
  if (layer.animation) for (const [name, value] of Object.entries(layer.animation)) values.push(`--fog-${name}: ${value}`);
  return values.join("; ");
}
