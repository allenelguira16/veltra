import { JSX } from "~/types";

import { ssrDom } from "../client/ssr-dom";
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
export function h<T extends Record<string, any> & { children?: (...args: any[]) => JSX.Element }>(
  type: string | ((props: T) => JSX.Element),
  props: Omit<T, "children">,
  children: T["children"],
  key?: () => string,
) {
  if (typeof type === "function") {
    return mountComponent(type, props, children, key);
  }

  if (type === "html") {
    return children;
  }

  xmlnsStack.push(props.xmlns?.() ?? xmlnsStack[xmlnsStack.length - 1]);

  const element = createElement(type);

  applyProps(element, props);
  renderChildren(element, children);

  xmlnsStack.pop();
  return element;
}

const xmlnsStack: (string | undefined)[] = [];

function createElement(tag: string) {
  const { currentNode, next } = ssrDom();

  if (currentNode instanceof Element) {
    try {
      if (currentNode.tagName.toLocaleLowerCase() !== tag) {
        throw new Error(
          "Hydration mismatch because the initial UI does not match what was rendered on the server",
        );
      }

      return currentNode;
    } finally {
      next();
    }
  }

  const currentXmlns = xmlnsStack[xmlnsStack.length - 1];
  return currentXmlns ? document.createElementNS(currentXmlns, tag) : document.createElement(tag);
}
