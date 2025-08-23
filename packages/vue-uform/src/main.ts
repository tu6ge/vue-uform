import type { App } from "vue";
import { FieldNode, UField } from "./field";
import { SchemeArg } from "./field-scheme";
import { UForm } from "./form";
import { UReset } from "./reset";
import { USubmit } from "./submit";
import { UFieldArray } from "./field-array";

export type { SchemeArg, FieldNode };

export { UForm as Form, UField as Field, UReset as Reset, USubmit as Submit };

export const plugin = {
  install(app: App, option: any = {}) {
    app.component("u-form", UForm);
    app.component("u-field", UField);
    app.component("u-field-array", UFieldArray);
    app.component("u-submit", USubmit);
    app.component("u-reset", UReset);
  },
};
