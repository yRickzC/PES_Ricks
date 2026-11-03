export const projectHeroLayers = [
  { id: "sky", src: "/images/Hero_Main_Background.webp", depth: 0.05, zIndex: 0 },
  { id: "main", src: "/images/Project_Hero_MainFlorest.webp", depth: 0.15, zIndex: 1 },
  { id: "fog", src: "/images/Project_Hero_Fog.webp", depth: 0.25, zIndex: 2 },
  { id: "foreground", src: "/images/Project_Hero_Florest.webp", depth: 0.40, zIndex: 3 },
] as const;

export const projectHeroMotion = {
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  desktopQuery: "(min-width: 761px) and (hover: hover) and (pointer: fine)",
  mobileMultiplier: 0.24,
  maxTravel: 100,
  pointerTravel: 40,
  damping: 10,
  settlePixels: 0.1,
} as const;

