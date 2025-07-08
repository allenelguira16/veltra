import { MATH_ML_TAGS, SVG_TAGS } from "~/const";
import { Fragment } from "~/jsx-runtime";

import { applyProps, renderChildren } from "./dom";
import { mountComponent } from "./mount-component";

/**
 * create a JSX element
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
export function h(
  type: string | ((props: Record<string, any>) => any),
  props: Record<string, any>,
  children: JSX.Element[],
  key?: () => string,
): Node | Node[] | (() => Node[]) {
  if (type === Fragment) {
    return children as Node[];
  }

  if (typeof type === "function") {
    return mountComponent(type, { key, ...props }, children);
  }

  const element = createElement(type, props.xmlns);

  applyProps(element, props);
  renderChildren(element, children);

  return element;
}

function createElement(tag: string, namespace?: string) {
  if ((SVG_TAGS.has(tag) || MATH_ML_TAGS.has(tag)) && namespace) {
    return document.createElementNS(namespace, tag) as HTMLElement;
  }

  return document.createElement(tag);
}
