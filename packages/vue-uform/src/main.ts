import { defineComponent, h } from "vue";
import type { App } from "vue";
import { UField } from "./field";
import { createScheme, SchemeArg } from "./field-scheme";

export { createScheme };
export type { SchemeArg };

export const UForm = defineComponent((props, ctx) => {
  return () =>
    h("form", { class: "u-form" }, [
      ctx.slots.default ? ctx.slots.default() : "",
    ]);
});

export const plugin = {
  install(app: App, option: any) {
    app.component("u-form", UForm);
    app.component("u-field", UField);
  },
};
