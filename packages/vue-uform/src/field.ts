import {
  h,
  Prop,
  ref,
  SetupContext,
  SlotsType,
  VNode,
  defineComponent,
  inject,
  Ref,
} from "vue";
import { SchemeArg } from "./field-scheme";
import { FormValues } from "./form";

export interface FieldProps {
  name: string;
  label: string;
  scheme?: (arg: SchemeArg) => VNode;
}

export const UField = defineComponent(
  (props, ctx) => {
    const formValues = inject<Ref<FormValues>>("u-form-values", ref({}));

    let thisValue = formValues.value[props.name];

    const formUpdate = inject("u-form-update") as (
      key: string,
      value: string
    ) => void;

    let schemeArg: SchemeArg = {
      name: props.name,
      label: props.label,
      value: props.value || "",
      valueRef: ref(thisValue || props.modelValue || props.value || ""),
      help: props.help,
      getSlots: () => {
        return ctx.slots.default
          ? ctx.slots.default({
              value: schemeArg.valueRef.value,
              update: (val: string) => {
                schemeArg.valueRef.value = val;
                ctx.emit("update:modelValue", val);
                formUpdate(props.name, val);
              },
            })
          : undefined;
      },
    };
    if (props.scheme) {
      return () => props.scheme(schemeArg);
    }

    const value = ref<string>(
      thisValue || props.modelValue || props.value || ""
    );
    const update = (val: string) => {
      //console.log();
      value.value = val;
      ctx.emit("update:modelValue", val);
      formUpdate(props.name, val);
    };

    if (props.custom) {
      return () =>
        ctx.slots.default
          ? ctx.slots.default({
              value: value.value,
              update,
            })
          : "";
    }

    return () =>
      h("div", { class: "u-field-wrap" }, [
        h("div", { class: "u-field-input-wrap" }, [
          h("label", { class: "u-label" }, props.label),
          ctx.slots.default
            ? ctx.slots.default({
                value: value.value,
                update,
              })
            : "",
        ]),
        h("div", { class: "u-field-help" }, props.help),
      ]);
  },
  {
    props: {
      name: String,
      label: String,
      help: String,
      value: String,
      modelValue: String,
      scheme: Function,
      custom: Boolean,
    },
    emits: ["update:modelValue"],
  }
);
