import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin, SchemeArg } from "../src/main";
import { h, ref } from "vue";
import { getDeep } from "../src/field";
import { setDeep } from "../src/form";

test("test form component values props with object nest", async () => {
  const wrapper = mount(
    {
      setup() {
        const formValues = {
          address: {
            country: "foo",
          },
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
      <u-field label="Username" name="address.country" v-slot="{value,update}" >
        <input :value="value" data-name="country" @input="update($event.target.value)" />
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
    (wrapper.find("input[data-name=country]").element as HTMLInputElement).value
  ).toBe("foo");

  expect(Object.values(wrapper.vm.result).length).toBe(0);

  wrapper.find("input[data-name=country]").setValue("newValue");

  await wrapper.find("button").trigger("click");

  expect(Object.values(wrapper.vm.result).length).toBe(1);

  expect(
    (wrapper.vm.result as { address: { country: string } }).address.country
  ).toBe("newValue");
});

test("test form component values props with array nest", async () => {
  const wrapper = mount(
    {
      setup() {
        const formValues = {
          address: ["foo", "foo2"],
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
      <u-field label="Username" name="address[1]" v-slot="{value,update}" >
        <input :value="value" data-name="country" @input="update($event.target.value)" />
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
    (wrapper.find("input[data-name=country]").element as HTMLInputElement).value
  ).toBe("foo2");

  expect(Object.values(wrapper.vm.result).length).toBe(0);

  wrapper.find("input[data-name=country]").setValue("newValue");

  await wrapper.find("button").trigger("click");

  expect(Object.values(wrapper.vm.result).length).toBe(1);

  expect((wrapper.vm.result as { address: string[] }).address[1]).toBe(
    "newValue"
  );
});

test("test form reset with nest values", async () => {
  const wrapper = mount(
    {
      setup() {
        const formValues = {
          address: { country: "foo" },
        };
        const result = ref({});
        function doSubmit(val: any) {
          result.value = val;
        }
        const formRef = ref();
        function reset1() {
          formRef.value.reset({ address: { country: "foo333" } });
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
      <u-field label="Username" name="address.country" validation="required" v-slot="{value,update}" >
        <input :value="value" data-name="country" @input="update($event.target.value)" />
      </u-field>
      <u-submit>Submit</u-submit>
      <button type="button" data-label="reset1" @click="reset1">Reset1</button>
      </u-form>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  await wrapper.find('button[data-label="reset1"]').trigger("click");
  expect(
    (wrapper.find("input[data-name=country]").element as HTMLInputElement).value
  ).toBe("foo333");
});

test("test getDeep", () => {
  const formValues = {
    address: {
      country: {
        label: "foo",
        value: "bar",
      },
    },
  };

  let obj = getDeep(formValues, "address.country");
  expect(obj).toStrictEqual({ label: "foo", value: "bar" });

  const formValues2 = {
    address: [
      {
        country: {
          label: "foo",
          value: "bar",
        },
      },
      {
        country: {
          label: "foo1",
          value: "bar1",
        },
      },
    ],
  };

  let obj2 = getDeep(formValues2, "address[1].country");
  expect(obj2).toStrictEqual({ label: "foo1", value: "bar1" });
});

test("test setDeep", () => {
  let formValues = {};
  setDeep(formValues, "username.nest", undefined, "Username");
  setDeep(formValues, "username.nest", "Foo");

  expect(formValues).toStrictEqual({
    username: {
      nest: {
        label: "Username",
        value: "Foo",
      },
    },
  });

  let formValues2 = {};
  setDeep(formValues2, "username[0].nest", undefined, "Username");
  setDeep(formValues2, "username[0].nest", "Foo");

  expect(formValues2).toStrictEqual({
    username: [
      {
        nest: {
          label: "Username",
          value: "Foo",
        },
      },
    ],
  });
});
