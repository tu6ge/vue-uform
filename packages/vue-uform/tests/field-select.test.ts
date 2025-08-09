import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import { plugin } from "../src/main";
import { ref } from "vue";

test("test field select only one", async () => {
  const wrapper = mount(
    {
      setup() {
        const val = ref("B");
        return {
          val,
        };
      },
      template: `<u-field v-model="val" v-slot="{ value, update }">
        <select :value="value" @change="update($event.target.value)">
          <option disabled value="">Please select one</option>
          <option data-label="A">A</option>
          <option data-label="B">B</option>
          <option data-label="C">C</option>
        </select>
      </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(
    (wrapper.find('option[data-label="B"]').element as HTMLOptionElement)
      .selected
  ).toBe(true);

  await wrapper.find("select").setValue("C");

  expect(
    (wrapper.find('option[data-label="C"]').element as HTMLOptionElement)
      .selected
  ).toBe(true);
  expect(wrapper.vm.val).toBe("C");
});

test("test field select multi values", async () => {
  const wrapper = mount(
    {
      setup() {
        const val = ref(["A", "B"]);
        return {
          val,
        };
      },
      template: `<u-field v-model="val" v-slot="{ value, update }">
          <select
            @change="
              update(
                Array.from($event.target.selectedOptions).map(
                  (option) => option.value
                )
              )
            "
            multiple
          >
            <option disabled value="">Please select one</option>
            <option data-label="A" :selected="value.find((res) => res == 'A')">A</option>
            <option data-label="B" :selected="value.find((res) => res == 'B')">B</option>
            <option data-label="C" :selected="value.find((res) => res == 'C')">C</option>
          </select>
        </u-field>`,
    },
    {
      global: {
        plugins: [[plugin, {}]],
      },
    }
  );

  expect(
    (wrapper.find('option[data-label="A"]').element as HTMLOptionElement)
      .selected
  ).toBe(true);
  expect(
    (wrapper.find('option[data-label="B"]').element as HTMLOptionElement)
      .selected
  ).toBe(true);

  await wrapper.find("select").setValue(["B", "C"]);

  expect(
    (wrapper.find('option[data-label="A"]').element as HTMLOptionElement)
      .selected
  ).toBe(false);
  expect(
    (wrapper.find('option[data-label="B"]').element as HTMLOptionElement)
      .selected
  ).toBe(true);
  expect(
    (wrapper.find('option[data-label="C"]').element as HTMLOptionElement)
      .selected
  ).toBe(true);

  expect(wrapper.vm.val).toEqual(["B", "C"]);
});
