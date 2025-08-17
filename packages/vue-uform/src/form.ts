import {
  defineComponent,
  h,
  nextTick,
  PropType,
  provide,
  Ref,
  ref,
  unref,
  VNode,
} from "vue";
import { SchemeArg } from "./field-scheme";

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
export const FormSchemeKey = Symbol("form-scheme");
export const FormResetUseid = Symbol("form-reset-useid");
export const FormResetValue = Symbol("form-reset");
export const FormResetButton = Symbol("form-reset-button");

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

    if (props.scheme) {
      provide(FormSchemeKey, props.scheme);
    }

    const resetUseid = ref<Symbol>();
    provide(FormResetUseid, resetUseid);
    provide(FormResetButton, (data: { [name: string]: unknown } = {}) => {
      reset(data);
    });
    function reset(data: { [name: string]: unknown } = {}) {
      for (let key in thisValues.value) {
        let value: unknown = "";
        if (key in data) {
          value = data[key];
        }
        thisValues.value[key].value = value;
      }
      thisValidatorResult.value = {};
      resetUseid.value = Symbol("reset-useid");
    }
    ctx.expose({ reset });

    return () =>
      h("form", { class: "u-form" }, [
        ctx.slots.default ? ctx.slots.default() : "",
      ]);
  },
  {
    props: {
      values: Object,
      scheme: Function as PropType<(arg: SchemeArg) => VNode>,
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
