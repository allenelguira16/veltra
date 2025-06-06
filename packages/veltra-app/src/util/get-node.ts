import { isNil } from "./is-node-nil";

export function getNode(
  node: JSX.Element | (() => JSX.Element)
): Node | undefined {
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node)) as Node;
  }

  if (node instanceof HTMLElement || node instanceof Text) {
    return node as Node;
  }

  if (isNil(node)) {
    return undefined;
  }

  if (typeof node !== "function") {
    return node as Node;
  }

  return getNode((node as () => Node)());
}
