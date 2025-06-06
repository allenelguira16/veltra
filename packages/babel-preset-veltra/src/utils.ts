import * as t from "@babel/types";
import { NodePath } from "@babel/core";

export function isMapCall(callee: t.Node | null | undefined): boolean {
  if (!callee) return false;
  return (
    (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) &&
    t.isIdentifier(callee.property, { name: "map" })
  );
}

export function injectWarn(
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
