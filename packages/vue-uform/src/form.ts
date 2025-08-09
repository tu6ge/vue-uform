import { defineComponent, h, nextTick, provide, Ref, ref, unref } from "vue";

export type FormValues = {
  [key: string]: {
    label: string;
    value: unknown;
  };
};
export type FormValidatorResult = {
  [key: string]: boolean;
};

export const FormValueProvideKey = Symbol("u-form-values");
export const FormUpdateLabelProvideKey = Symbol("u-form-update-label");
export const FormUpdateValueProvideKey = Symbol("u-form-update-value");
export const FormUpdateValidatorProvideKey = Symbol("u-form-update-validator");
export const FormSubmitProvideKey = Symbol("u-form-submit");
export const FormSubmitUseidProvideKey = Symbol("u-form-submit-useid");

export const UForm = defineComponent(
  (props, ctx) => {
    const thisValues = initFormValues(props.values);
    provide(FormValueProvideKey, thisValues);
    provide(FormUpdateLabelProvideKey, (key: string, label: string) => {
      if (key in thisValues.value) {
        thisValues.value[key].label = label;
      } else {
        thisValues.value[key] = {
          label,
          value: "",
        };
      }
    });
    provide(FormUpdateValueProvideKey, (key: string, value: unknown) => {
      thisValues.value[key].value = value;
      if (key in thisValues.value) {
        thisValues.value[key].value = value;
      } else {
        thisValues.value[key] = {
          label: "",
          value,
        };
      }
    });
    const thisValidatorResult = ref<FormValidatorResult>({});
    provide(FormUpdateValidatorProvideKey, (key: string, value: boolean) => {
      thisValidatorResult.value[key] = value;
    });
    const doSubmitUseid = ref<Symbol>();
    provide(FormSubmitUseidProvideKey, doSubmitUseid);
    provide(FormSubmitProvideKey, async () => {
      doSubmitUseid.value = Symbol("random");
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
      ctx.emit("submit", getSubmitValues(unref(thisValues.value)));
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

function getSubmitValues(form: FormValues): { [key: string]: unknown } {
  let res: { [key: string]: unknown } = {};
  for (let item in form) {
    res[item] = form[item].value;
  }
  return res;
}

export function initFormValues(values: {
  [key: string]: unknown;
}): Ref<FormValues> {
  const thisValues: Ref<FormValues> = ref({});
  for (let key in values) {
    if (key in thisValues.value) {
      thisValues.value[key].value = values[key];
    } else {
      thisValues.value[key] = {
        label: "",
        value: values[key],
      };
    }
  }
  return thisValues;
}
