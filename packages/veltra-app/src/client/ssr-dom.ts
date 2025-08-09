let renderedDOM: Element[] = [];
let i = 0;

export function getServerRenderedDOM() {
  try {
    const dom = renderedDOM[i];

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
  } finally {
    i++;
  }
}

export function setServerRenderedDOM(node: Element[]) {
  renderedDOM = node;
}
