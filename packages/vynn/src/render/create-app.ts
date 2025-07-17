import { JSX } from "~/types";

import { renderChildren } from "./dom";
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
      let node: HTMLElement | null;

      if (typeof id !== "string") node = id;
      else node = document.querySelector(id);

      if (!(node instanceof HTMLElement)) throw new Error("Node must be of type Element");

      const app = mountComponent(App);
      cleanup = renderChildren(node, app);
    },
    unmount: () => {
      if (!cleanup) throw new Error("Can only unmount if the app is mounted");
      cleanup();
    },
  };
}
