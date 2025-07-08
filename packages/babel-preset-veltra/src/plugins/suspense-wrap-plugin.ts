import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const suspenseWrapPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "suspense-fragment-wrapper",
    visitor: {
      Program(programPath) {
        const suspenseNames = new Set<string>(["Suspense"]);

        // Detect Suspense imports from @veltra/app
        programPath.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === "@veltra/app") {
              for (const spec of importPath.node.specifiers) {
                if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
                  if (spec.imported.name === "Suspense") {
                    suspenseNames.add(spec.local.name);
                  }
                }
              }
            }
          },
        });

        // Transform <Suspense> JSX children
        programPath.traverse({
          JSXElement(path) {
            const opening = path.node.openingElement;

            if (!t.isJSXIdentifier(opening.name)) return;
            if (!suspenseNames.has(opening.name.name)) return;

            // Filter out whitespace-only JSXText
            const children = path.node.children.filter(
              (child) => !t.isJSXText(child) || child.value.trim().length > 0,
            );

            if (children.length <= 1) return; // nothing to transform

            // Replace with a single JSXExpressionContainer containing a fragment
            const fragment = t.jsxFragment(
              t.jsxOpeningFragment(),
              t.jsxClosingFragment(),
              children,
            );

            path.node.children = [t.jsxExpressionContainer(fragment)];
          },
        });
      },
    },
  };
});
