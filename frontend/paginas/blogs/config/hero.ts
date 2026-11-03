export interface BlogHeroLayer {
  id: string;
  src: string;
  depth: number;
  yOffset: number;
  scale: number;
  zIndex: number;
}

// The dunes share a 2172 × 724 transparent canvas. Preserve their alignment.
export const blogHeroLayers = [
  { id: "sky", src: "/images/Hero_Main_Background.webp", depth: 0.08, yOffset: 0, scale: 1.12, zIndex: 0 },
  { id: "duna_0", src: "/images/Blog_Hero_Dune_0.webp", depth: 0.15, yOffset: -18, scale: 1.04, zIndex: 1 },
  { id: "duna_1", src: "/images/Blog_Hero_Dune_1.webp", depth: 0.28, yOffset: 2, scale: 1.04, zIndex: 2 },
  { id: "duna_2", src: "/images/Blog_Hero_Dune_2.webp", depth: 0.45, yOffset: 12, scale: 1.04, zIndex: 3 },
  { id: "duna_3", src: "/images/Blog_Hero_Dune_3.webp", depth: 0.70, yOffset: 20, scale: 1.04, zIndex: 4 },
] as const satisfies readonly BlogHeroLayer[];

export const blogHeroMotion = {
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  mobileQuery: "(max-width: 760px), (pointer: coarse)",
  mobileMultiplier: 0.24,
  // Depth multiplies a bounded travel distance, rather than full-page scroll.
  travelFraction: 0.18,
  maxTravel: 140,
  damping: 12,
  maxFrameSeconds: 0.05,
  settlePixels: 0.1,
} as const;
