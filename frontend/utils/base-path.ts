export function withBasePath(path: string, basePath: string): string {
  const base = basePath.replace(/\/+$/u, "");
  if (!base || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === base || path.startsWith(base + "/")) return path;
  return path === "/" ? base + "/" : base + path;
}