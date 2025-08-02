import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin } from "../src/main";

test("test form component no slot", () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-form></u-form>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain('<form class="u-form"></form>');
});

test("test form component has slot", () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-form>abc</u-form>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain('<form class="u-form">abc</form>');
});
