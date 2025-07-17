import { JSX } from "~/types";
import { isNil, toArray } from "~/util";

/**
 * Handle the children of the element for SSR
 *
 * @param children - The children of the element.
 * @returns The transformed children.
 */
export function renderChildrenToString(children: JSX.Element) {
  function renderRecursive(value: JSX.Element) {
    const transformedChildren: string[] = [];

    const resolvedChildren = value instanceof Function ? value() : value;
    const children = toArray(resolvedChildren);

    for (const child of children) {
      if (isNil(child)) continue;

      if (typeof child === "function") {
        transformedChildren.push(renderRecursive(child));
      } else {
        const resolved = getNode(child);
        transformedChildren.push(resolved);
      }
    }
    return transformedChildren.join("");
  }

  return renderRecursive(children);
}

/**
 * get the node for a JSX element
 *
 * @param jsxElement - The JSX element to get the node for.
 * @returns The node for the JSX element.
 */
export function getNode<T extends string>(jsxElement: JSX.Element): T {
  if (typeof jsxElement === "string" || typeof jsxElement === "number") {
    return String(jsxElement) as unknown as T;
  }

  throw new Error(`Unknown value: ${jsxElement}`);
}
