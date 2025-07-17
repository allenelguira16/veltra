import { declare } from "@babel/helper-plugin-utils";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export const wrapJsxChildrenPlugin = declare((api) => {
  api.assertVersion(7);

  function wrapChildren(path: NodePath<t.JSXElement | t.JSXFragment>) {
    const processedChildren: t.Expression[] = [];

    path.node.children.forEach((child, i) => {
      if (t.isJSXText(child)) {
        let value = child.value;

        if (!value.includes("\n") || value.trim() !== "") {
          if (i === 0) value = value.trimStart();
          if (i === path.node.children.length - 1) value = value.trimEnd();

          processedChildren.push(t.arrowFunctionExpression([], t.stringLiteral(value)));
        }
      } else if (t.isJSXElement(child) || t.isJSXFragment(child)) {
        processedChildren.push(t.arrowFunctionExpression([], child));
      } else if (t.isJSXExpressionContainer(child) && !t.isJSXEmptyExpression(child.expression)) {
        const expr = child.expression;

        if (t.isStringLiteral(expr)) {
          processedChildren.push(expr);
        } else {
          processedChildren.push(t.arrowFunctionExpression([], expr));
        }
      }
    });

    if (processedChildren.length === 0) return;

    let body =
      processedChildren.length === 1 ? processedChildren[0] : t.arrayExpression(processedChildren);

    if (!t.isArrowFunctionExpression(body)) {
      body = t.arrowFunctionExpression([], body);
    }

    path.node.children = [t.jsxExpressionContainer(body)];
  }

  return {
    name: "wrap-jsx-children-plugin",
    visitor: {
      JSXElement(path) {
        wrapChildren(path);
      },
      JSXFragment(path) {
        wrapChildren(path);
      },
    },
  };
});
