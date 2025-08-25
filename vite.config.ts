import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["packages/**/*.{test,spec}.?(c|m)[jt]s?(x)"],

    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["packages/**/*.ts"],
    },
  },
});
