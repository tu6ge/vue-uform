import {
  h,
  ref,
  VNode,
  defineComponent,
  inject,
  Ref,
  watch,
  PropType,
} from "vue";
import { SchemeArg } from "./field-scheme";
import {
  FormValues,
  FormValueProvideKey,
  FormUpdateLabelProvideKey,
  FormUpdateValueProvideKey,
  FormUpdateValidatorProvideKey,
  FormSubmitUseidProvideKey,
  FormSchemeKey,
  FormResetUseid,
} from "./form";
import { parseValidations, validatior } from "./validation";

export interface FieldProps {
  name: string;
  label: string;
  scheme?: (arg: SchemeArg) => VNode;
}

export type FieldNode = {
  name: string;
  label: string;
  value: unknown;
  at: (path: string) => FieldNode;
};
type FieldUpdateType = "primitive" | "array";

export const UField = defineComponent(
  (props, ctx) => {
    const formValues = inject<Ref<FormValues>>(FormValueProvideKey, ref({}));

    let thisValue = getThisValueFromForm(formValues, props.name);

    const formUpdateLabel = inject(
      FormUpdateLabelProvideKey,
      undefined as unknown
    ) as (key: string, label: string) => void;

    const formUpdate = inject(
      FormUpdateValueProvideKey,
      undefined as unknown
    ) as (key: string, value: unknown) => void;
    const formUpdateValidator = inject(
      FormUpdateValidatorProvideKey,
      undefined as unknown
    ) as (key: string, value: boolean) => void;

    formUpdateLabel && formUpdateLabel(props.name, props.label || "");

    const isSubmitUseid = inject(FormSubmitUseidProvideKey, ref<Symbol>());

    const validationMessages = ref<string[]>([]);

    const value = ref<unknown>(
      thisValue || props.modelValue || props.value || undefined
    );
    const hasError = ref(false);

    const validations = parseValidations(props.validation);

    const doValidator = () => {
      const fieldNode = createFieldNode(
        { name: props.name, label: props.label || "", value: value.value },
        formValues
      );
      let validator_result = validatior(
        fieldNode,
        validations,
        props.validationMessages,
        props.rules
      );
      if (validator_result !== true) {
        hasError.value = true;
        validationMessages.value = validator_result as string[];
        formUpdateValidator && formUpdateValidator(props.name, false);
      } else {
        hasError.value = false;
        validationMessages.value = [];
        formUpdateValidator && formUpdateValidator(props.name, true);
      }
    };
    watch(isSubmitUseid, () => {
      doValidator();
    });

    const formResetUseid = inject(FormResetUseid, ref<Symbol>());
    watch(formResetUseid, () => {
      hasError.value = false;
      validationMessages.value = [];
      const val = getDeep(formValues.value, props.name);
      if (val.value) {
        value.value = val.value;
      } else {
        value.value = "";
      }
    });

    const update = (val: unknown, type: FieldUpdateType = "primitive") => {
      if (type == "primitive") {
        value.value = val;
      } else if (type == "array") {
        if (Array.isArray(value.value)) {
          const existIndex = value.value.findIndex((res) => res == val);
          if (existIndex > -1) {
            value.value.splice(existIndex, 1);
          } else {
            value.value.push(val);
          }
        } else {
          throw new Error(
            'update type is "array",the value except is an array type'
          );
        }
      }

      ctx.emit("update:modelValue", value.value);
      formUpdate && formUpdate(props.name, value.value);

      doValidator();
    };

    if (props.custom) {
      return () =>
        ctx.slots.default
          ? ctx.slots.default({
              value: value.value,
              update,
              hasError: hasError.value,
              messages: validationMessages.value,
            })
          : "";
    }

    const formScheme = inject(FormSchemeKey, undefined as unknown) as (
      arg: SchemeArg
    ) => VNode;

    if (props.scheme || formScheme) {
      const validation_names = validations.map((res) => res.name);
      let schemeArg: SchemeArg = {
        name: props.name,
        label: props.label,
        value: props.value || "",
        valueRef: value,
        help: props.help,
        hasError,
        messages: validationMessages,
        validation_names,
        slot: () => {
          return ctx.slots.default
            ? ctx.slots.default({
                value: value.value,
                update: (val: unknown, type: FieldUpdateType = "primitive") => {
                  if (type == "primitive") {
                    value.value = val;
                  } else if (type == "array") {
                    if (Array.isArray(value.value)) {
                      const existIndex = value.value.findIndex(
                        (res: unknown) => res == val
                      );
                      if (existIndex > -1) {
                        value.value.splice(existIndex, 1);
                      } else {
                        value.value.push(val);
                      }
                    } else {
                      throw new Error(
                        'update type is "array",the value except is an array type'
                      );
                    }
                  }

                  ctx.emit("update:modelValue", value.value);
                  formUpdate && formUpdate(props.name, value.value);
                  doValidator();
                },
              })
            : undefined;
        },
      };

      if (props.scheme) {
        return () => props.scheme(schemeArg);
      } else if (formScheme) {
        return () => formScheme(schemeArg);
      }
    }

    return () =>
      h("div", { class: "u-field-wrap" }, [
        h("div", { class: "u-field-input-wrap" }, [
          h("label", { class: "u-label" }, props.label),
          ctx.slots.default
            ? ctx.slots.default({
                value: value.value,
                update,
                hasError: hasError.value,
                messages: validationMessages.value,
              })
            : "",
        ]),
        h("div", { class: "u-field-help" }, props.help),
        h(
          "ul",
          { class: "u-validation-message" },
          validationMessages.value.map((res) => {
            return h("li", res);
          })
        ),
      ]);
  },
  {
    props: {
      name: String,
      label: String,
      help: String,
      value: String,
      modelValue: [String, Boolean, Array, Number],
      scheme: Function as PropType<(arg: SchemeArg) => VNode>,
      custom: Boolean,
      validation: {
        type: String,
        default: "",
      },
      validationMessages: Object,
      rules: Object,
    },
    emits: ["update:modelValue"],
  }
);

export function createFieldNode(
  node: Omit<FieldNode, "at">,
  values: Ref<FormValues>
): FieldNode {
  return {
    ...node,
    at(path: string): FieldNode {
      const child = getDeep(values.value, path);
      return createFieldNode(
        { name: path, label: child.label, value: child.value },
        values
      );
    },
  };
}

function getThisValueFromForm(values: Ref<FormValues>, name: string): unknown {
  if (!name) {
    return undefined;
  }
  // Convert foo.bar[0].baz to foo.bar.0.baz, then split('.')
  const path = name.replace(/\[(\w+)\]/g, ".$1").split(".");
  let current: any = values.value;
  for (let i = 0; i < path.length; i++) {
    if (current == null) return undefined;
    const key = path[i];
    if (typeof current === "object" && key in current) {
      current = current[key];
    } else if (Array.isArray(current) && !isNaN(Number(key))) {
      // array index
      current = current[Number(key)];
    } else {
      return undefined;
    }
  }
  // If current is an object with .value, return .value, else return current
  if (current && typeof current === "object" && "value" in current) {
    return current.value;
  }
  return current;
}

// getDeep: safely get a nested property via path like 'foo.bar[0].baz'
function getDeep(obj: any, path: string): any {
  if (!path) return obj;
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let current = obj;
  for (let part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}
