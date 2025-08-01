import { h } from "vue";
import type { Prop, SetupContext } from "vue";

export const Hello = (
  prop: Prop<{ abc: string }>,
  ctx: Omit<SetupContext, "expose">
) => {
  console.log(prop, ctx);
  return h("div", "Hello Form");
};
