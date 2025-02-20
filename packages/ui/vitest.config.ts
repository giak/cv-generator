import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
/// <reference types="vitest" />
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      all: true,
      include: ["src/**/*.{ts,vue}"],
      exclude: ["**/*.d.ts", "**/*.test.ts", "**/*.spec.ts", "e2e/**/*"],
    },
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["e2e/**/*", "node_modules/**/*"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
