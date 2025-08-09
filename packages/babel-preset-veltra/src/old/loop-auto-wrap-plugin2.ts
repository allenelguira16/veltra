import { NodePath, PluginObj } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

type Metadata = {
  reactiveParams: Map<string, Set<string>>;
  reactiveProps: Map<string, Set<string>>;
};

const GLOBAL_METADATA: Metadata = {
  reactiveParams: new Map(),
  reactiveProps: new Map(),
};

export const loopAutoWrapPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "loop-auto-wrap-plugin",
    visitor: {
      CallExpression(callPath, state) {
        const filename = state.filename || "unknown";
        let localReactive = GLOBAL_METADATA.reactiveParams.get(filename);
        if (!localReactive) {
          localReactive = new Set();
          GLOBAL_METADATA.reactiveParams.set(filename, localReactive);
        }

        const callee = callPath.get("callee");
        const parent = callPath.parentPath;

        if (callee.isMemberExpression() && parent.isJSXExpressionContainer()) {
          console.log("[MATCHED MAP]:", callPath.toString());

          const arrExpr = callee.get("object").node;
          const arrowFn = callPath.get("arguments")[0];

          if (arrowFn?.isArrowFunctionExpression()) {
            const params = arrowFn.node.params;
            const loopFn = t.callExpression(t.identifier("loop"), [
              t.arrowFunctionExpression([], arrExpr),
            ]);
            const eachCall = t.callExpression(t.memberExpression(loopFn, t.identifier("each")), [
              arrowFn.node,
            ]);
            callPath.replaceWith(eachCall);

            if (params[1] && t.isIdentifier(params[1])) {
              localReactive.add(params[1].name);
            }
          }
        }
      },

      JSXOpeningElement(jsxPath, state) {
        const filename = state.filename || "unknown";
        const localReactive = GLOBAL_METADATA.reactiveParams.get(filename);
        if (!localReactive) return;

        const namePath = jsxPath.get("name");
        if (!namePath.isJSXIdentifier()) return;
        const componentName = namePath.node.name;

        jsxPath.get("attributes").forEach((attr) => {
          if (!attr.isJSXAttribute()) return;
          const propName = attr.node.name.name;
          const valuePath = attr.get("value");

          if (valuePath?.isJSXExpressionContainer() && valuePath.get("expression").isIdentifier()) {
            const varName = valuePath.get("expression").node.name;

            if (localReactive.has(varName)) {
              let set = GLOBAL_METADATA.reactiveProps.get(componentName);
              if (!set) {
                set = new Set();
                GLOBAL_METADATA.reactiveProps.set(componentName, set);
              }
              set.add(propName);
            }
          }
        });
      },

      Identifier(idPath, state) {
        const name = idPath.node.name;
        const filename = state.filename || "unknown";

        if (
          idPath.parentPath.isVariableDeclarator({ id: idPath.node }) ||
          idPath.parentPath.isFunctionDeclaration({ id: idPath.node }) ||
          idPath.parentPath.isObjectProperty({ key: idPath.node }) ||
          idPath.parentPath.isFunctionExpression() ||
          idPath.parentPath.isArrowFunctionExpression() ||
          idPath.parentPath.isImportSpecifier() ||
          idPath.parentPath.isImportDefaultSpecifier()
        )
          return;

        if (
          idPath.parentPath.isMemberExpression() &&
          idPath.parent.property === idPath.node &&
          t.isIdentifier(idPath.node, { name: "value" })
        )
          return;

        const localReactive = GLOBAL_METADATA.reactiveParams.get(filename);
        if (localReactive?.has(name)) {
          idPath.replaceWith(t.memberExpression(t.identifier(name), t.identifier("value")));
          return;
        }

        const fnOrComp = findEnclosingFunctionOrComponent(idPath);
        if (!fnOrComp) return;

        const nameOfFn = fnOrComp.node.id?.name;
        if (!nameOfFn) return;

        const reactiveProps = GLOBAL_METADATA.reactiveProps.get(nameOfFn);
        if (reactiveProps?.has(name)) {
          idPath.replaceWith(t.memberExpression(t.identifier(name), t.identifier("value")));
        }
      },
    },
  } satisfies PluginObj;
});

// 🔎 Find the nearest function or component name for prop mapping
function findEnclosingFunctionOrComponent(
  path: NodePath,
): NodePath<t.Function | t.ArrowFunctionExpression> | null {
  return path.findParent(
    (p) => p.isFunctionDeclaration() || p.isFunctionExpression() || p.isArrowFunctionExpression(),
  ) as NodePath<t.Function> | null;
}
