import { FieldNode } from "./field";

export interface ValidationList {
  [name: string]: {
    validator: (node: FieldNode, ...arg: string[]) => string | boolean;
  };
}

const validationList: ValidationList = {
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
      return !isNaN(value.value as number);
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
  accepted: {
    validator({ value }: FieldNode): string | boolean {
      return ["yes", "on", "1", 1, true, "true"].includes(
        value.value as string
      );
    },
  },
  alpha: {
    validator({ value }: FieldNode): string | boolean {
      return /^\p{L}+$/u.test(String(value.value));
    },
  },
  alphanumeric: {
    validator({ value }: FieldNode): string | boolean {
      return /^[0-9\p{L}]+$/u.test(String(value.value));
    },
  },
  between: {
    validator({ value }: FieldNode, from: any, to: any): boolean {
      if (!isNaN(value.value as number) && !isNaN(from) && !isNaN(to)) {
        const val = 1 * (value.value as number);
        from = Number(from);
        to = Number(to);
        const [a, b] = from <= to ? [from, to] : [to, from];
        return val >= 1 * a && val <= 1 * b;
      }
      return false;
    },
  },
  email: {
    validator({ value }: FieldNode): boolean {
      const isEmail =
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return isEmail.test(String(value.value));
    },
  },
  ends_with: {
    validator({ value }: FieldNode, ...stack: string[]): boolean {
      if (typeof value.value === "string" && stack.length) {
        return stack.some((item) => {
          return (value.value as string).endsWith(item);
        });
      } else if (typeof value === "string" && stack.length === 0) {
        return true;
      }
      return false;
    },
  },
  is: {
    validator({ value }: FieldNode, ...stack: any[]): boolean {
      return stack.some((item) => {
        return item == value;
      });
    },
  },
  length: {
    validator({ value }: FieldNode, first = "0", second = "Infinity"): boolean {
      const start = parseInt(first);
      const end = second == "Infinity" ? Infinity : parseInt(second);
      const min: number = start <= end ? start : end;
      const max: number = end >= start ? end : start;
      if (typeof value.value === "string") {
        return (
          (value.value as string).length >= min &&
          (value.value as string).length <= max
        );
      } else if (Array.isArray(value.value)) {
        return value.value.length >= min && value.value.length <= max;
      } else if (value.value && typeof value.value === "object") {
        const length = Object.keys(value.value).length;
        return length >= min && length <= max;
      }
      return false;
    },
  },
  lowercase: {
    validator({ value }: FieldNode): boolean {
      return /^\p{Ll}+$/u.test(String(value.value));
    },
  },
  max: {
    validator({ value }: FieldNode, maximum) {
      if (Array.isArray(value.value)) {
        return value.value.length <= Number(maximum);
      }
      return Number(value) <= Number(maximum);
    },
  },
  min: {
    validator({ value }: FieldNode, minimum) {
      if (Array.isArray(value.value)) {
        return value.value.length >= Number(minimum);
      }
      return Number(value) >= Number(minimum);
    },
  },
  not: {
    validator({ value }: FieldNode, ...stack): boolean {
      return stack.every((item) => {
        return item !== value.value;
      });
    },
  },
  starts_with: {
    validator({ value }: FieldNode, ...stack: string[]): boolean {
      if (typeof value.value === "string" && stack.length) {
        return stack.some((item) => {
          return (value.value as string).startsWith(item);
        });
      } else if (typeof value === "string" && stack.length === 0) {
        return true;
      }
      return false;
    },
  },
  uppercase: {
    validator({ value }: FieldNode): boolean {
      return /^\p{Lu}+$/u.test(String(value.value));
    },
  },
  url: {
    validator({ value }: FieldNode, ...stack): boolean {
      try {
        const protocols = stack.length ? stack : ["http:", "https:"];
        const url = new URL(String(value.value));
        return protocols.includes(url.protocol);
      } catch {
        return false;
      }
    },
  },
};

export function getValidations(extend: {
  [key: string]: (node: FieldNode, ...arg: string[]) => boolean | string;
}): ValidationList {
  let list = validationList;
  for (const item in extend) {
    list[item] = {
      validator: extend[item],
    };
  }
  return list;
}
