import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";
import uForm from "@vue-uform/vite-plugin";

export default defineConfig({
  plugins: [vue(), uForm(), Inspect()],
});
