import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const babelPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "veltra-plugin-babel",
    visitor: {
      JSXExpressionContainer(path) {
        const expr = path.node.expression;

        // Skip empty expressions
        if (t.isJSXEmptyExpression(expr)) return;

        // For JSX children, always wrap
        path.node.expression = t.arrowFunctionExpression([], expr);

        // // Traverse and inject .map() warnings with IIFE
        // path.traverse({
        //   CallExpression(innerPath) {
        //     if (isMapCall(innerPath.node.callee)) {
        //       injectWarn(innerPath);
        //       innerPath.skip();
        //     }
        //   },
        //   OptionalCallExpression(innerPath) {
        //     if (isMapCall(innerPath.node.callee)) {
        //       injectWarn(innerPath);
        //       innerPath.skip();
        //     }
        //   },
        // });
      },
      JSXAttribute(path) {
        const attr = path.node;

        if (
          t.isJSXIdentifier(attr.name, { name: "ref" }) &&
          t.isJSXExpressionContainer(attr.value)
        ) {
          const expression = attr.value.expression;

          // Only transform if the ref value is an Identifier (e.g., ref={divElement})
          if (t.isIdentifier(expression)) {
            const param = t.identifier("el");
            const body = t.assignmentExpression("=", expression, param);

            attr.value.expression = t.arrowFunctionExpression([param], body);
          }
        }
      },
    },
  };
});
