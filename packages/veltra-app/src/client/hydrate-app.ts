import { JSX } from "~/types";

import { renderChildren } from "./dom";
import { mountComponent } from "./mount-component";
import { setServerRenderedDOM } from "./ssr-dom";

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

      if (typeof id === "string") {
        node = document.querySelector(id);
      } else {
        node = id;
      }

      if (!(node instanceof HTMLElement)) throw new Error("Node must be of type Element");

      setServerRenderedDOM(flattenDOMContents(node));
      // if (node.firstElementChild instanceof HTMLElement) {
      //   setCurrentRenderingDOM(node.firstElementChild);
      // }
      const app = mountComponent(App, {}, []);
      cleanup = renderChildren(node, () => app);
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    },
  };
}

function flattenDOMContents(root: HTMLElement): Element[] {
  const result: Element[] = [];

  for (const child of root.childNodes) {
    flattenNode(child, result);
  }

  return result;
}

function flattenNode(node: Node, result: Element[]) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    result.push(node as Element);
    for (const child of node.childNodes) {
      flattenNode(child, result);
    }
  }
}
