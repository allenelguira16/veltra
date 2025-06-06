import { setCurrentRenderingDOM } from "@veltra/app";
import { App } from "./App";

function hydrateRoot($root: HTMLElement, app: () => JSX.Element) {
  const $oldNode = $root.childNodes[0]!;

  if ($oldNode instanceof HTMLElement) {
    setCurrentRenderingDOM($oldNode);
    app();
    //   $oldNode.replaceWith(app);
  }
}

hydrateRoot(document.getElementById("app")!, App);
