import { defineComponent, h, inject } from "vue";
import { FormResetButton } from "./form";

export const UReset = defineComponent(
  (props, ctx) => {
    const reset = inject(FormResetButton) as (data: {
      [name: string]: unknown;
    }) => void;

    if (props.custom) {
      return () =>
        ctx.slots.default
          ? ctx.slots.default({
              reset,
            })
          : "";
    }

    return () =>
      h(
        "button",
        {
          type: "button",
          class: "u-reset",
          onClick: () => {
            reset({});
          },
        },
        ctx.slots.default ? ctx.slots.default() : "Reset"
      );
  },
  {
    props: {
      custom: Boolean,
    },
    emits: ["reset"],
  }
);
