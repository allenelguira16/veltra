import { isServer } from "~/util";

let renderedNodes: Node[] = [];
let currentIndex = 0;

export function ssrDom() {
  return {
    renderedNodes,
    get currentNode() {
      if (isServer) return undefined;

      return renderedNodes[currentIndex];
    },
    get isHydrating() {
      return !!renderedNodes[currentIndex];
    },
    next: () => currentIndex++,
  };
}

export function setSsrDom(node: Node[]) {
  renderedNodes = node;
}
