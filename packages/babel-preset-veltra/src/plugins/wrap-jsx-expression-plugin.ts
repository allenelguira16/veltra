import { NodePath, PluginObj } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

/**
 * babel plugin to wrap jsx expressions except loop and handle ref specially
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export const wrapJSXExpressionsPlugin = declare((api): PluginObj => {
  api.assertVersion(7);

  return {
    name: "wrap-jsx-expressions",
    visitor: {
      JSXExpressionContainer(path: NodePath<t.JSXExpressionContainer>) {
        const expr = path.get("expression");

        // Skip empty expressions
        if (t.isJSXEmptyExpression(expr.node)) return;

        // Check if parent is a JSXAttribute
        const attr = path.parentPath;
        if (attr.isJSXAttribute() && attr.node.name.name === "ref") {
          // If already an arrow function, do nothing
          if (t.isArrowFunctionExpression(expr.node)) return;

          // If identifier (e.g., `ref={myRef}`), convert to: `ref={(elem) => myRef = elem}`
          if (t.isIdentifier(expr.node) || t.isMemberExpression(expr.node)) {
            path.replaceWith(
              t.jSXExpressionContainer(
                t.arrowFunctionExpression(
                  [t.identifier("elem")],
                  t.assignmentExpression("=", expr.node, t.identifier("elem")),
                ),
              ),
            );
            return;
          }

          // Optional: If it's not an identifier or arrow function, leave it unchanged or handle as needed
          return;
        }

        // Otherwise, wrap in an arrow function
        path.node.expression = t.arrowFunctionExpression([], expr.node);
      },
    },
  };
});
