import { h } from "vue";
import type { App, Prop, SetupContext, SlotsType } from "vue";
import { UField } from "./field";
import { createScheme, SchemeArg } from "./field-scheme";

export { createScheme };
export type { SchemeArg };

export const UForm = (
  prop: Prop<{ abc: string }>,
  ctx: Omit<SetupContext<{}, SlotsType<Record<string, any>>>, "expose">
) => {
  console.log(prop, ctx);
  return h("div", [h("div", "Hello Form"), ctx.slots.default()]);
};

export const plugin = {
  install(app: App, option: any) {
    app.component("u-form", UForm);
    app.component("u-field", UField);
  },
};
