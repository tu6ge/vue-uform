import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "VueUform",
      // the proper extensions will be added
      fileName: "vue-uform",
    },
  },
});
