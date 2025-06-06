import * as t from "@babel/types";

export function wrapExpressionInArrow<T extends t.Expression>(expr: T) {
  const arrow = t.arrowFunctionExpression([], expr);
  arrow.loc = expr.loc;
  return arrow;
}
