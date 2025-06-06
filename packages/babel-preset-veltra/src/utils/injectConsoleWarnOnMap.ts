import * as t from "@babel/types";
import { NodePath } from "@babel/core";
import { isInsideJSXAttribute, wrapExpressionInArrow } from ".";

function insertWarnFlag(path: NodePath, warnedId: t.Identifier) {
  const bindingScope =
    path.scope.getFunctionParent() || path.scope.getProgramParent();
  bindingScope.push({
    id: warnedId,
    init: t.booleanLiteral(false),
  });
}

// Helper to handle both normal and optional calls with .map
function handleMapCall(
  innerPath: NodePath<t.CallExpression | t.OptionalCallExpression>,
  warnedId: t.Identifier,
  insertFlag: () => void,
  warnedInserted: { value: boolean }
) {
  const call = innerPath.node;
  const callee = call.callee;

  if (
    (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) &&
    t.isIdentifier(callee.property, { name: "map" }) &&
    !callee.computed
  ) {
    if (!warnedInserted.value) {
      insertFlag();
      warnedInserted.value = true;
    }

    const warnExpr = t.sequenceExpression([
      t.logicalExpression(
        "||",
        warnedId,
        t.sequenceExpression([
          t.callExpression(
            t.memberExpression(t.identifier("console"), t.identifier("warn")),
            [t.stringLiteral("please use .map instead — use For component")]
          ),
          t.assignmentExpression("=", warnedId, t.booleanLiteral(true)),
        ])
      ),
      call,
    ]);

    innerPath.replaceWith(warnExpr);
    innerPath.skip();
  }
}

export const injectConsoleWarnOnMap = (
  path: NodePath<t.JSXExpressionContainer>
) => {
  let warnedInserted = { value: false };
  const warnedId = path.scope.generateUidIdentifier("warned");

  path.traverse({
    JSXExpressionContainer(innerPath) {
      if (isInsideJSXAttribute(innerPath)) {
        innerPath.skip();
      }
    },
    CallExpression(innerPath) {
      handleMapCall(
        innerPath,
        warnedId,
        () => insertWarnFlag(path, warnedId),
        warnedInserted
      );
    },
    OptionalCallExpression(innerPath) {
      handleMapCall(
        innerPath,
        warnedId,
        () => insertWarnFlag(path, warnedId),
        warnedInserted
      );
    },
  });

  return wrapExpressionInArrow(path.node.expression as t.Expression);
};
