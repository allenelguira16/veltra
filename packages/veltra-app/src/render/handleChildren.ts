import { effect } from "../state";
import { getNode, normalizeDom } from "../util";
import { patch } from "./patch";
import { mountSpecialComponent } from "./specialComponent";

export function handleChildren($parent: Node, children: JSX.Element[]) {
  for (const child of children) {
    appendChild($parent, child);
  }
}

function appendChild($parent: Node, $child: JSX.Element) {
  if (typeof $child === "function") {
    let $oldNodes: JSX.Element[] = [];

    effect(() => {
      const $newNodes = normalizeDom($child()).flat();
      $oldNodes = [...patch($parent, $oldNodes, $newNodes)];
    });
  } else if (Array.isArray($child)) {
    for (const child of $child) {
      appendChild($parent, child);
    }
  } else {
    const child = getNode($child)!;
    $parent.appendChild(child);
    mountSpecialComponent(child);
  }
}
