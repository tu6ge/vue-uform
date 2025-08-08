import { compileTemplate } from "@vue/compiler-sfc";
import { transformFmodel } from "../src/core/index";
import { describe, expect, test } from "vitest";

function compile(code: string) {
  return compileTemplate({
    source: code,
    filename: "anonymous.vue",
    id: "xxx",
    compilerOptions: {
      nodeTransforms: [transformFmodel({})],
    },
  });
}

describe("name", () => {
  test("default name", () => {
    const original = compile(
      `<input :value="value" @input="$event => update($event.target.value)" />`
    );
    const sugar = compile(`<input f-model />`);
    expect(sugar.code).toBe(original.code);
    //expect((sugar.ast as any).children[0].props[0]).matchSnapshot();
  });
});
