import fs from "fs";
import { ArrowFunction, CallExpression, JsxAttribute, Project, SyntaxKind } from "ts-morph";

export function loopMetadata(files: string[]) {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
  });

  const sourceFiles = files.map((file) => project.addSourceFileAtPath(file));
  const metadata: Record<string, Record<string, "signal">> = {};

  for (const sourceFile of sourceFiles) {
    sourceFile.forEachDescendant((node) => {
      // ✅ Only look at CallExpressions
      if (node.getKind() !== SyntaxKind.CallExpression) return;
      const callExpr = node.asKind(SyntaxKind.CallExpression) as CallExpression;

      // ✅ Check for `.each` call
      const expr = callExpr.getExpression();
      if (!expr || expr.getKind() !== SyntaxKind.PropertyAccessExpression) return;
      if (expr.getLastToken()?.getText() !== "each") return;

      // ✅ Extract arrow function from loop(each)
      const [fn] = callExpr.getArguments();
      if (!fn || fn.getKind() !== SyntaxKind.ArrowFunction) return;

      const arrowFn = fn.asKind(SyntaxKind.ArrowFunction) as ArrowFunction;

      const [, indexParam] = arrowFn.getParameters();
      if (!indexParam) return;

      const jsxTags = arrowFn.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
      for (const tag of jsxTags) {
        const tagName = tag.getTagNameNode().getText();

        for (const attr of tag.getAttributes()) {
          if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;

          const jsxAttr = attr.asKind(SyntaxKind.JsxAttribute) as JsxAttribute;
          const propName = jsxAttr.getNameNode().getText();
          const initializer = jsxAttr.getInitializer();

          // initializer can be: "={index}" or JSX expression containers
          if (initializer?.getText() === indexParam.getName()) {
            metadata[tagName] ??= {};
            metadata[tagName][propName] = "signal";
          }
        }
      }
    });
  }

  fs.writeFileSync("node_modules/.vynn-loop-meta.json", JSON.stringify(metadata, null, 2));
  console.log(metadata);
}
