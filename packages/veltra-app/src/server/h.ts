import { JSX } from "~/types";

import { applyProps } from "./apply-props";
import { renderChildren } from "./render-children";

/**
 * Create a JSX element for SSR
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element for SSR.
 */
export function h(
  type: string | ((props: Record<string, any>) => any),
  props: Record<string, any>,
  children: JSX.Element[],
) {
  if (typeof type === "function") {
    for (const key in props) {
      props[key] = props[key] instanceof Function ? props[key]() : props[key];
    }

    return type({ ...props, children });
  }

  return `<${type} ${applyProps(props)}>${renderChildren(children)}</${type}>`;
}
