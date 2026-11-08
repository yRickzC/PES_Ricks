import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { BlogPost } from "./explore";
import { withBasePath } from "../../../utils/base-path";

// Build-time only. Serialize the same responsive variants for SSR and subsequent client pages.
const images = import.meta.glob<ImageMetadata>("/public/**/*.{avif,gif,jpeg,jpg,png,svg,webp,AVIF,GIF,JPEG,JPG,PNG,SVG,WEBP}", { import: "default" });

export async function prepareBlogCovers(posts: BlogPost[], basePath: string, maxWidth = 1440): Promise<BlogPost[]> {
  return Promise.all(posts.map(async (post) => {
    const load = images[`/public${post.cover.src}`];
    if (!load) {
      if (post.cover.src.startsWith("/")) throw new Error(`Capa do Blog ausente: ${post.cover.src}`);
      // External HTTPS covers remain external; no build-time network request or invented dimensions.
      return post;
    }
    const source = await load();
    const width = Math.min(maxWidth, source.width);
    const image = await getImage({ src: source, width, widths: [...new Set([360, 640, 960, width].filter((size) => size <= width))], format: "webp" });
    return { ...post, cover: { ...post.cover,
      src: withBasePath(image.src, basePath), srcset: image.srcSet.attribute,
      width: Number(image.attributes.width), height: Number(image.attributes.height),
    } };
  }));
}
