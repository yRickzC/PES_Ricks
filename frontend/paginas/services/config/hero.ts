import type { HeroParallaxLayer, HeroParallaxMotion } from "../../../utils/hero-parallax";

interface ServicePlacement {
  width: string;
  y: string;
  scale: number;
}

interface ServiceHeroLayer extends HeroParallaxLayer {
  src: string;
  zIndex: number;
  opacity: number;
  anchorY: string;
  desktop: ServicePlacement;
  mobile: ServicePlacement;
  sizes: string;
}

export const serviceSkyImage = "/images/Hero_Main_Background.webp";

// Keep the source proportions. Overscan and staggered bases protect all three
// silhouettes from gaps while the shared controller translates their wrappers.
export const serviceHeroLayers = [
  {
    id: "sky", src: serviceSkyImage, depth: 0.05, zIndex: 0, opacity: 0.55, anchorY: "-50%",
    desktop: { width: "calc(100% + 64px)", y: "50%", scale: 1 },
    mobile: { width: "calc(100% + 64px)", y: "50%", scale: 1 },
    sizes: "calc(100vw + 64px)",
  },
  {
    id: "moon", src: "/images/Ladding_Hero_Moon.webp", depth: 0.10, zIndex: 1, opacity: 0.94, anchorY: "-50%",
    desktop: { width: "clamp(640px, 64vw, 920px)", y: "68%", scale: 1 },
    mobile: { width: "clamp(580px, 126vw, 714px)", y: "70%", scale: 1 },
    sizes: "(max-width: 460px) 580px, (max-width: 566px) 126vw, (max-width: 760px) 714px, (max-width: 1000px) 640px, (max-width: 1438px) 64vw, 920px",
  },
  {
    id: "rock0", src: "/images/Service_Hero_Rock0.webp", depth: 0.15, zIndex: 2, opacity: 0.72, anchorY: "-100%",
    desktop: { width: "max(112%, 1500px)", y: "calc(100% - 96px)", scale: 1 },
    mobile: { width: "max(112%, 1000px)", y: "calc(100% - 88px)", scale: 1 },
    sizes: "(max-width: 760px) 1000px, (max-width: 1339px) 1500px, 112vw",
  },
  {
    id: "fog", src: "/images/Service_Hero_Fog.webp", depth: 0.22, zIndex: 3, opacity: 0.12, anchorY: "-100%",
    desktop: { width: "max(120%, 1620px)", y: "calc(100% - 48px)", scale: 1 },
    mobile: { width: "max(120%, 1080px)", y: "calc(100% - 48px)", scale: 1 },
    sizes: "(max-width: 760px) 1080px, (max-width: 1350px) 1620px, 120vw",
  },
  {
    id: "rock1", src: "/images/Service_Hero_Rock1.webp", depth: 0.30, zIndex: 4, opacity: 1, anchorY: "-100%",
    desktop: { width: "max(116%, 1560px)", y: "calc(100% - 12px)", scale: 1 },
    mobile: { width: "max(116%, 1080px)", y: "calc(100% - 16px)", scale: 1 },
    sizes: "(max-width: 760px) 1080px, (max-width: 1345px) 1560px, 116vw",
  },
  {
    id: "rock2", src: "/images/Service_Hero_Rock2.webp", depth: 0.48, zIndex: 5, opacity: 1, anchorY: "-100%",
    desktop: { width: "max(124%, 1680px)", y: "calc(100% + 48px)", scale: 1 },
    mobile: { width: "max(124%, 1180px)", y: "calc(100% + 32px)", scale: 1 },
    sizes: "(max-width: 760px) 1180px, (max-width: 1355px) 1680px, 124vw",
  },
] as const satisfies readonly ServiceHeroLayer[];

export const serviceHeroMotion = {
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  desktopQuery: "(min-width: 761px) and (hover: hover) and (pointer: fine)",
  mobileMultiplier: 0.65,
  maxTravel: 80,
  pointerTravel: 24,
  damping: 10,
  settlePixels: 0.1,
} as const satisfies HeroParallaxMotion;

export const serviceHeroFog = { duration: "120s", travel: "18px", lift: "3px" } as const;

export function serviceLayerStyle(layer: ServiceHeroLayer): string {
  return [
    `z-index: ${layer.zIndex}`, `opacity: ${layer.opacity}`, `--anchor-y: ${layer.anchorY}`,
    ...(["desktop", "mobile"] as const).flatMap((viewport) => [
      `--${viewport}-width: ${layer[viewport].width}`,
      `--${viewport}-y: ${layer[viewport].y}`,
      `--${viewport}-scale: ${layer[viewport].scale}`,
    ]),
  ].join("; ");
}
