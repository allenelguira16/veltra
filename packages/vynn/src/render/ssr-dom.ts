import { isServer } from "~/util";

let renderedElement: Element[] = [];

let currentElementIndex = 0;

export function serverRenderedDOM() {
  return {
    renderedDOM: renderedElement,
    get currentDOM() {
      if (isServer) return undefined;

      return renderedElement[currentElementIndex];
    },
    get isHydrating() {
      return currentElementIndex < renderedElement.length;
    },
    nextElement: () => currentElementIndex++,
  };
}

export function setServerRenderedDOM(node: Element[]) {
  renderedElement = node;
}
