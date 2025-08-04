import { FieldNode } from "./field";

export type MessageArg = {
  node: FieldNode;
  label: string;
  arg: string[];
};
export type Messages = { [name: string]: (arg: MessageArg) => string };

const createMessageArg = (node: FieldNode, arg: string[]): MessageArg => {
  return {
    node,
    label: node.label,
    arg,
  };
};

export const messages: Messages = {
  required: ({ label }) => {
    return `${label} is required`;
  },
  max: ({ label, arg }) => {
    return `${label} must be less than ${arg[0]}`;
  },
  number: ({ label }) => {
    return `${label} must be a number`;
  },
  confirm: ({ label }) => {
    return `${label} is not match`;
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
