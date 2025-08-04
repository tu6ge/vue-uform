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
    { name: "username", value: ref("Foo"), label: "Username" },
    formValues
  );
  expect(field.at("password").name).toBe("password");
  expect(field.at("password").value.value).toBe("101010");
});

test("test field component validation message", async () => {
  const wrapper = mount(
    {
      setup() {
        const uid = ref("123");
        return {
          uid,
        };
      },
      template: `<u-field label="FooLabel" v-model="uid" validation="required|number" v-slot="{value,update}" >
        <input :value="value" @input="update($event.target.value)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.find("input").element.value).toBe("123");

  await wrapper.find("input").setValue("abc");

  expect(wrapper.html()).contain("<li>FooLabel must be a number</li>");

  await wrapper.find("input").setValue("111");

  expect(wrapper.html()).contain(`<ul class="u-validation-message"></ul>`);
});

test("test field component validation custom message", async () => {
  const wrapper = mount(
    {
      setup() {
        const uid = ref("123");
        return {
          uid,
        };
      },
      template: `<u-field label="FooLabel" v-model="uid" validation="required|number" :validation-messages="{
        number:'the FooLabel should be a number'
      }" v-slot="{value,update}" >
        <input :value="value" @input="update($event.target.value)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(wrapper.find("input").element.value).toBe("123");

  await wrapper.find("input").setValue("abc");

  expect(wrapper.html()).contain("<li>the FooLabel should be a number</li>");
});

test("test field component custom validation", async () => {
  const wrapper = mount(
    {
      setup() {
        function isfruit(node: FieldNode): boolean | string {
          const { value } = node;
          if (value.value != "apple" && value.value != "banan") {
            return "this value is not apple or banan";
          }
          return true;
        }
        return {
          isfruit,
        };
      },
      template: `<u-field label="FooLabel" validation="required|isfruit" 
      :rules="{ isfruit }" v-slot="{value,update}" >
        <input :value="value" @input="update($event.target.value)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  await wrapper.find("input").setValue("abc");

  expect(wrapper.html()).contain("<li>this value is not apple or banan</li>");

  await wrapper.find("input").setValue("apple");

  expect(wrapper.html()).contain(`<ul class="u-validation-message"></ul>`);
});
