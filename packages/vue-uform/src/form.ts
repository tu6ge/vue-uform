import { defineComponent, h, nextTick, provide, ref, unref, useId } from "vue";

export type FormValues = {
  [key: string]: unknown;
};
export type FormValidatorResult = {
  [key: string]: boolean;
};

export const UForm = defineComponent(
  (props, ctx) => {
    const thisValues = ref<FormValues>(props.values || {});
    provide("u-form-values", thisValues);
    provide("u-form-update", (key: string, value: string) => {
      thisValues.value[key] = value;
    });
    const thisValidatorResult = ref<FormValidatorResult>({});
    provide("u-form-update-validator", (key: string, value: boolean) => {
      thisValidatorResult.value[key] = value;
    });
    const doSubmitUseid = ref("");
    provide("u-form-do-submit-useid", doSubmitUseid);
    provide("u-form-submit", async () => {
      doSubmitUseid.value = new Date().toUTCString();
      await nextTick();
      let hasValidatorError = false;
      for (const item in thisValidatorResult.value) {
        if (thisValidatorResult.value[item] === false) {
          hasValidatorError = true;
          break;
        }
      }
      if (hasValidatorError == true) {
        //console.warn("[u-form] this form has validator error");
        return;
      }
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
