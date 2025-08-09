import {
  AttributeNode,
  createSimpleExpression,
  DirectiveNode,
  ElementNode,
  NodeTypes,
  processExpression,
  TransformContext,
} from "@vue/compiler-dom";

export function modifySelectNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const isMultiple: AttributeNode | DirectiveNode | undefined = node.props.find(
    (res) => res.name == "multiple"
  );
  if (isMultiple == undefined) {
    modifyOnlySelectNode(node, prop, context);
  } else {
    modifyMultipleSelectNode(node, prop, context);
  }
}

function modifyOnlySelectNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  const simpleExpression = createSimpleExpression(`value`, false, prop.loc, 0);
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
    `update($event.target.value)`,
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

function modifyMultipleSelectNode(
  node: ElementNode,
  prop: AttributeNode | DirectiveNode,
  context: TransformContext
) {
  node.children.forEach((option) => {
    const op = option as ElementNode;
    const valueProp: AttributeNode | DirectiveNode | undefined = op.props.find(
      (res) => res.name == "value"
    );
    let value = "";
    if (valueProp) {
      value = (valueProp as AttributeNode).value?.content || "";
    } else {
      const optionContent = op.children.find(
        (res) => res.type == NodeTypes.TEXT
      );
      if (optionContent) {
        value = (optionContent as { content: string }).content;
      }
    }

    const simpleExpression = createSimpleExpression(
      `value.find((res) => res == '${value}')`,
      false,
      prop.loc,
      0
    );
    const exp = processExpression(simpleExpression, context);
    op.props.push({
      type: NodeTypes.DIRECTIVE,
      name: "bind",
      exp,
      arg: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: "selected",
        isStatic: true,
        loc: prop.loc,
        constType: 0,
      },
      modifiers: [],
      loc: prop.loc,
    });
  });

  const exp2 = createSimpleExpression(
    `update(
      Array.from($event.target.selectedOptions).map(
        (option) => option.value
      )
    )`,
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
