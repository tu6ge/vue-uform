import { FieldNode } from "./field";

export interface ValidationList {
  [name: string]: {
    message: string;
    validator: (node: FieldNode, ...arg: string[]) => string | boolean;
  };
}

export const validationList: ValidationList = {
  required: {
    message: "this field is required",
    validator({ value }: FieldNode): string | boolean {
      if (value.value) {
        return true;
      }
      return this.message;
    },
  },
  number: {
    message: "this field must be a number",
    validator({ value }: FieldNode): string | boolean {
      if (/^[0-9\.eE]+$/.test(value.value)) {
        return true;
      }
      return this.message;
    },
  },
  confirm: {
    message: "confirm password is diffence of password",
    validator(node: FieldNode, other_path: string): string | boolean {
      const thisValue = node.value;
      const otherValue = node.at(other_path).value;
      if (thisValue.value === otherValue.value) {
        return true;
      }
      return this.message;
    },
  },
};
