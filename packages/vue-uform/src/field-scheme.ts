import { Ref, VNode } from "vue";

export interface SchemeArg {
  name: string;
  label: string;
  value?: unknown;
  valueRef: Ref<unknown>;
  hasError: Ref<Boolean>;
  help: string | undefined;
  messages: Ref<string[]>;
  validation_names: string[];
  slot(): VNode[] | undefined;
}
