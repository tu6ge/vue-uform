import { SlotsType, VNode } from "vue";

export interface SchemeArg {
  label: string;
  help: string | undefined;
  slots: SlotsType<Record<string, any>>;
}

export const createScheme = (fn: (arg: SchemeArg) => VNode) => {
  return fn;
};
