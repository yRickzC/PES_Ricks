import type { BlogPost } from "../../blogs/data/explore";
import { HOME_IMAGE_POST_LIMIT, HOME_NOTE_LIMIT } from "../config/home-posts";

export function selectHomePosts(posts: readonly BlogPost[]) {
  const highlights = posts.filter(({ cover }) => !!cover.src).slice(0, HOME_IMAGE_POST_LIMIT);
  const highlighted = new Set(highlights.map(({ id }) => id));
  return { highlights, notes: posts.filter(({ id }) => !highlighted.has(id)).slice(0, HOME_NOTE_LIMIT) };
}
