import { defineComponent, h, inject } from "vue";

export const USubmit = defineComponent(
  (props, ctx) => {
    const submit = inject("u-form-submit") as () => void;

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
