// vite-plugin-f-model-ast.ts
import { parse, compileTemplate } from "@vue/compiler-sfc";
import {
  parse as parseDOM,
  transform,
  generate,
  NodeTypes,
  ElementNode,
  AttributeNode,
} from "@vue/compiler-dom";
import type { Plugin } from "vite";

export default function fModelAstPlugin(): Plugin {
  return {
    name: "vite-plugin-f-model-ast",
    enforce: "pre",

    transform(code, id) {
      if (!id.endsWith(".vue")) return;

      const { descriptor } = parse(code);
      if (!descriptor.template) return;

      const templateAst = parseDOM(descriptor.template.content);

      // 遍历模板 AST 节点
      transform(templateAst, {
        nodeTransforms: [
          (node) => {
            if (node.type === NodeTypes.ELEMENT) {
              const el = node as ElementNode;
              const attrsToAdd: any[] = [];
              const attrsToRemove: AttributeNode[] = [];

              for (const attr of el.props) {
                // 找到形如 f-model:prop@event="binding" 的属性
                if (
                  attr.type === NodeTypes.ATTRIBUTE &&
                  attr.name.startsWith("f-model:")
                ) {
                  const match = attr.name.match(/^f-model:([^@]+)@(.+)$/);
                  if (match && attr.value) {
                    const [, prop, event] = match;
                    const binding = attr.value.content;

                    // 添加 :prop="binding"
                    attrsToAdd.push({
                      type: NodeTypes.DIRECTIVE,
                      name: "bind",
                      exp: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: binding,
                        isStatic: false,
                      },
                      arg: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: prop,
                        isStatic: true,
                      },
                      modifiers: [],
                      loc: attr.loc,
                    });

                    // 添加 @event:prop="update"
                    attrsToAdd.push({
                      type: NodeTypes.DIRECTIVE,
                      name: "on",
                      exp: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: "update",
                        isStatic: false,
                      },
                      arg: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: `${event}:${prop}`,
                        isStatic: true,
                      },
                      modifiers: [],
                      loc: attr.loc,
                    });

                    attrsToRemove.push(attr);
                  }
                }
              }

              // 移除原始 f-model 属性
              el.props = el.props.filter(
                (p) => !attrsToRemove.includes(p as AttributeNode)
              );
              // 添加新的指令属性
              el.props.push(...attrsToAdd);
            }
          },
        ],
      });

      // 生成修改后的模板字符串
      const generated = generate(templateAst);

      // 拼接 script + 新模板
      const finalCode = code.replace(
        descriptor.template.content,
        generated.code
      );

      return {
        code: finalCode,
        map: null,
      };
    },
  };
}
