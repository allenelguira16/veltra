let renderedElement: Element[] = [];

let currentElementIndex = 0;

export function serverRenderedDOM() {
  return {
    renderedDOM: renderedElement,
    get currentDOM() {
      const dom = renderedElement[currentElementIndex];

      if (!dom) return undefined;

      for (let j = 0; j < dom.childNodes.length; j++) {
        const child = dom.childNodes[j];
        if (child instanceof Text) {
          child.remove();
        }
      }

      return dom;
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
