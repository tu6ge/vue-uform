import type { App } from "vue";
import { FieldNode, UField } from "./field";
import { SchemeArg } from "./field-scheme";
import { UForm } from "./form";
import { USubmit } from "./submit";

export type { SchemeArg, FieldNode };

export const plugin = {
  install(app: App, option: any) {
    app.component("u-form", UForm);
    app.component("u-field", UField);
    app.component("u-submit", USubmit);
  },
};
