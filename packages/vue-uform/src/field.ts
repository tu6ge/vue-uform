import { h, Prop, ref, SetupContext, SlotsType, unref, VNode } from "vue";
import { SchemeArg } from "./field-scheme";

export interface FieldProps {
  name: string;
  label: string;
  scheme?: (arg: SchemeArg) => VNode;
}

export const UField = (
  prop: Prop<FieldProps>,
  ctx: Omit<SetupContext<{}, SlotsType<Record<string, any>>>, "expose">
) => {
  let schemeArg: SchemeArg = {
    label: prop.label,
    help: prop.help,
    slots: ctx.slots,
  };
  if (prop.scheme) {
    return prop.scheme(schemeArg);
  }

  const value = ref<string>("www");
  const update = (event: InputEvent) => {
    console.log(event.target.value);
    //value.value = event.target.value;
    value.value = "123";
  };

  return h("div", [
    h("div", "Hello Form Field"),
    ctx.slots.default
      ? ctx.slots.default({
          value: value.value,
          update,
        })
      : "",
    h("div", value.value),
  ]);
};
