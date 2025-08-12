import { JSX } from "~/types";

import { applyProps, renderChildren } from "./dom";
import { setParentNode } from "./dom/get-parent";
import { mountComponent } from "./mount-component";
import { serverRenderedDOM } from "./ssr-dom";

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
) {
  try {
    if (typeof type === "function") {
      return mountComponent(type, { key, ...props }, children);
    }

    xmlnsStack.push(props.xmlns?.() ?? xmlnsStack[xmlnsStack.length - 1]);

    const element = createElement(type);

    setParentNode(element);

    applyProps(element, props);
    renderChildren(element, children);

    xmlnsStack.pop();
    return element;
  } finally {
    setParentNode(null);
  }
}

const xmlnsStack: (string | undefined)[] = [];

function createElement(tag: string) {
  const { currentDOM, isHydrating, next } = serverRenderedDOM();

  if (isHydrating && currentDOM) {
    try {
      return currentDOM;
    } finally {
      next();
    }
  }

  const currentXmlns = xmlnsStack[xmlnsStack.length - 1];
  return currentXmlns ? document.createElementNS(currentXmlns, tag) : document.createElement(tag);
}
