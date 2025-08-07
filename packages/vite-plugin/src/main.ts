// vite-plugin-f-model-ast.ts
import { parse, compileTemplate } from "@vue/compiler-sfc";
import {
  parse as parseDOM,
  transform,
  generate,
  NodeTypes,
  ElementNode,
  AttributeNode,
  transformElement,
  RootNode,
  NodeTransform,
  createSimpleExpression,
  processExpression,
} from "@vue/compiler-dom";
import type { Plugin } from "vite";
import type { ResolvedOptions } from "@vitejs/plugin-vue";

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

interface VuePluginApi {
  options: ResolvedOptions;
  version: string;
}

const VUE_PLUGINS = ["vite:vue", "unplugin-vue"];

function getVuePluginApi(
  plugins: Readonly<Plugin[]> | undefined
): VuePluginApi | null {
  const vuePlugin = (plugins || []).find((p) => VUE_PLUGINS.includes(p.name));
  if (!vuePlugin)
    throw new Error(
      "Cannot find Vue plugin (@vitejs/plugin-vue or unplugin-vue). Please make sure to add it before using Vue Macros."
    );

  const api = vuePlugin.api as VuePluginApi;
  if (!api?.version) {
    throw new Error(
      "The Vue plugin is not supported (@vitejs/plugin-vue or unplugin-vue). Please make sure version > 4.3.4."
    );
  }

  return api;
}

function transformFmodel(options: {}): NodeTransform {
  return (node, context) => {
    if (node.type !== NodeTypes.ELEMENT) return;
    for (const [i, prop] of node.props.entries()) {
      //console.log("prop.type", prop.type);
      if (prop.name.startsWith("f-model")) {
        node.props.splice(i, 1);
        const simpleExpression = createSimpleExpression(
          "value",
          false,
          prop.loc,
          0
        );
        const exp = processExpression(simpleExpression, context);
        node.props.push({
          type: NodeTypes.DIRECTIVE,
          name: "bind", // event is `on`
          exp,
          arg: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: "value",
            isStatic: true,
            loc: prop.loc,
            constType: 0,
          },
          modifiers: [],
          loc: prop.loc,
        });

        const simpleExpression2 = createSimpleExpression(
          "$event => (update($event.target.value))",
          false,
          prop.loc,
          0
        );
        const exp2 = processExpression(simpleExpression2, context);
        node.props.push({
          type: NodeTypes.DIRECTIVE,
          name: "on", // event is `on`
          exp: exp2,
          arg: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: "input",
            isStatic: true,
            loc: prop.loc,
            constType: 0,
          },
          modifiers: [],
          loc: prop.loc,
        });
      }
    }
  };
}
