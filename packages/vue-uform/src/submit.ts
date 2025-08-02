import { defineComponent, h, inject } from "vue";

export const USubmit = defineComponent(
  (props, ctx) => {
    const submit = inject("u-form-submit") as () => void;
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
        //[ctx.slots.default ? ctx.slots.default() : ""]
        "Submit"
      );
  },
  {
    emits: ["submit"],
  }
);
