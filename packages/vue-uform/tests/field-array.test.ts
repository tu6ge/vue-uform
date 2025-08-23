import { FormValues } from "src/form";
import { buildFormItem, getArrayFromForm } from "../src/field-array";
import { expect, test } from "vitest";
import { Ref, ref } from "vue";

test("test buildFormItem", () => {
  let res = buildFormItem("foo");
  expect(res).toStrictEqual({ label: "", value: "foo" });

  res = buildFormItem({ address: { city: "qingdao" } });

  expect(res).toStrictEqual({
    address: {
      city: {
        label: "",
        value: "qingdao",
      },
    },
  });

  res = buildFormItem({ address: [{ city: "qingdao" }, { city: "jinan" }] });

  expect(res).toStrictEqual({
    address: [
      {
        city: {
          label: "",
          value: "qingdao",
        },
      },
      {
        city: {
          label: "",
          value: "jinan",
        },
      },
    ],
  });
});

test("test getArrayFromForm", () => {
  let formValues: Ref<FormValues> = ref({
    address: [
      {
        city: {
          label: "foo",
          value: "value1",
        },
      },
      {
        city: {
          label: "foo2",
          value: "value2",
        },
      },
    ],
  });
  let res = getArrayFromForm(formValues, "address");
  expect(res).toStrictEqual([
    {
      city: {
        label: "foo",
        value: "value1",
      },
    },
    {
      city: {
        label: "foo2",
        value: "value2",
      },
    },
  ]);
});
