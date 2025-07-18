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

  // Determine current namespace
  const currentXmlns = xmlnsStack[xmlnsStack.length - 1];

  // If this element has xmlns prop, push it, else push current namespace
  const xmlns = props.xmlns?.() ?? currentXmlns;
  xmlnsStack.push(xmlns);

  const element = createElement(type, xmlns);

  applyProps(element, props);
  renderChildren(element, children);

  xmlnsStack.pop();

  return element;
}

const xmlnsStack: (string | undefined)[] = [];

function createElement(tag: string, namespace?: string) {
  return namespace ? document.createElementNS(namespace, tag) : document.createElement(tag);
}
