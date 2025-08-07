// vite-plugin-f-model-ast.ts

import type { Plugin } from "vite";
import { getVuePluginApi, VuePluginApi } from "./utils";
import { transformFmodel } from "./core";

export default function fModelPlugin(options: {}): Plugin {
  let api: VuePluginApi | null | undefined;

  return {
    name: "vite-plugin-vue-uform",
    configResolved(config) {
      try {
        api = getVuePluginApi(config.plugins);
      } catch {}
    },
    buildStart(rollupOpts) {
      if (api === undefined)
        try {
          api = getVuePluginApi(rollupOpts.plugins);
        } catch (error: any) {
          this.warn(error);
          return;
        }

      if (!api) return;

      api.options.template ||= {};
      api.options.template.compilerOptions ||= {};
      api.options.template.compilerOptions.nodeTransforms ||= [];

      api.options.template.compilerOptions.nodeTransforms.push(
        transformFmodel(options)
      );
    },
  };
}
