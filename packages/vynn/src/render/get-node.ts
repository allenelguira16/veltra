import { JSX } from "~/types";
import { toArray } from "~/util";

/**
 * get the node for a JSX element
 *
 * @param jsxElement - The JSX element to get the node for.
 * @returns The node for the JSX element.
 */
export function getNode<T extends Node>(jsxElement: JSX.Element): T {
  if (jsxElement instanceof Node) {
    return jsxElement as T;
  }

  if (typeof jsxElement === "string" || typeof jsxElement === "number") {
    return document.createTextNode(String(jsxElement)) as unknown as T;
  }

  throw new Error(`Unknown value: ${jsxElement}`);
}

export function getNodes<T extends Node>(jsxElement: JSX.Element) {
  return toArray(getNode<T>(jsxElement)).flat();
}
