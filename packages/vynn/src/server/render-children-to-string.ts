import { JSX } from "~/types";
import { isNil, toArray } from "~/util";

import { getNode } from "./get-node";

const skipWrappingTags = new Set(["title", "meta", "script", "style"]);

/**
 * Handle the children of the element for SSR
 *
 * @param children - The children of the element.
 * @returns The transformed children.
 */
export function renderChildrenToString(parent: string, children: JSX.Element) {
  function renderRecursive(value: JSX.Element) {
    const transformedChildren: string[] = [];

    const resolvedChildren = value instanceof Function ? value() : value;
    const children = toArray(resolvedChildren);

    for (const child of children) {
      if (isNil(child)) continue;

      if (typeof child === "function") {
        transformedChildren.push(renderRecursive(child));
      } else {
        const resolved = getNode(child, skipWrappingTags.has(parent));
        transformedChildren.push(resolved);
      }
    }
    return transformedChildren.join("");
  }

  return renderRecursive(children);
}
