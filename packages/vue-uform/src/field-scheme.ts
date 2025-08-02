import { Ref, VNode } from "vue";

export interface SchemeArg {
  label: string;
  value?: string;
  valueRef: Ref<string>;
  help: string | undefined;
  // slots: Slots;
  //update(a: string): void;
  getSlots(): VNode[] | undefined;
}
