export interface HeroPlacement {
  x: string;
  y: string;
  width: string;
  scale?: number;
  anchorY?: string;
}

export interface HeroDepth {
  pointer: number;
  scroll: number;
}

export interface HeroLayer {
  id: string;
  src: string;
  width: number;
  height: number;
  loading: "eager" | "lazy";
  zIndex: number;
  opacity: number;
  depth: HeroDepth;
  desktop: HeroPlacement;
  mobile: HeroPlacement;
}

export const heroMotion = {
  desktopQuery: "(min-width: 960px) and (hover: hover) and (pointer: fine)",
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
  damping: 9,
  settleThreshold: 0.001,
  maxFrameSeconds: 0.05,
  maxScrollProgress: 1,
} as const;

export const heroLayers = [
  {
    id: "sky", src: "/images/Hero_Main_Background.webp", width: 1672, height: 941,
    loading: "eager",
    zIndex: 0, opacity: 0.82, depth: { pointer: 5, scroll: 20 },
    desktop: { x: "50%", y: "50%", width: "100%" },
    mobile: { x: "50%", y: "50%", width: "100%" },
  },
  {
    id: "moon", src: "/images/Ladding_Hero_Moon.webp", width: 1536, height: 1024,
    loading: "eager",
    zIndex: 2, opacity: 1, depth: { pointer: 10, scroll: 35 },
    desktop: { x: "50%", y: "0%", width: "clamp(160px, 18vw, 240px)" },
    mobile: { x: "50%", y: "0%", width: "min(48vw, 190px)" },
  },
  {
    id: "island", src: "/images/Ladding_Hero_Island.webp", width: 1536, height: 1024,
    loading: "eager",
    zIndex: 3, opacity: 1, depth: { pointer: 20, scroll: 55 },
    desktop: { x: "50%", y: "48%", width: "min(50vw, 720px)" },
    mobile: { x: "50%", y: "55%", width: "min(116vw, 620px)" },
  },
  {
    id: "factory", src: "/images/Ladding_Hero_Factory.webp", width: 2172, height: 724,
    loading: "lazy",
    zIndex: 5, opacity: 0.85, depth: { pointer: 8, scroll: 12 },
    desktop: { x: "50%", y: "100%", width: "100%", anchorY: "-100%" },
    mobile: { x: "50%", y: "100%", width: "max(100%, 660px)", anchorY: "-100%" },
  },
  {
    id: "gears", src: "/images/Ladding_Hero_Gear.webp", width: 2172, height: 724,
    loading: "lazy",
    zIndex: 6, opacity: 0.9, depth: { pointer: 30, scroll: 22 },
    desktop: { x: "50%", y: "100%", width: "112%", anchorY: "-100%" },
    mobile: { x: "50%", y: "100%", width: "106%", anchorY: "-100%" },
  },
] as const satisfies readonly HeroLayer[];

export const heroFog = {
  zIndex: 4,
  depth: { pointer: 14, scroll: 42 },
  layers: [
    { x: "50%", y: "78%", width: "62%", height: "15%", opacity: 0.28, duration: "36s", delay: "-12s", travel: "7%", lift: "-9%" },
    { x: "50%", y: "86%", width: "82%", height: "18%", opacity: 0.22, duration: "49s", delay: "-31s", travel: "-9%", lift: "7%" },
    { x: "50%", y: "97%", width: "120%", height: "22%", opacity: 0.28, duration: "61s", delay: "-22s", travel: "6%", lift: "-6%" },
  ],
} as const;

export const heroDepths: Readonly<Record<string, HeroDepth>> = {
  ...Object.fromEntries(heroLayers.map((layer) => [layer.id, layer.depth])),
  fog: heroFog.depth,
};

export function heroLayerStyle(layer: HeroLayer): string {
  const placement = (prefix: string, value: HeroPlacement) => [
    `--${prefix}-x:${value.x}`,
    `--${prefix}-y:${value.y}`,
    `--${prefix}-width:${value.width}`,
    `--${prefix}-scale:${value.scale ?? 1}`,
    `--${prefix}-anchor-y:${value.anchorY ?? "-50%"}`,
  ];

  return [
    `z-index:${layer.zIndex}`,
    `opacity:${layer.opacity}`,
    ...placement("desktop", layer.desktop),
    ...placement("mobile", layer.mobile),
  ].join(";");
}
