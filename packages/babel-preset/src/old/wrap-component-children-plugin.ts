import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const wrapComponentChildrenPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "wrap-component-children",
    visitor: {
      JSXElement(path) {
        const opening = path.node.openingElement;
        const tag = opening.name;

        if (!t.isJSXIdentifier(tag)) return;
        const tagName = tag.name;
        if (!/^[A-Z]/.test(tagName)) return;

        const validChildren = path.node.children.filter(
          (c) => !(t.isJSXText(c) && c.value.trim() === "") && !t.isJSXEmptyExpression(c),
        );
        if (validChildren.length === 0) return;

        const alreadyWrapped =
          validChildren.length === 1 && t.isJSXExpressionContainer(validChildren[0]);

        if (alreadyWrapped) return;

        let content: t.Expression | t.JSXFragment;
        if (validChildren.length === 1) {
          const child = validChildren[0];

          // If the child is a JSX element or fragment, it's already an Expression
          if (t.isJSXElement(child) || t.isJSXFragment(child)) {
            content = child;
          }
          // If it's a JSX expression container, extract its expression
          else if (t.isJSXExpressionContainer(child)) {
            if (t.isExpression(child.expression)) {
              content = child.expression;
            } else {
              // Skip invalid JSX expression (e.g., empty expressions)
              return;
            }
          }
          // If it's text, convert to string literal
          else if (t.isJSXText(child)) {
            content = t.stringLiteral(child.value.trim());
          }
          // Else, ignore (for safety)
          else {
            return;
          }
        } else {
          content = t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), validChildren);
        }

        // Wrap in JSXExpressionContainer if it's an Expression
        path.node.children = [
          t.isExpression(content) ? t.jsxExpressionContainer(content) : content,
        ];
      },
    },
  };
});
