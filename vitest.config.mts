import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@content$/, replacement: r("./content/index.ts") },
      { find: /^@content\/(.*)$/, replacement: r("./content/$1") },
      { find: /^@\/(.*)$/, replacement: r("./src/$1") },
    ],
  },
  test: {
    include: ["src/**/*.test.ts", "content/**/*.test.ts"],
    environment: "node",
  },
});
