import { NodePath } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

/**
 * babel plugin to log jsx
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export const logJsxPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    visitor: {
      Program(path, state) {
        const filename = state.filename || "";

        // Skip Veltra internal or installed files
        if (
          filename.includes("/veltra-app/") ||
          filename.includes("\\veltra-app\\") ||
          filename.includes("/node_modules/@veltra/app/") ||
          filename.includes("\\node_modules\\@veltra\\app\\")
        ) {
          return;
        }

        let hasLogJsx = false;

        // Check existing imports
        path.get("body").forEach((child) => {
          if (
            child.isImportDeclaration() &&
            child.node.source.value === "@veltra/app/jsx-runtime"
          ) {
            child.node.specifiers.forEach((spec) => {
              if (t.isImportSpecifier(spec)) {
                const imported = spec.imported;
                if (t.isIdentifier(imported) && imported.name === "logJsx") {
                  hasLogJsx = true;
                }
              }
            });
          }
        });

        // Insert import if missing
        if (!hasLogJsx) {
          const importDecl = t.importDeclaration(
            [t.importSpecifier(t.identifier("logJsx"), t.identifier("logJsx"))],
            t.stringLiteral("@veltra/app/jsx-runtime"),
          );
          path.unshiftContainer("body", importDecl);
        }
      },

      CallExpression(path: NodePath<t.CallExpression>) {
        const callee = path.get("callee");

        // Detect console.* calls
        if (
          t.isMemberExpression(callee.node) &&
          t.isIdentifier(callee.node.object, { name: "console" }) &&
          t.isIdentifier(callee.node.property)
        ) {
          // For each argument, check if JSX
          const newArgs = path.node.arguments.map((arg) => {
            if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
              return t.callExpression(t.identifier("logJsx"), [arg]);
            }
            return arg;
          });

          // Replace arguments if any JSX was wrapped
          if (newArgs.some((arg, i) => arg !== path.node.arguments[i])) {
            path.node.arguments = newArgs;
          }
        }
      },
    },
  };
});
