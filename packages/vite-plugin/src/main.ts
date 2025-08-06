import type { Plugin } from "vite";
import { parse } from "@vue/compiler-sfc";

export default function fModelPlugin(): Plugin {
  return {
    name: "vite-plugin-f-model",
    enforce: "pre",

    transform(code, id) {
      if (!id.endsWith(".vue")) return;

      const { descriptor } = parse(code);
      if (!descriptor.template) return;

      let template = descriptor.template.content;

      // 正则匹配 f-model:prop@event="handler"
      template = template.replace(
        /f-model:([a-zA-Z0-9_]+)@([a-zA-Z0-9_]+)="([^"]+)"/g,
        (_match, prop, event, handler) => {
          return `:${prop}="${handler}" @${event}:${prop}="${event}"`;
        }
      );

      // 替换模板内容
      const transformed = code.replace(descriptor.template.content, template);

      return {
        code: transformed,
        map: null,
      };
    },
  };
}
