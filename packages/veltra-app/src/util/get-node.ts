import { isNil } from "./is-node-nil";

export function getNode(
  jsxElement: JSX.Element
): undefined | Node | (Node | undefined)[] {
  if (typeof jsxElement === "string" || typeof jsxElement === "number") {
    return document.createTextNode(String(jsxElement));
  }

  if (jsxElement instanceof Node) {
    return jsxElement;
  }

  if (isNil(jsxElement)) {
    return undefined;
  }

  if (typeof jsxElement === "function") {
    return getNode(jsxElement());
  }

  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode) as (Node | undefined)[];
  }

  console.log("Unknown JSX Element", jsxElement);
}
