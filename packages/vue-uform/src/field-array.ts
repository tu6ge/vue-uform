import { SchemeArg } from "./main";
import { defineComponent, h, PropType, VNode } from "vue";

export const UFieldArray = defineComponent(
  (props, ctx) => {
    return () => {
      return h("div", {}, [
        ctx.slots.default
          ? ctx.slots.default({
              fields: [],
              insert: (idx: number, item: unknown) => {
                //TODO
              },
              remove: (idx: number) => {
                //TODO
              },
              push: (item: unknown) => {
                //TODO
              },
            })
          : "",
      ]);
    };
  },
  {
    props: {
      name: String,
      scheme: Function as PropType<(arg: SchemeArg) => VNode>,
    },
  }
);
