import { FieldNode } from "./field";
import { getMessage } from "./message";
import { validationList } from "./validation-buildin";

export interface Validation {
  name: string;
  params: string[];
}

export function parseValidations(s: string): Validation[] {
  let list: Validation[] = [];

  if (s === "") {
    return [];
  }

  const origin_list = s.split("|");
  origin_list.forEach((val) => {
    const item_list = val.split(":");
    let item: Validation = {
      name: item_list[0],
      params: [],
    };
    if (item_list.length > 1) {
      item.params = item_list[1].split(",");
    }
    list.push(item);
  });

  return list;
}

export function validatior(
  node: FieldNode,
  validations_str: string,
  custom_messages: { [key: string]: string }
): boolean | string[] {
  const validations = parseValidations(validations_str);
  let messages: string[] = [];
  validations.map((valid) => {
    let res = validationList[valid.name].validator(node, ...valid.params);
    if (res !== true) {
      let msg = getMessage(valid.name, node);
      if (custom_messages && valid.name in custom_messages) {
        msg = custom_messages[valid.name] as string;
      }
      messages.push(msg);
    }
  });
  if (messages.length === 0) {
    return true;
  } else {
    return messages;
  }
}
