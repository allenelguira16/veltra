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

      const [serverRenderedDOM, deferredServerRenderedDOM] = flattenDOMContents(node);
      setServerRenderedDOM(serverRenderedDOM, deferredServerRenderedDOM);
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

function flattenDOMContents(root: HTMLElement): [Element[], Element[]] {
  const result: Element[] = [];
  const deferred: Element[] = [];

  let inSpecialBlock = false;

  for (const child of [...root.childNodes]) {
    // clone array so removal doesn't mess iteration
    flattenNode(
      child,
      result,
      deferred,
      () => (inSpecialBlock = true),
      () => (inSpecialBlock = false),
      () => inSpecialBlock,
    );
  }

  return [result, deferred];
}

function flattenNode(
  node: Node,
  result: Element[],
  deferred: Element[],
  startBlock: () => void,
  endBlock: () => void,
  isInBlock: () => boolean,
) {
  if (node.nodeType === Node.COMMENT_NODE) {
    const text = (node as Comment).data.trim();
    if (text === "start") startBlock();
    else if (text === "end") endBlock();

    node.parentNode?.removeChild(node); // remove comment from DOM
    return;
  }

  if (node instanceof HTMLElement) {
    if (isInBlock()) {
      deferred.push(node);
    } else {
      result.push(node);
    }

    for (const child of [...node.childNodes]) {
      flattenNode(child, result, deferred, startBlock, endBlock, isInBlock);
    }
  }
}
