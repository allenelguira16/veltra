import babel from "vite-plugin-babel";

import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { NodePath } from "@babel/core";

export const miniAppBabelPlugin = declare((api) => {
  api.assertVersion(7);

  function isMapCall(callee: t.Node | null | undefined): boolean {
    if (!callee) return false;
    return (
      (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) &&
      t.isIdentifier(callee.property, { name: "map" })
    );
  }

  function injectWarn(
    path: NodePath<t.CallExpression | t.OptionalCallExpression>
  ) {
    const { line, column } = path.node.loc?.start ?? { line: "?", column: "?" };

    // Create an arrow function expression:
    // (() => {
    //   console.warn("⚠️ Detected .map() inside JSX at line ..., column ....");
    //   return ORIGINAL_MAP_CALL;
    // })()

    const originalCall = path.node;

    const warnStatement = t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier("console"), t.identifier("warn")),
        [
          t.stringLiteral(
            `⚠️ Detected .map() inside JSX at line ${line}, column ${column}. Consider using <For> for more efficient rendering.`
          ),
        ]
      )
    );

    const iife = t.callExpression(
      t.arrowFunctionExpression(
        [],
        t.blockStatement([warnStatement, t.returnStatement(originalCall)])
      ),
      []
    );

    path.replaceWith(iife);
    path.skip();
  }

  return {
    name: "mini-solid",
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

// console.log();

// Vite Plugin
const miniAppPlugin = ({
  importSource = __dirname,
}:
  | {
      importSource?: string;
    }
  | undefined = {}) =>
  babel({
    babelConfig: {
      presets: [
        [
          "@babel/preset-react",
          {
            runtime: "automatic",
            importSource,
          },
        ],
        "@babel/preset-typescript",
      ],
      plugins: [miniAppBabelPlugin],
      sourceMaps: true, // generate external source map files
    },
    filter: /\.(t|j)sx?$/, // make sure Babel runs on TSX files too
  });

export default miniAppPlugin;
