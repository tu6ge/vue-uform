export interface ValidationList {
  [name: string]: {
    message: string;
    validator: (...arg: string[]) => string | boolean;
  };
}

export const validationList: ValidationList = {
  required: {
    message: "this field is required",
    validator(value: string): string | boolean {
      if (value) {
        return true;
      }
      return this.message;
    },
  },
  number: {
    message: "this field must be a number",
    validator(value: string): string | boolean {
      if (/^[0-9\.eE]+$/.test(value)) {
        return true;
      }
      return this.message;
    },
  },
};
