import { parse, compileTemplate } from "@vue/compiler-sfc";
import {
  parse as parseDOM,
  transform,
  generate,
  NodeTypes,
  ElementNode,
  AttributeNode,
  transformElement, // 处理元素节点
} from "@vue/compiler-dom";
import { expect, test } from "vitest";

// test("first", () => {
//   const { descriptor } = parse("<template><h1>hello</h1></template>");
//   let templateAst = parseDOM(descriptor.template.content);
//   //console.log(templateAst);
//   transform(templateAst, {
//     nodeTransforms: [
//       transformElement,
//       (node) => {
//         if (node.type === NodeTypes.TEXT) {
//           node.content = "world";
//         }
//       },
//     ],
//   });
//   const { code: transformedTemplate } = compileTemplate({
//     source: templateAst,
//     filename: "a.vue",
//     transformAssetUrls: false,
//   });
//   console.log(transformedTemplate);
// });
