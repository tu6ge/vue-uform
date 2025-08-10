import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin, SchemeArg } from "../src/main";
import { h, ref } from "vue";

test("test form component values props", async () => {
  const wrapper = mount(
    {
      setup() {
        const formValues = {
          username: "Join",
          password: "101010",
          email: "xxx@yyy.com",
        };
        const result = ref({});
        function doSubmit(val: any) {
          result.value = val;
        }
        return {
          formValues,
          doSubmit,
          result,
        };
      },
      template: `<u-form :values="formValues" @submit="doSubmit">
      <u-field label="Username" name="username" v-slot="{value,update}" >
        <input :value="value" data-name="username" @input="update($event.target.value)" />
      </u-field>
      <u-field label="Password" name="password" v-slot="{value,update}" >
        <input :value="value" data-name="password" @input="update($event.target.value)" />
      </u-field>
      <u-field label="Email" name="email" v-slot="{value,update}" >
        <input :value="value" data-name="email" @input="update($event.target.value)" />
      </u-field>
      <u-submit>Submit</u-submit>
      </u-form>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(
    (wrapper.find("input[data-name=username]").element as HTMLInputElement)
      .value
  ).toBe("Join");

  expect(
    (wrapper.find("input[data-name=password]").element as HTMLInputElement)
      .value
  ).toBe("101010");
  expect(
    (wrapper.find("input[data-name=email]").element as HTMLInputElement).value
  ).toBe("xxx@yyy.com");

  expect(Object.values(wrapper.vm.result).length).toBe(0);

  await wrapper.find("button").trigger("click");

  expect(Object.values(wrapper.vm.result).length).toBe(3);

  expect((wrapper.vm.result as { username: string }).username).toBe("Join");
});

test("test form component validation error", async () => {
  const wrapper = mount(
    {
      setup() {
        const formValues = {
          username: "",
          password: "101010",
          email: "xxx@yyy.com",
        };
        const result = ref({});
        function doSubmit(val: any) {
          result.value = val;
        }
        return {
          formValues,
          doSubmit,
          result,
        };
      },
      template: `<u-form :values="formValues" @submit="doSubmit">
      <u-field label="Username" name="username" validation="required" v-slot="{value,update}" >
        <input :value="value" data-name="username" @input="update($event.target.value)" />
      </u-field>
      <u-field label="Password" name="password" v-slot="{value,update}" >
        <input :value="value" data-name="password" @input="update($event.target.value)" />
      </u-field>
      <u-field label="Email" name="email" v-slot="{value,update}" >
        <input :value="value" data-name="email" @input="update($event.target.value)" />
      </u-field>
      <u-submit>Submit</u-submit>
      </u-form>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(Object.values(wrapper.vm.result).length).toBe(0);

  await wrapper.find("button").trigger("click");

  expect(Object.values(wrapper.vm.result).length).toBe(0);
});

test("test form component custom scheme", async () => {
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
              arg.slot(),
              h("div", { class: "real-value" }, arg.valueRef.value as string),
            ]
          );
        };
        return {
          myScheme,
        };
      },
      template: `
      <u-form :scheme="myScheme">
        <u-field label="FooLabel" value="init value" v-slot="{value,update}" >
          <input :value="value" @input="update($event.target.value)" />
        </u-field>
        <u-field label="FooLabel2" value="init value2" v-slot="{value,update}" >
          <input :value="value" @input="update($event.target.value)" />
        </u-field>
      </u-form>`,
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
  expect(wrapper.html()).toContain(
    `<div style="color: green;"><label>FooLabel2</label>`
  );
});

test("test form reset with empty values", async () => {
  const wrapper = mount(
    {
      setup() {
        const formValues = {
          username: "",
          password: "101010",
          email: "xxx@yyy.com",
        };
        const result = ref({});
        function doSubmit(val: any) {
          result.value = val;
        }
        const formRef = ref();
        function reset1() {
          formRef.value.reset({ username: "foo" });
        }
        return {
          formValues,
          doSubmit,
          result,
          formRef,
          reset1,
        };
      },
      template: `<u-form :values="formValues" ref="formRef" @submit="doSubmit">
      <u-field label="Username" name="username" validation="required" v-slot="{value,update}" >
        <input :value="value" data-name="username" @input="update($event.target.value)" />
      </u-field>
      <u-field label="Password" name="password" v-slot="{value,update}" >
        <input :value="value" data-name="password" @input="update($event.target.value)" />
      </u-field>
      <u-field label="Email" name="email" v-slot="{value,update}" >
        <input :value="value" data-name="email" @input="update($event.target.value)" />
      </u-field>
      <u-submit>Submit</u-submit>
      <button type="button" data-label="reset1" @click="reset1">Reset1</button>
      <u-reset>Reset2</u-reset>
      </u-form>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(
    (wrapper.find("input[data-name=password]").element as HTMLInputElement)
      .value
  ).toBe("101010");
  expect(
    (wrapper.find("input[data-name=email]").element as HTMLInputElement).value
  ).toBe("xxx@yyy.com");

  await wrapper.find(".u-submit").trigger("click");

  expect(wrapper.html()).toContain("<li>Username is required</li>");

  await wrapper.find('button[data-label="reset1"]').trigger("click");
  expect(
    (wrapper.find("input[data-name=username]").element as HTMLInputElement)
      .value
  ).toBe("foo");
  expect(
    (wrapper.find("input[data-name=password]").element as HTMLInputElement)
      .value
  ).toBe("");
  expect(
    (wrapper.find("input[data-name=email]").element as HTMLInputElement).value
  ).toBe("");

  await wrapper.find(".u-reset").trigger("click");
  expect(
    (wrapper.find("input[data-name=username]").element as HTMLInputElement)
      .value
  ).toBe("");
  expect(
    (wrapper.find("input[data-name=password]").element as HTMLInputElement)
      .value
  ).toBe("");
  expect(
    (wrapper.find("input[data-name=email]").element as HTMLInputElement).value
  ).toBe("");
});
