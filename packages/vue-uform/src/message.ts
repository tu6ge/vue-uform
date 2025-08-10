import { FieldNode } from "./field";

export type MessageArg = {
  node: FieldNode;
  label: string;
  args: string[];
};
export type Messages = { [name: string]: (arg: MessageArg) => string };

const createMessageArg = (node: FieldNode, args: string[]): MessageArg => {
  return {
    node,
    label: node.label,
    args,
  };
};

export const messages: Messages = {
  required: ({ label }) => {
    return `${label} is required`;
  },

  number: ({ label }) => {
    return `${label} must be a number`;
  },
  confirm: ({ label }) => {
    return `${label} is not match`;
  },
  accept: ({ label }) => {
    return `Please accept the ${label}.`;
  },
  alpha: ({ label }) => {
    return `${label} can only contain alphabetical characters.`;
  },
  alphanumeric: ({ label }) => {
    return `${label} can only contain letters and numbers.`;
  },
  between: ({ label, args }) => {
    return `${label} must be between ${args[0]} and ${args[1]}.`;
  },
  email: ({ label }) => {
    return `${label} must be a email url`;
  },
  ends_with: ({ label, args }) => {
    return `${label} doesn’t end with ${args.join(",")}.`;
  },
  is: ({ label }) => {
    return `${label} is not an allowed value.`;
  },
  length: ({ label }) => {
    return `${label}'s length is not match.`;
  },
  lowercase: ({ label }) => {
    return `${label} can only contain lowercase letters.`;
  },
  max: ({ label, args }) => {
    return `${label} must be less than ${args[0]}`;
  },
  min: ({ label, args }) => {
    return `${label} must be greater than ${args[0]}`;
  },
  not: ({ label, node }) => {
    return `“${node.value.value}” is not an allowed ${label}.`;
  },
  starts_with: ({ label, args }) => {
    return `${label} doesn’t start with ${args.join(",")}.`;
  },
  uppercase: ({ label }) => {
    return `${label} can only contain uppercase letters.`;
  },
  url: () => {
    return `Please enter a valid URL.`;
  },
};

export function getMessage(
  validator: string,
  node: FieldNode,
  ...arg: string[]
): string {
  if (!(validator in messages)) {
    return "";
  }
  const callback = messages[validator];
  return callback(createMessageArg(node, arg));
}
