import { h, ref, VNode, defineComponent, inject, Ref, watch } from "vue";
import { SchemeArg } from "./field-scheme";
import { FormValues } from "./form";
import { validatior } from "./validation";

export interface FieldProps {
  name: string;
  label: string;
  scheme?: (arg: SchemeArg) => VNode;
}

export type FieldNode = {
  name: string;
  value: Ref<string>;
  at: (path: string) => FieldNode;
};

export const UField = defineComponent(
  (props, ctx) => {
    const formValues = inject<Ref<FormValues>>("u-form-values", ref({}));

    let thisValue = formValues.value[props.name];

    const formUpdate = inject("u-form-update", undefined as unknown) as (
      key: string,
      value: string
    ) => void;
    const formUpdateValidator = inject(
      "u-form-update-validator",
      undefined as unknown
    ) as (key: string, value: boolean) => void;

    const isSubmitUseid = inject("u-form-do-submit-useid", ref("0"));

    const validationMessages = ref<string[]>([]);

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
                formUpdate && formUpdate(props.name, val);
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
    const fieldNode = createFieldNode({ name: props.name, value }, formValues);
    const doValidator = () => {
      let validator_result = validatior(
        fieldNode,
        props.validation,
        props.validationMessages
      );
      if (validator_result !== true) {
        validationMessages.value = validator_result as string[];
        formUpdateValidator && formUpdateValidator(props.name, false);
      } else {
        validationMessages.value = [];
        formUpdateValidator && formUpdateValidator(props.name, true);
      }
    };
    watch(isSubmitUseid, () => {
      doValidator();
    });
    const update = (val: string) => {
      value.value = val;
      ctx.emit("update:modelValue", val);
      formUpdate && formUpdate(props.name, val);

      doValidator();
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
      modelValue: String,
      scheme: Function,
      custom: Boolean,
      validation: {
        type: String,
        default: "",
      },
      validationMessages: Object,
    },
    emits: ["update:modelValue"],
  }
);

export function createFieldNode(
  node: Omit<FieldNode, "at">,
  values: FormValues
): FieldNode {
  return {
    ...node,
    at(path: string): FieldNode {
      // TODO Multidimensional form fields were not considered
      let value = ref(values.value[path]);
      return createFieldNode({ name: path, value }, values);
    },
  };
}
