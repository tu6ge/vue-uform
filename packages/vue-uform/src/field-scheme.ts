import { Ref, VNode } from "vue";

export interface SchemeArg {
  name: string;
  label: string;
  value?: unknown;
  valueRef: Ref<unknown>;
  hasError: Ref<Boolean>;
  help: string | undefined;
  messages: Ref<string[]>;
  // slots: Slots;
  //update(a: string): void;
  getSlots(): VNode[] | undefined;
}
