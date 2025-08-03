import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin, SchemeArg } from "../src/main";
import { h, Ref, ref } from "vue";
import { FormValues } from "../src/form";
import { createFieldNode, FieldNode } from "../src/field";

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
});

test("test field component v-model", async () => {
  const wrapper = mount(
    {
      setup() {
        const username = ref("init value");
        return {
          username,
        };
      },
      template: `<u-field v-model="username" v-slot="{value,update}">
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

  expect(wrapper.vm.username).toBe("new value");
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
      setup() {
        const username = ref("Join");
        return {
          username,
        };
      },
      template: `<u-field v-model="username" v-slot="{value,update}" custom>
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

  expect(wrapper.find("input").element.value).toBe("Join");

  await wrapper.find("input").setValue("Foo");

  expect(wrapper.vm.username).toBe("Foo");
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

test("test field component custom scheme v-model", async () => {
  const wrapper = mount(
    {
      setup() {
        const myScheme = (arg: SchemeArg) => {
          return h(
            "div",
            {
              style: { color: "green" },
            },
            [h("label", arg.label), arg.getSlots()]
          );
        };
        const email = ref("xxx@yyy.com");
        return {
          myScheme,
          email,
        };
      },
      template: `<u-field :scheme="myScheme" label="FooLabel" v-model="email" v-slot="{value,update}" >
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

  expect(wrapper.find("input").element.value).toBe("xxx@yyy.com");

  await wrapper.find("input").setValue("aaa@bbb.com");

  expect(wrapper.vm.email).toBe("aaa@bbb.com");
});

test("test createFieldNode function", () => {
  let formValues: Ref<FormValues> = ref({
    username: "Join",
    password: "101010",
  });
  let field = createFieldNode(
    { name: "username", value: ref("Foo") },
    formValues
  );
  expect(field.at("password").name).toBe("password");
  expect(field.at("password").value.value).toBe("101010");
});
