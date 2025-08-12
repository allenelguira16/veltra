import { JSX } from "~/types";
import { isNil, toArray } from "~/util";

/**
 * Handle the children of the element for SSR
 *
 * @param children - The children of the element.
 * @returns The transformed children.
 */
export function renderChildren(children: JSX.Element) {
  const transformedChildren: string[] = [];

  for (const child of toArray(getNode(children)).flat()) {
    if (child) transformedChildren.push(child);
  }

  return transformedChildren.join("");
}

/**
 * get the node for a JSX element
 *
 * @param jsxElement - The JSX element to get the node for.
 * @returns The node for the JSX element.
 */
export function getNode(jsxElement: JSX.Element): undefined | string | (string | undefined)[] {
  if (typeof jsxElement === "string") {
    return jsxElement;
  }

  if (isNil(jsxElement)) {
    return undefined;
  }

  if (jsxElement instanceof Function) {
    return getNode(jsxElement());
  }

  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode).flat();
  }

  return String(jsxElement);
}
