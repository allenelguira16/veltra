import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const wrapJsxPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "jsx-getter-transform",
    visitor: {
      Program: {
        enter(_, state) {
          state.jsxNames = new Set();
        },

        exit(path, state) {
          const jsxNames = state.jsxNames as Set<string>;

          // Traverse after the entire program to ensure imports are detected
          path.traverse({
            ImportDeclaration(importPath) {
              const source = importPath.node.source.value;
              if (source === "vynn/jsx-runtime") {
                for (const specifier of importPath.node.specifiers) {
                  if (
                    t.isImportSpecifier(specifier) &&
                    t.isIdentifier(specifier.imported) &&
                    ["jsx", "jsxs", "jsxDEV"].includes(specifier.imported.name)
                  ) {
                    jsxNames.add(specifier.local.name);
                  }
                }
              }
            },

            CallExpression(callPath) {
              const node = callPath.node;
              const callee = node.callee;

              if (!t.isIdentifier(callee)) return;
              if (!jsxNames.has(callee.name)) return;

              const [el, props] = node.arguments;

              // Only transform JSX tag calls with object literal props
              if (!t.isStringLiteral(el) || !t.isObjectExpression(props)) return;

              const transformedProps = props.properties.map((prop) => {
                if (!t.isObjectProperty(prop)) return prop;
                if (!t.isExpression(prop.value)) return prop;
                if (!t.isExpression(prop.key)) return prop;
                if (t.isPrivateName(prop.key)) return prop;

                return t.objectMethod(
                  "get", // define a getter
                  prop.key, // the key (e.g. foo)
                  [], // no parameters
                  t.blockStatement([
                    // return block
                    t.returnStatement(prop.value),
                  ]),
                  prop.computed ?? false, // respect computed keys
                );
              });

              // Replace props with new object of getters
              node.arguments[1] = t.objectExpression(transformedProps);
            },
          });
        },
      },
    },
  };
});
