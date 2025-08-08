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

describe("field", () => {
  test("default input", () => {
    const original = compile(
      `<input :value="value" @input="$event => update($event.target.value)" />`
    );
    const sugar = compile(`<input f-model />`);
    expect(sugar.code).toBe(original.code);
    //expect((sugar.ast as any).children[0].props[0]).matchSnapshot();
  });

  test("component input", () => {
    const original = compile(
      `<n-input :modelValue="value" @update:modelValue="$event => update($event)" ></n-input>`
    );
    const sugar = compile(`<n-input f-model ></n-input>`);
    expect(sugar.code).toBe(original.code);
    //expect((sugar.ast as any).children[0].props[0]).matchSnapshot();
  });

  test("component input v-model:value", () => {
    const original = compile(
      `<n-input :value="value" @update:value="$event => update($event)" ></n-input>`
    );
    const sugar = compile(`<n-input f-model:value ></n-input>`);
    expect(sugar.code).toBe(original.code);
    //expect((sugar.ast as any).children[0].props[0]).matchSnapshot();
  });

  test("radio input", () => {
    const original = compile(
      `<input type="radio" value="foo" :checked='value == "foo"' @change='$event => (update("foo"))' />`
    );
    const sugar = compile(`<input type="radio" value="foo" f-model />`);
    expect(sugar.code).toBe(original.code);
  });

  test("radio input not value", () => {
    const original = compile(
      `<input type="radio" :checked='value == ""' @change='$event => (update(""))' />`
    );
    const sugar = compile(`<input type="radio" f-model />`);
    expect(sugar.code).toBe(original.code);
  });
});
