export interface ResponsiveImageVariant {
  src: string;
  width: number;
}

export interface ImageVariantPaths {
  desktop: string;
  mobile: ResponsiveImageVariant[];
}

const mobileWidths = [480, 768, 1200, 1600] as const;

/** Maps a public image path to the FFmpeg-generated lossless/optimized files. */
export function getImageVariantPaths(src: string, sourceWidth: number): ImageVariantPaths | undefined {
  const match = /^\/images\/([^/]+)\.(?:avif|gif|jpe?g|png|webp)$/iu.exec(src);
  if (!match) return undefined;

  const filename = match[1]!;
  const stem = filename.replace(/\.[^.]+$/u, "");
  const hasSourceWidth = Number.isFinite(sourceWidth) && sourceWidth >= 1;
  const widths: number[] = hasSourceWidth
    ? mobileWidths.filter((width) => width <= sourceWidth)
    : [...mobileWidths];
  if (widths.length === 0 && hasSourceWidth) widths.push(Math.round(sourceWidth));

  return {
    desktop: `/images/desktop/${stem}.webp`,
    mobile: widths.map((width) => ({
      src: `/images/mobile/responsive/${stem}-${width}.webp`,
      width,
    })),
  };
}

export function imageVariantSrcSet(variants: readonly ResponsiveImageVariant[], basePath: string): string {
  const base = basePath.replace(/\/+$/u, "");
  return variants.map(({ src, width }) => `${base}${src} ${width}w`).join(", ");
}
