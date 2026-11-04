import type { HeroParallaxLayer, HeroParallaxMotion } from "../../../utils/hero-parallax";

interface Placement {
  width: string;
  bottom: string;
  top: string;
  scale: number;
  x?: string;
}

export interface ProjectBiomeLayer extends HeroParallaxLayer {
  src: string;
  zIndex: number;
  className: string;
  opacity?: number;
  desktop?: Placement;
  mobile?: Placement;
  animation?: { duration: string; travel: string; lift: string };
}

export interface ProjectBiome {
  id: string;
  category: string;
  layers: readonly ProjectBiomeLayer[];
  motion?: Partial<HeroParallaxMotion>;
}

const crystalCave = [
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
type LayerName = "Background" | "Small" | "Fog" | "Medium" | "Top";
interface SceneDefinition {
  id: string;
  category: string;
  prefix: string;
  depths: readonly [number, number, number, number, number];
  mediumWidth: string;
  smallX: string;
  mediumX: string;
  topWidth: string;
  fogOpacity: number;
  fogDuration: string;
}

// The five new scenes use the existing renderer and supply their own framing.
function createBiome(scene: SceneDefinition): ProjectBiome {
  const order: LayerName[] = ["Background", "Small", "Fog", "Medium", "Top"];
  return {
    id: scene.id, category: scene.category,
    motion: { travelFraction: 0.1, maxTravel: 64, pointerTravel: 24, mobileMultiplier: 0.16 },
    layers: order.map((name, index): ProjectBiomeLayer => {
      const base = crystalCave[0].layers[index]!;
      const mobile: Placement = { ...base.mobile };
      if (name === "Small") mobile.x = scene.smallX;
      if (name === "Medium") { mobile.x = scene.mediumX; mobile.width = scene.mediumWidth; }
      if (name === "Top") mobile.width = scene.topWidth;
      return {
        ...base, id: `${scene.id}-${name.toLowerCase()}`,
        src: `/images/${scene.prefix}_${name}.png`, depth: scene.depths[index]!, mobile,
        ...(name === "Fog" ? { opacity: scene.fogOpacity, animation: { duration: scene.fogDuration, travel: "18px", lift: "3px" } } : {}),
      };
    }),
  };
}

export const projectBiomes: readonly ProjectBiome[] = [
  ...crystalCave,
  createBiome({ id: "volcanic-cave", category: "game-dev", prefix: "Project_GameDev", depths: [0.04, 0.12, 0.18, 0.28, 0.35], mediumWidth: "max(185%, 1120px)", smallX: "0%", mediumX: "118%", topWidth: "max(210%, 1080px)", fogOpacity: 0.13, fogDuration: "135s" }),
  createBiome({ id: "basalt-abyss", category: "low-level", prefix: "Project_LowLevel", depths: [0.04, 0.1, 0.15, 0.24, 0.32], mediumWidth: "max(170%, 1020px)", smallX: "-8%", mediumX: "118%", topWidth: "max(200%, 1040px)", fogOpacity: 0.1, fogDuration: "150s" }),
  createBiome({ id: "subterranean-waters", category: "mobile", prefix: "Project_Mobile", depths: [0.04, 0.12, 0.17, 0.26, 0.34], mediumWidth: "max(170%, 1000px)", smallX: "-2%", mediumX: "112%", topWidth: "max(200%, 1000px)", fogOpacity: 0.13, fogDuration: "145s" }),
  createBiome({ id: "mineral-chamber", category: "products", prefix: "Project_Products", depths: [0.04, 0.12, 0.18, 0.28, 0.36], mediumWidth: "max(180%, 1080px)", smallX: "-5%", mediumX: "122%", topWidth: "max(215%, 1060px)", fogOpacity: 0.12, fogDuration: "140s" }),
  createBiome({ id: "bioluminescent-cave", category: "machine-learning", prefix: "Project_ML", depths: [0.04, 0.12, 0.18, 0.27, 0.34], mediumWidth: "max(180%, 1050px)", smallX: "-4%", mediumX: "120%", topWidth: "max(210%, 1040px)", fogOpacity: 0.14, fogDuration: "130s" }),
];

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
