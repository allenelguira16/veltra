import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const wrapJsxChildrenPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "wrap-jsx-children",
    visitor: {
      JSXElement(path) {
        const processedChildren: t.Expression[] = [];

        path.node.children.forEach((child) => {
          if (t.isJSXText(child) && child.value.trim() !== "") {
            processedChildren.push(t.stringLiteral(child.value));
          } else if (t.isJSXElement(child) || t.isJSXFragment(child)) {
            processedChildren.push(child);
          } else if (
            t.isJSXExpressionContainer(child) &&
            !t.isJSXEmptyExpression(child.expression)
          ) {
            processedChildren.push(child.expression);
          }
        });

        if (processedChildren.length === 0) return;

        const body =
          processedChildren.length === 1
            ? processedChildren[0]
            : t.arrayExpression(processedChildren);

        const arrowFn = t.arrowFunctionExpression([], body);

        path.node.children = [t.jsxExpressionContainer(arrowFn)];
      },

      JSXExpressionContainer(path) {
        if (
          !t.isArrowFunctionExpression(path.node.expression) &&
          !t.isFunctionExpression(path.node.expression) &&
          (t.isCallExpression(path.node.expression) ||
            t.isLogicalExpression(path.node.expression) ||
            t.isBinaryExpression(path.node.expression))
        ) {
          path.node.expression = t.arrowFunctionExpression([], path.node.expression);
        }
      },
    },
  };
});
