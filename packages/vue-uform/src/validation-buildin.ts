import { FieldNode } from "./field";

export interface ValidationList {
  [name: string]: {
    validator: (node: FieldNode, ...arg: string[]) => string | boolean;
  };
}

export const validationList: ValidationList = {
  required: {
    validator({ value }: FieldNode): string | boolean {
      if (value.value) {
        return true;
      }
      return false;
    },
  },
  number: {
    validator({ value }: FieldNode): string | boolean {
      if (/^[0-9\.eE]+$/.test(value.value)) {
        return true;
      }
      return false;
    },
  },
  confirm: {
    validator(node: FieldNode, other_path: string): string | boolean {
      const thisValue = node.value;
      const otherValue = node.at(other_path).value;
      if (thisValue.value === otherValue.value) {
        return true;
      }
      return false;
    },
  },
};
