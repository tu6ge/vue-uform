import { defineComponent, h, inject } from "vue";
import { FormSubmitProvideKey } from "./form";

export const USubmit = defineComponent(
  (props, ctx) => {
    const submit = inject(FormSubmitProvideKey) as () => void;

    if (props.custom) {
      return () =>
        ctx.slots.default
          ? ctx.slots.default({
              submit,
            })
          : "";
    }

    return () =>
      h(
        "button",
        {
          type: "button",
          class: "u-submit",
          onClick: () => {
            submit();
          },
        },
        ctx.slots.default ? ctx.slots.default() : "Submit"
      );
  },
  {
    props: {
      custom: Boolean,
    },
    emits: ["submit"],
  }
);
