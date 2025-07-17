import { isNil } from "../util/is-node-nil";

/**
 * get the node for a JSX element
 *
 * @param jsxElement - The JSX element to get the node for.
 * @returns The node for the JSX element.
 */
export function getNode<T extends Node | undefined>(jsxElement: JSX.Element): T | T[] {
  if (jsxElement instanceof Node) {
    return jsxElement as T;
  }

  if (isNil(jsxElement)) {
    return undefined as T;
  }

  if (typeof jsxElement === "function") {
    return getNode(jsxElement());
  }

  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode).flat() as T[];
  }

  return document.createTextNode(String(jsxElement)) as unknown as T;
}
