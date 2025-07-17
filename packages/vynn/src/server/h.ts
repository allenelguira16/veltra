import { JSX } from "~/types";

import { applyProps } from "./apply-props";
import { renderChildrenToString } from "./render-children-to-string";

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * Create a JSX element for SSR
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element for SSR.
 */
export function h<T extends Record<string, any> & { children?: () => JSX.Element }>(
  type: string | ((props: T) => JSX.Element),
  props: Record<string, any>,
  children?: T["children"],
) {
  if (typeof type === "function") {
    for (const key in props) {
      props[key] = props[key] instanceof Function ? props[key]() : props[key];
    }

    const resolved = type({ ...props, children } as T);
    return resolved instanceof Function ? resolved() : resolved;
  }

  if (voidElements.has(type)) {
    return `<${type}${applyProps(props)}>`;
  }

  return `<${type}${applyProps(props)}>${renderChildrenToString(children)}</${type}>`;
}
