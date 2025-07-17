import { declare } from "@babel/helper-plugin-utils";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export const autoCallJSXPropsPlugin = declare((api) => {
  api.assertVersion(7);

  const IGNORE_PROPS = new Set(["children"]);

  function collectProps(param: t.Function["params"][number]) {
    const propNames = new Set<string>();
    let propsId: string | null = null;

    if (t.isObjectPattern(param)) {
      for (const prop of param.properties) {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          if (t.isIdentifier(prop.value)) {
            if (!IGNORE_PROPS.has(prop.value.name)) {
              propNames.add(prop.value.name);
            }
          } else if (t.isAssignmentPattern(prop.value) && t.isIdentifier(prop.value.left)) {
            if (!IGNORE_PROPS.has(prop.value.left.name)) {
              propNames.add(prop.value.left.name);
            }
          } else if (prop.shorthand && t.isIdentifier(prop.key)) {
            if (!IGNORE_PROPS.has(prop.key.name)) {
              propNames.add(prop.key.name);
            }
          }
        }
      }
    } else if (t.isIdentifier(param)) {
      propsId = param.name;
    }

    return { propNames, propsId };
  }

  function transformUsages(
    fnPath: NodePath<t.Function>,
    propNames: Set<string>,
    propsId: string | null,
  ) {
    const bodyPath = fnPath.get("body");
    if (!bodyPath.isBlockStatement()) return;

    bodyPath.traverse({
      JSXExpressionContainer(exprPath) {
        const expr = exprPath.get("expression");

        // {dropdowns}
        if (expr.isIdentifier() && propNames.has(expr.node.name)) {
          expr.replaceWith(t.callExpression(expr.node, []));
          return;
        }

        // {props.dropdown}
        if (
          propsId &&
          expr.isMemberExpression() &&
          t.isIdentifier(expr.node.object, { name: propsId }) &&
          t.isIdentifier(expr.node.property) &&
          !IGNORE_PROPS.has(expr.node.property.name)
        ) {
          expr.replaceWith(t.callExpression(expr.node, []));
          return;
        }

        // {() => dropdowns}
        if (expr.isArrowFunctionExpression() && expr.node.params.length === 0) {
          const body = expr.get("body");

          if (body.isIdentifier() && propNames.has(body.node.name)) {
            expr.replaceWith(t.callExpression(t.identifier(body.node.name), []));
            return;
          }

          if (
            propsId &&
            body.isMemberExpression() &&
            t.isIdentifier(body.node.object, { name: propsId }) &&
            t.isIdentifier(body.node.property) &&
            !IGNORE_PROPS.has(body.node.property.name)
          ) {
            expr.replaceWith(t.callExpression(body.node as t.MemberExpression, []));
            return;
          }
        }

        // ✅ dropdowns.numbers → dropdowns().numbers
        if (
          expr.isMemberExpression() &&
          t.isIdentifier(expr.node.object) &&
          propNames.has(expr.node.object.name)
        ) {
          expr.get("object").replaceWith(t.callExpression(t.identifier(expr.node.object.name), []));
          return;
        }

        // ✅ props.dropdown.numbers → props.dropdown().numbers
        if (
          expr.isMemberExpression() &&
          t.isMemberExpression(expr.node.object) &&
          t.isIdentifier(expr.node.object.object, { name: propsId }) &&
          t.isIdentifier(expr.node.object.property) &&
          !IGNORE_PROPS.has(expr.node.object.property.name)
        ) {
          const callee = t.callExpression(expr.node.object, []);
          expr.get("object").replaceWith(callee);
          return;
        }
      },

      ObjectProperty(propPath: NodePath<t.ObjectProperty>) {
        const value = propPath.get("value");

        // number: number
        if (value.isIdentifier()) {
          if (propNames.has(value.node.name)) {
            value.replaceWith(t.callExpression(value.node, []));
            return;
          }
        }

        // number: props.number
        if (
          propsId &&
          value.isMemberExpression() &&
          t.isIdentifier(value.node.object, { name: propsId }) &&
          t.isIdentifier(value.node.property) &&
          !IGNORE_PROPS.has(value.node.property.name)
        ) {
          value.replaceWith(t.callExpression(value.node, []));
          return;
        }

        // number: () => number
        if (value.isArrowFunctionExpression() && value.node.params.length === 0) {
          const body = value.get("body");

          if (body.isIdentifier() && propNames.has(body.node.name)) {
            value.replaceWith(t.callExpression(t.identifier(body.node.name), []));
            return;
          }

          if (
            propsId &&
            body.isMemberExpression() &&
            t.isIdentifier(body.node.object, { name: propsId }) &&
            t.isIdentifier(body.node.property) &&
            !IGNORE_PROPS.has(body.node.property.name)
          ) {
            value.replaceWith(t.callExpression(body.node as t.MemberExpression, []));
            return;
          }
        }
      },
    });
  }

  return {
    name: "auto-call-jsx-props",
    visitor: {
      FunctionDeclaration(path) {
        const param = path.node.params[0];
        if (!param) return;
        const { propNames, propsId } = collectProps(param);
        transformUsages(path, propNames, propsId);
      },
      ArrowFunctionExpression(path) {
        const param = path.node.params[0];
        if (!param) return;
        const { propNames, propsId } = collectProps(param);
        transformUsages(path, propNames, propsId);
      },
    },
  };
});
