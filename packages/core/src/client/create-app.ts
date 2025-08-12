import { JSX } from "~/types";

import { renderChildren } from "./dom";
import { setParentNode } from "./dom/get-parent";
import { mountComponent } from "./mount-component";
/**
 * create root app
 *
 * @param App - The app to render.
 */
export function createApp(App: () => JSX.Element) {
  let cleanup: (() => void) | undefined;

  return {
    mount: (id: string | HTMLElement) => {
      try {
        let node: HTMLElement | null;

        if (typeof id === "string") {
          node = document.querySelector(id);
        } else {
          node = id;
        }

        if (!(node instanceof HTMLElement)) throw new Error("Node must be of type Element");

        setParentNode(node);
        const app = mountComponent(App, {}, []);
        cleanup = renderChildren(node, app);
      } finally {
        setParentNode(null);
      }
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    },
  };
}
