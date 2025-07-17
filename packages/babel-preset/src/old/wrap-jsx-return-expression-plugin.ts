import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const wrapJsxReturnExpressionPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "wrap-jsx-return-expression-plugin",
    visitor: {
      ReturnStatement(path) {
        const arg = path.node.argument;
        if (!t.isJSXElement(arg) && !t.isJSXFragment(arg)) return;

        path.traverse({
          JSXExpressionContainer(exprPath) {
            const expr = exprPath.node.expression;

            if (t.isJSXEmptyExpression(expr)) return;

            // Check if this expression is inside a JSXAttribute — if yes, skip.
            if (exprPath.findParent((p) => t.isJSXAttribute(p.node))) {
              return;
            }

            exprPath.node.expression = t.arrowFunctionExpression([], expr);
          },
        });
      },
    },
  };
});
