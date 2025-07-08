import { effect, untrack } from "~/reactivity"; // needed to push an owner
import { toArray } from "~/util";

import { renderChildren } from "./dom";

/**
 * create root app
 *
 * @param App - The app to render.
 */
export function createApp(App: () => JSX.Element) {
  let cleanup: (() => void) | undefined;

  return {
    mount: (id: string) => {
      const node = document.querySelector(id);
      if (!(node instanceof Element)) throw new Error("Node must be of type Element");

      effect(() => {
        cleanup = renderChildren(node, toArray(untrack(App)));
      });
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    },
  };
}
