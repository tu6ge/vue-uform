import { defineComponent, h, provide, ref, unref } from "vue";

export type FormValues = {
  [key: string]: any;
};

export const UForm = defineComponent(
  (props, ctx) => {
    const thisValues = ref<FormValues>(props.values || {});
    provide("u-form-values", thisValues);
    provide("u-form-update", (key: string, value: string) => {
      thisValues.value[key] = value;
    });
    provide("u-form-submit", () => {
      ctx.emit("submit", unref(thisValues.value));
    });
    return () =>
      h("form", { class: "u-form" }, [
        ctx.slots.default ? ctx.slots.default() : "",
      ]);
  },
  {
    props: {
      values: Object,
    },
    emits: ["submit"],
  }
);
