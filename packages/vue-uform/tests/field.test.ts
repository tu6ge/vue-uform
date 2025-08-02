import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin, SchemeArg } from "../src/main";
import { h } from "vue";

test("test field component class names", () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-field></u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain('class="u-field-wrap"');
  expect(wrapper.html()).toContain('class="u-field-input-wrap"');
  expect(wrapper.html()).toContain('class="u-label"');
  expect(wrapper.html()).toContain('class="u-field-help"');
});

test("test field component label", () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-field label="Username"></u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain('<label class="u-label">Username</label>');
});

test("test field component help", () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-field help="please input your name"></u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain(
    '<div class="u-field-help">please input your name</div>'
  );
});

test("test field component value", async () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-field value="init value" v-slot="{value,update}">
        <input :value="value" @input="update($event.target.value)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.find("input").element.value).toBe("init value");

  await wrapper.find("input").setValue("new value");

  expect(wrapper.html()).toContain(
    '<div class="u-field-help">value:new value</div>'
  );
});

test("test field component custom prop", async () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-field v-slot="{value,update}" custom>
        <div>custom scheme</div>
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toBe("<div>custom scheme</div>");
});

test("test field component custom and slot params", async () => {
  const wrapper = mount(
    {
      setup() {},
      template: `<u-field value="init value" v-slot="{value,update}" custom>
        <label>custom scheme</label>
        <input :value="value" @input="update($event.target.value)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain("<label>custom scheme</label>");

  expect(wrapper.find("input").element.value).toBe("init value");

  // TODO test update event
});

test("test field component custom scheme", async () => {
  const wrapper = mount(
    {
      setup() {
        const myScheme = (arg: SchemeArg) => {
          return h(
            "div",
            {
              style: { color: "green" },
            },
            [
              h("label", arg.label),
              arg.getSlots(),
              h("div", { class: "real-value" }, arg.valueRef.value),
            ]
          );
        };
        return {
          myScheme,
        };
      },
      template: `<u-field :scheme="myScheme" label="FooLabel" value="init value" v-slot="{value,update}" >
        <input :value="value" @input="update($event.target.value)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.html()).toContain(
    `<div style="color: green;"><label>FooLabel</label>`
  );

  expect(wrapper.find("input").element.value).toBe("init value");

  await wrapper.find("input").setValue("new value");

  expect(wrapper.find(".real-value").text()).toBe("new value");
});
