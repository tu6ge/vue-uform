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

  test("radio checkbox not value", () => {
    const original = compile(
      `<input type="checkbox" :checked='value' @change='$event => (update($event.target.checked))' />`
    );
    const sugar = compile(`<input type="checkbox" f-model />`);
    expect(sugar.code).toBe(original.code);
  });

  test("checkbox has value", () => {
    const original = compile(
      `<input type="checkbox" value="foo1" 
      :checked='value.find((res) => res == "foo1") != undefined' 
      @change='$event => (update("foo1","array"))' 
      />`
    );
    const sugar = compile(`<input type="checkbox" value="foo1" f-model />`);
    expect(sugar.code).toBe(original.code);
  });

  test("select only one value", () => {
    const original = compile(
      `<select :value="value" @change="update($event.target.value)">
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>`
    );
    const sugar = compile(`<select f-model>
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>`);
    expect(sugar.code).toBe(original.code);
  });

  test("select multiple value", () => {
    const original = compile(
      `<select
      multiple
          @change="update(
      Array.from($event.target.selectedOptions).map(
        (option) => option.value
      )
    )"
        >
          <option disabled value="" :selected="value.find((res) => res == '')">Please select one</option>
          <option :selected="value.find((res) => res == 'A')">A</option>
          <option :selected="value.find((res) => res == 'B')">B</option>
          <option :selected="value.find((res) => res == 'C')">C</option>
        </select>`
    );
    const sugar = compile(`<select f-model multiple>
        <option disabled value="">Please select one</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>`);
    expect(sugar.code).toBe(original.code);
  });
});
