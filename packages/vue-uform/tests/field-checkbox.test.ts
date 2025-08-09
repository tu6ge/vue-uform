import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin } from "../src/main";
import { ref } from "vue";

test("test field checkbox only one", async () => {
  const wrapper = mount(
    {
      setup() {
        const val = ref(true);
        return {
          val,
        };
      },
      template: `<u-field v-model="val" v-slot="{value,update}" >
        <input type="checkbox" :checked="value" @change="update($event.target.checked)" />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(
    (wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked
  ).toBe(true);

  await wrapper.find('input[type="checkbox"]').setValue(false);

  expect(
    (wrapper.find('input[type="checkbox"]').element as HTMLInputElement).checked
  ).toBe(false);

  expect(wrapper.vm.val).toBe(false);

  await wrapper.find('input[type="checkbox"]').setValue(true);

  expect(wrapper.vm.val).toBe(true);
});

test("test field checkbox multi values", async () => {
  const wrapper = mount(
    {
      setup() {
        const val = ref(["foo1"]);
        return {
          val,
        };
      },
      template: `<u-field v-model="val" v-slot="{value,update}" >
        <input
          type="checkbox"
          data-label="foo1"
          :checked="value.find((res) => res == 'foo1') != undefined"
          value="foo1"
          @change="update('foo1', 'array')"
        />
        <input
          type="checkbox"
          data-label="foo2"
          :checked="value.find((res) => res == 'foo2') != undefined"
          value="foo2"
          @change="update('foo2', 'array')"
        />
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(
    (wrapper.find('input[data-label="foo1"]').element as HTMLInputElement)
      .checked
  ).toBe(true);

  expect(
    (wrapper.find('input[data-label="foo2"]').element as HTMLInputElement)
      .checked
  ).toBe(false);

  await wrapper.find('input[data-label="foo2"]').setValue(true);

  expect(wrapper.vm.val).toStrictEqual(["foo1", "foo2"]);

  await wrapper.find('input[data-label="foo2"]').setValue(false);

  expect(wrapper.vm.val).toStrictEqual(["foo1"]);

  await wrapper.find('input[data-label="foo1"]').setValue(false);

  expect(wrapper.vm.val).toStrictEqual([]);

  await wrapper.find('input[data-label="foo2"]').setValue(true);
  await wrapper.find('input[data-label="foo1"]').setValue(true);
  expect(wrapper.vm.val).toStrictEqual(["foo2", "foo1"]);
});
