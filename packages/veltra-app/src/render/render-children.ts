import { reactor } from "../state";
import { patch } from "./patch";
import { getNode, toArray } from "../util";

export function renderChildren($parent: Node, children: JSX.Element[]) {
  for (const $child of children) {
    if (typeof $child === "function") {
      let $oldNodes: Node[] = [];
      let isFirstRender = true;

      reactor(() => {
        const $newNodes = toArray($child()).map(getNode).flat();

        $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);

        isFirstRender = false;
      });
    } else {
      const $node = getNode($child);
      if (!Array.isArray($node) && $node) {
        $parent.appendChild($node);
      }
    }
  }
}
