import { describe, expect, it } from "vitest";
import { createBlogPosts } from "../../blogs/data/explore-catalog";
import { entry } from "../../../../backend/content/test-fixtures";
import { selectHomePosts } from "./posts";

describe("composição editorial da Home", () => {
  it("separa capas e notas sem repetir posts, preservando a ordem de publicação", () => {
    const posts = createBlogPosts([
      entry({ id: "texto", date: "2026-11-07" }),
      entry({ id: "capa-1", date: "2026-11-06" }),
      entry({ id: "capa-2", date: "2026-11-05" }),
      entry({ id: "capa-3", date: "2026-11-04" }),
      entry({ id: "outra-nota", date: "2026-11-03" }),
    ], "en").map((post) => post.id === "article:texto" ? { ...post, cover: { src: "", alt: "" } } : post);
    const result = selectHomePosts(posts);
    expect(result.highlights.map(({ id }) => id)).toEqual(posts.slice(1, 4).map(({ id }) => id));
    expect(result.notes.map(({ id }) => id)).toEqual([posts[0].id, posts[4].id]);
    expect(new Set([...result.highlights, ...result.notes].map(({ id }) => id)).size).toBe(5);
    expect(posts).toHaveLength(5);
  });

  it("limita a três capas e oito notas e não inventa conteúdo quando vazio", () => {
    const posts = createBlogPosts(Array.from({ length: 15 }, (_, index) => entry({ id: `post-${index}` })), "en");
    const result = selectHomePosts(posts);
    expect(result.highlights).toHaveLength(3);
    expect(result.notes).toHaveLength(8);
    expect(selectHomePosts([])).toEqual({ highlights: [], notes: [] });
  });
});
