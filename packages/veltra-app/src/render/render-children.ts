import { wrapRenderEffect } from "../state";
import { patch } from "./patch";
import { getNode, normalizeDom } from "../util";

export function renderChildren($parent: Node, children: JSX.Element[]) {
  for (const child of children) {
    appendChild($parent, child);
  }
}

function appendChild($parent: Node, $child: JSX.Element) {
  if (typeof $child === "function") {
    let $oldNodes: Node[] = [];
    let isFirstRender = true;

    wrapRenderEffect(() => {
      const $newNodes = normalizeDom($child())
        .map((c) => (c instanceof Function ? c() : c))
        .flat(Infinity);

      $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);

      isFirstRender = false;
    });
  } else {
    $parent.appendChild(getNode($child)!);
  }
}
