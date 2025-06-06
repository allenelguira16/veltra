import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { wrapExpressionInArrow } from "./utils";

export const babelPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "veltra-plugin-babel",
    visitor: {
      Program(path, state) {
        // Skip adding memo import if inside veltra-app
        const isInVeltraApp =
          state.filename && state.filename.includes("veltra-app");
        if (isInVeltraApp) return;

        // Ensure memo is imported
        let hasMemoImport = false;
        let hasCleanLogImport = false;

        path.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === "@veltra/app") {
              const specifiers = importPath.node.specifiers;
              const hasMemo = specifiers.some(
                (s) =>
                  t.isImportSpecifier(s) &&
                  t.isIdentifier(s.imported) &&
                  s.imported.name === "memo"
              );
              if (!hasMemo) {
                specifiers.push(
                  t.importSpecifier(t.identifier("memo"), t.identifier("memo"))
                );
              }
              const hasCleanLog = specifiers.some(
                (s) =>
                  t.isImportSpecifier(s) &&
                  t.isIdentifier(s.imported) &&
                  s.imported.name === "cleanLog"
              );
              if (hasCleanLog) {
                hasCleanLogImport = true;
              }
              hasMemoImport = true;
            }
          },
        });

        if (!hasMemoImport) {
          path.node.body.unshift(
            t.importDeclaration(
              [t.importSpecifier(t.identifier("memo"), t.identifier("memo"))],
              t.stringLiteral("@veltra/app")
            )
          );
        }

        if (!hasCleanLogImport) {
          path.node.body.unshift(
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier("cleanLog"),
                  t.identifier("cleanLog")
                ),
              ],
              t.stringLiteral("@veltra/app")
            )
          );
        }
      },

      JSXExpressionContainer(path) {
        const expr = path.node.expression;

        // Handle cond && <JSXElement>
        if (
          t.isLogicalExpression(expr) &&
          expr.operator === "&&" &&
          t.isJSXElement(expr.right)
        ) {
          const jsxElement = expr.right;

          const scopePath = path.findParent(
            (p) => p.isProgram() || p.isFunction()
          );
          const varName = path.scope.generateUidIdentifier("memoized");

          const memoizedVar = t.variableDeclaration("const", [
            t.variableDeclarator(
              varName,
              t.callExpression(t.identifier("memo"), [
                t.arrowFunctionExpression([], jsxElement),
              ])
            ),
          ]);

          if (scopePath) {
            if (scopePath.isProgram()) {
              scopePath.unshiftContainer("body", memoizedVar);
            } else if (
              scopePath.isFunctionDeclaration() ||
              scopePath.isFunctionExpression() ||
              scopePath.isArrowFunctionExpression()
            ) {
              const bodyPath = scopePath.get("body");

              if (Array.isArray(bodyPath)) {
                const firstBody = bodyPath[0];
                if (firstBody && firstBody.isBlockStatement()) {
                  firstBody.unshiftContainer("body", memoizedVar);
                }
              } else {
                if (bodyPath.isBlockStatement()) {
                  bodyPath.unshiftContainer("body", memoizedVar);
                }
              }
            }
          }

          path.node.expression = t.arrowFunctionExpression(
            [],
            t.logicalExpression("&&", expr.left, t.callExpression(varName, []))
          );

          return;
        }

        // Wrap all other expressions, except pure JSXElement or JSXFragment
        if (
          !t.isJSXEmptyExpression(expr) &&
          !t.isJSXElement(expr) &&
          !t.isJSXFragment(expr)
        ) {
          path.node.expression = wrapExpressionInArrow(expr);
        }
      },

      JSXAttribute(path) {
        const attr = path.node;

        if (
          t.isJSXIdentifier(attr.name, { name: "ref" }) &&
          t.isJSXExpressionContainer(attr.value)
        ) {
          const expression = attr.value.expression;

          if (t.isIdentifier(expression)) {
            const param = t.identifier("el");
            const body = t.assignmentExpression("=", expression, param);

            attr.value.expression = t.arrowFunctionExpression([param], body);
          }
        }

        // wrap JSXElement or JSXFragment in attributes in arrow function
        if (
          t.isJSXExpressionContainer(attr.value) &&
          (t.isJSXElement(attr.value.expression) ||
            t.isJSXFragment(attr.value.expression))
        ) {
          attr.value.expression = t.arrowFunctionExpression(
            [],
            attr.value.expression
          );
        }
      },

      CallExpression(path) {
        const callee = path.node.callee;

        // Target console.* calls
        const isConsole =
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: "console" });

        if (!isConsole) return;

        path.node.arguments = path.node.arguments.map((arg) => {
          if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
            return t.callExpression(t.identifier("cleanLog"), [arg]);
          }
          return arg;
        });
      },
    },
  };
});
