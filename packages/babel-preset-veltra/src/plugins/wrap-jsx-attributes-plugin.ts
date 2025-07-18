import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const wrapJsxAttributesPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "wrap-jsx-attributes-with-arrow-function",
    visitor: {
      JSXOpeningElement(path) {
        const attributes = path.node.attributes;

        const newAttributes = attributes.map((attr) => {
          if (!t.isJSXAttribute(attr) || !attr.value) return attr;

          const attrName = t.isJSXIdentifier(attr.name) ? attr.name.name : null;

          if (
            attrName === "ref" &&
            t.isJSXExpressionContainer(attr.value) &&
            t.isIdentifier(attr.value.expression)
          ) {
            const myRef = attr.value.expression;
            const elemParam = t.identifier("elem");
            const assignment = t.assignmentExpression("=", myRef, elemParam);

            const wrappedRef = t.arrowFunctionExpression([elemParam], assignment);

            return t.jsxAttribute(t.jsxIdentifier(attrName), t.jsxExpressionContainer(wrappedRef));
          }

          let propValue: t.Expression | null = null;

          if (t.isStringLiteral(attr.value)) {
            propValue = attr.value;
          } else if (t.isJSXExpressionContainer(attr.value)) {
            if (!t.isJSXEmptyExpression(attr.value.expression)) {
              propValue = attr.value.expression;
            }
          }

          if (propValue === null || attrName === null) return attr;

          const wrappedFn = t.arrowFunctionExpression([], propValue);

          return t.jsxAttribute(t.jsxIdentifier(attrName), t.jsxExpressionContainer(wrappedFn));
        });

        path.node.attributes = newAttributes;
      },
    },
  };
});
