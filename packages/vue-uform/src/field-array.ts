import { getThisValueFromForm } from "./field";
import {
  FormArrayPush,
  FormArrayRemove,
  FormSchemeKey,
  FormUpdateValueProvideKey,
  FormValueProvideKey,
  FormValues,
} from "./form";
import { SchemeArg } from "./main";
import {
  defineComponent,
  h,
  inject,
  nextTick,
  PropType,
  provide,
  ref,
  Ref,
  VNode,
} from "vue";

export const FieldArrayUseid = Symbol("array-useid");

export const UFieldArray = defineComponent(
  (props, ctx) => {
    if (props.scheme) {
      provide(FormSchemeKey, props.scheme);
    }

    const formValues = inject<Ref<FormValues>>(FormValueProvideKey, ref({}));
    const formUpdate = inject(
      FormUpdateValueProvideKey,
      undefined as unknown
    ) as (key: string, value: unknown) => void;

    let thisValue = getArrayFromForm(formValues, props.name);

    const useid = ref<Symbol>();
    provide(FieldArrayUseid, useid);

    const formArrayRemove = inject(FormArrayRemove, undefined as unknown) as (
      key: string,
      index: number
    ) => void;

    const formArrayPush = inject(FormArrayPush, undefined as unknown) as (
      key: string,
      item: unknown
    ) => void;

    return () => {
      return h("div", {}, [
        ctx.slots.default
          ? ctx.slots.default({
              fields: thisValue,
              insert: (idx: number, item: unknown) => {
                //TODO
              },
              remove: (idx: number) => {
                formArrayRemove && formArrayRemove(props.name, idx);
                useid.value = Symbol();
              },
              push: (item: unknown) => {
                const newItem = buildFormItem(item);
                formArrayPush && formArrayPush(props.name, newItem);
                useid.value = Symbol();
              },
            })
          : "",
      ]);
    };
  },
  {
    props: {
      name: String,
      scheme: Function as PropType<(arg: SchemeArg) => VNode>,
    },
  }
);

// small tool: translate foo.bar[0].baz => ["foo","bar","0","baz"]
function pathToSegments(path: string): string[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
}

type FormValueNode = { label: string; value: unknown };
function isFormValueNode(x: any): x is FormValueNode {
  return x && typeof x === "object" && "label" in x && "value" in x;
}

/** 把模板转换为表单节点结构：
 * - 原始值 -> { label: "", value: 原始值 }
 * - 已是 {label,value} -> 原样（缺省字段补齐）
 * - 对象/数组 -> 递归
 */
function buildFormItem(template: any): any {
  if (isFormValueNode(template)) {
    return { label: template.label ?? "", value: template.value };
  }
  if (Array.isArray(template)) {
    return template.map((it) => buildFormItem(it));
  }
  if (template && typeof template === "object") {
    const obj: any = {};
    for (const k in template) {
      obj[k] = buildFormItem(template[k]);
    }
    return obj;
  }
  // origin（string/number/boolean/null/undefined）
  return { label: "", value: template };
}

/** 获取路径处的数组；不存在或不是数组则返回 []（只读拿数据用） */
function getArrayFromForm(values: Ref<FormValues>, path: string): any[] {
  const segs = pathToSegments(path);
  let cur: any = values.value;
  for (const seg of segs) {
    if (cur == null) return [];
    if (Array.isArray(cur)) {
      const idx = Number(seg);
      cur = Number.isInteger(idx) ? cur[idx] : undefined;
    } else if (typeof cur === "object" && seg in cur) {
      cur = cur[seg];
    } else {
      return [];
    }
  }
  return Array.isArray(cur) ? cur : [];
}
