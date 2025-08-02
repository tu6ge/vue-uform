import {
  h,
  Prop,
  ref,
  SetupContext,
  SlotsType,
  VNode,
  defineComponent,
} from "vue";
import { SchemeArg } from "./field-scheme";

export interface FieldProps {
  name: string;
  label: string;
  scheme?: (arg: SchemeArg) => VNode;
}

export const UField = defineComponent(
  (props, ctx) => {
    //console.log("props", props);
    let schemeArg: SchemeArg = {
      label: props.label,
      value: props.value || "",
      valueRef: ref(props.value || ""),
      help: props.help,
      getSlots: () => {
        return ctx.slots.default
          ? ctx.slots.default({
              value: schemeArg.valueRef.value,
              update: (val: string) => {
                schemeArg.valueRef.value = val;
              },
            })
          : undefined;
      },
    };
    if (props.scheme) {
      return () => props.scheme(schemeArg);
    }

    const value = ref<string>("www");
    const update = (val: string) => {
      //console.log();
      value.value = val;
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
      label: String,
      help: String,
      value: String,
      scheme: Function,
      custom: Boolean,
    },
  }
);
