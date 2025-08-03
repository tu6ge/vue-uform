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
};
