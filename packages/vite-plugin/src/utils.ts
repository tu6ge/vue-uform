import type { ResolvedOptions } from "@vitejs/plugin-vue";
import type { Plugin } from "vite";

export interface VuePluginApi {
  options: ResolvedOptions;
  version: string;
}

const VUE_PLUGINS = ["vite:vue", "unplugin-vue"];

export function getVuePluginApi(
  plugins: Readonly<Plugin[]> | undefined
): VuePluginApi | null {
  const vuePlugin = (plugins || []).find((p) => VUE_PLUGINS.includes(p.name));
  if (!vuePlugin)
    throw new Error(
      "Cannot find Vue plugin (@vitejs/plugin-vue or unplugin-vue). Please make sure to add it before using vue uform."
    );

  const api = vuePlugin.api as VuePluginApi;
  if (!api?.version) {
    throw new Error(
      "The Vue plugin is not supported (@vitejs/plugin-vue or unplugin-vue). Please make sure version > 4.3.4."
    );
  }

  return api;
}
