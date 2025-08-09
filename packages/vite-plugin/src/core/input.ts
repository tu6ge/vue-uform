import {
  AttributeNode,
  createSimpleExpression,
  DirectiveNode,
  ElementNode,
  NodeTypes,
  processExpression,
  TransformContext,
} from "@vue/compiler-dom";

export function modifyInputNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const typeProp: AttributeNode | DirectiveNode | undefined = node.props.find(
    (res) => res.name == "type"
  );
  if (typeProp == undefined) {
    modifyInputTextNode(node, prop, context);
  } else {
    switch ((typeProp as AttributeNode).value?.content) {
      case "radio":
        modifyRadioNode(node, prop, context);
        break;
      case "checkbox":
        modifyCheckBoxNode(node, prop, context);
        break;
      default:
        // support tel/email/password.. input type
        modifyInputTextNode(node, prop, context);
    }
  }
}

function modifyCheckBoxNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const valueProp: AttributeNode | DirectiveNode | undefined = node.props.find(
    (res) => res.name == "value"
  );
  if (valueProp) {
    modifyCheckBoxMultiNode(node, prop, context, valueProp);
    return;
  }

  const simpleExpression = createSimpleExpression(`value`, false, prop.loc, 0);
  const exp = processExpression(simpleExpression, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "bind",
    exp,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "checked",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });

  const exp2 = createSimpleExpression(
    `update($event.target.checked)`,
    false,
    prop.loc,
    0
  );
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "on",
    exp: exp2,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "change",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });
}

function modifyCheckBoxMultiNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext,
  valueProp: AttributeNode | DirectiveNode
) {
  const value = (valueProp as AttributeNode).value?.content || "";
  const simpleExpression = createSimpleExpression(
    `value.find((res) => res == "${value}") != undefined`,
    false,
    prop.loc,
    0
  );
  const exp = processExpression(simpleExpression, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "bind",
    exp,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "checked",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });

  const exp2 = createSimpleExpression(
    `update("${value}","array")`,
    false,
    prop.loc,
    0
  );
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "on",
    exp: exp2,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "change",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });
}

function modifyRadioNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const valueProp: AttributeNode | DirectiveNode | undefined = node.props.find(
    (res) => res.name == "value"
  );
  let value = "";
  if (valueProp) {
    value = (valueProp as AttributeNode).value?.content || "";
  }

  const simpleExpression = createSimpleExpression(
    `value == "${value}"`,
    false,
    prop.loc,
    0
  );
  const exp = processExpression(simpleExpression, context);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "bind",
    exp,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "checked",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });

  const exp2 = createSimpleExpression(`update("${value}")`, false, prop.loc, 0);
  node.props.push({
    type: NodeTypes.DIRECTIVE,
    name: "on",
    exp: exp2,
    arg: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: "change",
      isStatic: true,
      loc: prop.loc,
      constType: 0,
    },
    modifiers: [],
    loc: prop.loc,
  });
}

export function modifyInputTextNode(
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

  const exp2 = createSimpleExpression(
    "$event => update($event.target.value)",
    false,
    prop.loc,
    0
  );
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
