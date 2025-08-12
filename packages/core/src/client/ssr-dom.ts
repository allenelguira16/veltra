let renderedDOM: Element[] = [];
let deferredRenderedDOM: Element[] = [];
let i = 0;

export function serverRenderedDOM() {
  const nextDOM = () => {
    const dom = [...renderedDOM, ...deferredRenderedDOM][i];

    if (!dom) {
      return undefined;
    }

    for (let j = 0; j < dom.childNodes.length; j++) {
      const child = dom.childNodes[j];
      if (child instanceof Text) {
        child.remove();
      }
    }

    return dom;
  };

  return {
    renderedDOM: [...renderedDOM, ...deferredRenderedDOM],
    get currentDOM() {
      return nextDOM();
    },
    get isHydrating() {
      return i < renderedDOM.length;
    },
    next: () => i++,
  };
}

export function setServerRenderedDOM(node: Element[], deferredNode: Element[]) {
  renderedDOM = node;
  deferredRenderedDOM = deferredNode;
}
