import {
  AttributeNode,
  createSimpleExpression,
  DirectiveNode,
  ElementNode,
  NodeTransform,
  NodeTypes,
  processExpression,
  TransformContext,
  ElementTypes,
} from "@vue/compiler-dom";

export function transformFmodel(options: {}): NodeTransform {
  return (node, context) => {
    if (node.type !== NodeTypes.ELEMENT) return;
    const propIndex = node.props.findIndex((prop) =>
      prop.name.startsWith("f-model")
    );
    if (propIndex == -1) return;
    const prop = node.props[propIndex];
    node.props.splice(propIndex, 1);

    if (node.tag == "input") {
      modifyInputNode(node, prop, context);
    } else if (node.tagType == ElementTypes.COMPONENT) {
      modifyComponentNode(node, prop, context);
    }
  };
}

function modifyInputNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const simpleExpression = createSimpleExpression("value", false, prop.loc, 0);
  const exp = processExpression(simpleExpression, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "bind",
    exp,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "value",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });

  const simpleExpression2 = createSimpleExpression(
    "$event => (update($event.target.value))",
    false,
    prop.loc,
    0
  );
  const exp2 = processExpression(simpleExpression2, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "on",
    exp: exp2,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "input",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });
}

function modifyComponentNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const { name } = prop;
  let arg_content = "modelValue";
  let event_arg_content = "update:modelValue";
  if (name.indexOf(":") > -1) {
    const [, val] = name.split(":");
    arg_content = val;
    event_arg_content = "update:" + val;
  }

  const simpleExpression = createSimpleExpression("value", false, prop.loc, 0);
  const exp = processExpression(simpleExpression, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "bind",
    exp,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: arg_content,
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });

  const simpleExpression2 = createSimpleExpression(
    "$event => (update($event))",
    false,
    prop.loc,
    0
  );
  const exp2 = processExpression(simpleExpression2, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "on",
    exp: exp2,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: event_arg_content,
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });
}
