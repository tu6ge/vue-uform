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

type FormValueNode = {
  label: string;
  value: unknown;
};

export type FormValues = {
  [key: string]: FormValueNode | FormValues | FormValueNode[] | FormValues[];
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
export const FormResetButton = Symbol("form-reset-button");

export const UForm = defineComponent(
  (props, ctx) => {
    const thisValues = initFormValues(props.values);
    provide(FormValueProvideKey, thisValues);
    provide(FormUpdateLabelProvideKey, (key: string, label: string) => {
      formUpdateLabel(thisValues, key, label);
    });
    provide(FormUpdateValueProvideKey, (key: string, value: unknown) => {
      formUpdateValue(thisValues, key, value);
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
      // Re-initialize the form values recursively.
      const newValues: any = buildResetValues(thisValues.value, data);
      thisValues.value = newValues;
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

// Recursively re-init form values, supporting nested structure.
// If data provided, use data; else reset to empty string.
function buildResetValues(template: any, dataObj: any): any {
  if (Array.isArray(template)) {
    // If template is array, process each element recursively.
    return template.map((item, idx) =>
      buildResetValues(item, Array.isArray(dataObj) ? dataObj[idx] : undefined)
    );
  } else if (
    template !== null &&
    typeof template === "object" &&
    !(
      "value" in template &&
      "label" in template &&
      Object.keys(template).length <= 2
    )
  ) {
    // Nested object (not FormValueNode)
    const obj: any = {};
    for (const k in template) {
      obj[k] = buildResetValues(
        template[k],
        dataObj && typeof dataObj === "object" ? dataObj[k] : undefined
      );
    }
    return obj;
  } else {
    // Leaf node: FormValueNode
    let value: unknown = "";
    if (dataObj !== undefined) {
      value = dataObj;
    }
    return {
      label:
        template && typeof template === "object" && "label" in template
          ? template.label
          : "",
      value,
    };
  }
}

// setDeep: safely set a nested property via path like 'foo.bar[0].baz'
function setDeep(obj: any, path: string, value: any, setLabel?: string) {
  if (!path) return;
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Last part: set value/label
    if (i === parts.length - 1) {
      if (setLabel !== undefined) {
        if (!current[part]) current[part] = { label: setLabel, value: "" };
        current[part].label = setLabel;
      } else {
        if (!current[part]) current[part] = { label: "", value: value };
        current[part].value = value;
      }
      return;
    }
    // Not last part: ensure intermediate object/array
    if (!(part in current)) {
      // Next part is number? Make array, else object
      const nextPart = parts[i + 1];
      if (/^\d+$/.test(nextPart)) {
        current[part] = [];
      } else {
        current[part] = {};
      }
    }
    current = current[part];
  }
}

function getSubmitValues(form: FormValues): { [key: string]: unknown } {
  // Recursively unwrap FormValues to plain object/array
  function unwrap(val: any): any {
    if (Array.isArray(val)) {
      return val.map(unwrap);
    }
    if (val && typeof val === "object") {
      // If has 'value' and maybe 'label', treat as leaf node
      if ("value" in val && "label" in val && Object.keys(val).length <= 2) {
        return val.value;
      }
      // Otherwise, it's nested FormValues object
      const result: { [key: string]: unknown } = {};
      for (const k in val) {
        result[k] = unwrap(val[k]);
      }
      return result;
    }
    return val;
  }
  return unwrap(form);
}

export function initFormValues(values: {
  [key: string]: unknown;
}): Ref<FormValues> {
  function process(val: unknown): any {
    if (Array.isArray(val)) {
      // Array: process each element recursively
      return val.map((item) => process(item));
    } else if (val !== null && typeof val === "object") {
      // Object: process each property recursively
      const obj: any = {};
      for (const k in val as Record<string, unknown>) {
        obj[k] = process((val as Record<string, unknown>)[k]);
      }
      return obj;
    } else {
      // Primitive value: wrap as { label: "", value: val }
      return {
        label: "",
        value: val,
      };
    }
  }
  const thisValues: Ref<FormValues> = ref({});
  for (let key in values) {
    thisValues.value[key] = process(values[key]);
  }
  return thisValues;
}

function formUpdateLabel(values: Ref<FormValues>, key: string, label: string) {
  setDeep(values.value, key, undefined, label);
}

function formUpdateValue(values: Ref<FormValues>, key: string, value: unknown) {
  setDeep(values.value, key, value);
}
