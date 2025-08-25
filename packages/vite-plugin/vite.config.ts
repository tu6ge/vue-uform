import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "VitePluginVueUform",
      // the proper extensions will be added
      fileName: "vite-plugin-vue-uform",
    },
    rollupOptions: {
      external: ["vite", "@vitejs/plugin-vue"],
      output: {
        globals: {
          vite: "Vite",
        },
      },
    },
  },
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
    },
  },
});
