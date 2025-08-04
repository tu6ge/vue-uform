import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin } from "../src/main";
import { ref } from "vue";

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
