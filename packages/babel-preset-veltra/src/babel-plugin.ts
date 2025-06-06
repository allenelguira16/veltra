import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { wrapExpressionInArrow } from "./utils";
import { NodePath, PluginPass } from "@babel/core";

// Import handler
function handleImports(path: NodePath<t.Program>, state: PluginPass) {
  const isInVeltraApp = state.filename && state.filename.includes("veltra-app");
  if (isInVeltraApp) return;

  let hasMemoImport = false;
  let hasCleanLogImport = false;

  path.traverse({
    ImportDeclaration(importPath) {
      if (importPath.node.source.value === "@veltra/app") {
        const specifiers = importPath.node.specifiers;

        const hasMemo = specifiers.some(
          (s) =>
            t.isImportSpecifier(s) &&
            t.isIdentifier(s.imported, { name: "memo" })
        );

        const hasCleanLog = specifiers.some(
          (s) =>
            t.isImportSpecifier(s) &&
            t.isIdentifier(s.imported, { name: "cleanLog" })
        );

        if (!hasMemo) {
          specifiers.push(
            t.importSpecifier(t.identifier("memo"), t.identifier("memo"))
          );
        }
        if (!hasCleanLog) {
          specifiers.push(
            t.importSpecifier(
              t.identifier("cleanLog"),
              t.identifier("cleanLog")
            )
          );
        }

        hasMemoImport = hasMemoImport || hasMemo;
        hasCleanLogImport = hasCleanLogImport || hasCleanLog;
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
        [t.importSpecifier(t.identifier("cleanLog"), t.identifier("cleanLog"))],
        t.stringLiteral("@veltra/app")
      )
    );
  }
}

// JSXExpressionContainer handler
function handleJSXExpressionContainer(
  path: NodePath<t.JSXExpressionContainer>
) {
  const expr = path.node.expression;

  // Handle cond && <JSXElement>
  if (
    t.isLogicalExpression(expr) &&
    expr.operator === "&&" &&
    t.isJSXElement(expr.right)
  ) {
    const jsxElement = expr.right;
    const scopePath = path.findParent((p) => p.isProgram() || p.isFunction());
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
        } else if (bodyPath.isBlockStatement()) {
          bodyPath.unshiftContainer("body", memoizedVar);
        }
      }
    }

    path.node.expression = t.arrowFunctionExpression(
      [],
      t.logicalExpression("&&", expr.left, t.callExpression(varName, []))
    );

    return;
  }

  // Wrap other non-JSX expressions
  if (
    !t.isJSXEmptyExpression(expr) &&
    !t.isJSXElement(expr) &&
    !t.isJSXFragment(expr)
  ) {
    path.node.expression = wrapExpressionInArrow(expr);
  }
}

// JSXAttribute handler
function handleJSXAttribute(path: NodePath<t.JSXAttribute>) {
  const attr = path.node;

  // Handle ref
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

  // Wrap JSXElement or JSXFragment in attributes
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
}

// CallExpression handler
function handleCallExpression(path: NodePath<t.CallExpression>) {
  const callee = path.node.callee;

  // Check for console.* calls
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
}

export const babelPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "veltra-plugin-babel",
    visitor: {
      Program(path, state) {
        handleImports(path, state);
      },
      JSXExpressionContainer(path) {
        handleJSXExpressionContainer(path);
      },
      JSXAttribute(path) {
        handleJSXAttribute(path);
      },
      CallExpression(path) {
        handleCallExpression(path);
      },
    },
  };
});
