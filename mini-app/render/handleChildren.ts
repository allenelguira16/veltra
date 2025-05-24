import { effect } from "../state";
import { getNode, normalizeDom } from "../util";
import { patch } from "./patch";
import { mountSpecialComponent } from "./specialComponent";

export function handleChildren(children: JSX.Element[]) {
  const $fragment = document.createDocumentFragment();

  for (const child of children) {
    appendChild($fragment, child);
  }

  return $fragment;
}

function appendChild($parent: Node, child: JSX.Element) {
  if (typeof child === "function") {
    const anchor = document.createTextNode("");
    $parent.appendChild(anchor);

    let $oldNodes: JSX.Element[] = [];

    effect(() => {
      const result = child();
      const newNodes = normalizeDom(result);

      const parentNode = anchor.parentNode;
      if (!parentNode) return;

      patch(parentNode, $oldNodes, newNodes, anchor);
    });
  } else if (Array.isArray(child)) {
    // RECURSIVELY flatten nested arrays
    child.forEach((nested) => appendChild($parent, nested));
  } else {
    const childRef = getNode(child) as Node;

    $parent.appendChild(childRef);
    mountSpecialComponent(childRef);
  }
}
