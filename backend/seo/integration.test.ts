import { describe, expect, it } from "vitest";
import { renderLlms, siteOrigin } from "./integration";

describe("public discovery URLs", () => {
  it("uses the Pages origin and accepts a custom HTTPS origin", () => {
    expect(siteOrigin(undefined, "yRickzC")).toBe("https://yrickzc.github.io");
    expect(siteOrigin(" https://example.com/ ", "owner")).toBe("https://example.com");
  });
  it.each(["http://example.com", "https://example.com/path", "https://user:pass@example.com", "https://example.com/?q=1"])("rejects an invalid public origin: %s", (value) => {
    expect(() => siteOrigin(value, "owner")).toThrow("PUBLIC_SITE_URL");
  });
  it.each(["/", "/PES_Ricks"])("preserves localized, detail and fragment URLs with base %s", (base) => {
    const source = "[Quote](https://yrickzc.github.io/PES_Ricks/pt-br/services/#quote)\n[Article](https://yrickzc.github.io/PES_Ricks/blogs/example/)";
    const root = `https://example.com${base === "/" ? "" : base}`;
    expect(renderLlms(source, "https://example.com", base)).toBe(`[Quote](${root}/pt-br/services/#quote)\n[Article](${root}/blogs/example/)`);
  });
});
