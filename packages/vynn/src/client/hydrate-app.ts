import { mountComponent, renderChildren } from "~/render";
import { JSX } from "~/types";

import { setServerRenderedDOM } from "../render/ssr-dom";

/**
 * create root app
 *
 * @param App - The app to render.
 */
export function hydrateApp(App: () => JSX.Element) {
  let cleanup: (() => void) | undefined;

  return {
    mount: (id: string | HTMLElement) => {
      let node: HTMLElement | null;

      if (typeof id !== "string") node = id;
      else node = document.querySelector(id);

      if (!(node instanceof HTMLElement)) throw new Error("Node must be of type Element");

      const serverRenderedDOM = flattenDOMContents(node);
      setServerRenderedDOM(serverRenderedDOM);

      const app = mountComponent(App);
      cleanup = renderChildren(node, () => app);
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    },
  };
}

function flattenDOMContents(root: HTMLElement) {
  const dom: Element[] = [];

  for (const child of [...root.childNodes]) {
    // clone array so removal doesn't mess iteration
    flattenNode(child, dom);
  }

  return dom;
}

function flattenNode(node: Node, dom: Element[]) {
  if (node instanceof HTMLElement) {
    dom.push(node);

    for (const child of [...node.childNodes]) {
      flattenNode(child, dom);
    }
  }
}
