import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "frontend/**/*.test.ts",
      "frontend/**/*.spec.ts",
      "backend/**/*.test.ts",
      "backend/**/*.spec.ts",
    ],
    coverage: {
      provider: "v8",
      include: ["frontend/**/*.ts", "backend/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"],
      reporter: ["text", "lcov"],
    },
  },
});
