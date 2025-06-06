import { isNil } from "../util";
import { runDestroy } from "../life-cycle";

function getNode(vNode: Node): Node {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  return vNode as Node;
}

export function patch(
  $parent: Node,
  $oldNodes: Node[],
  $newNodes: Node[],
  isFirstRender: boolean
) {
  const maxLength = Math.max($oldNodes.length, $newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const $oldNode = $oldNodes[i];
    const $newNode = $newNodes[i];

    if (isFirstRender) {
      if (isNil($newNode)) continue;

      const node = getNode($newNode)!;
      $parent.appendChild(node);
      $oldNodes[i] = node;

      continue;
    }

    // Add new node
    if (isNil($oldNode) && !isNil($newNode)) {
      const node = getNode($newNode);
      $parent.appendChild(node);
      $oldNodes[i] = node;
      continue;
    }

    //
    runDestroy($oldNode);

    // Remove new node
    if (!isNil($oldNode) && isNil($newNode)) {
      $parent.removeChild($oldNodes[i]);
      $oldNodes.splice(i, 1);
      i--;
      continue;
    }

    // If both empty, continue to next iteration
    if (isNil($oldNode) && isNil($newNode)) {
      continue;
    }

    // Replace node with node
    const $node = getNode($newNode);
    ($oldNode as ChildNode).replaceWith($node);
    $oldNodes[i] = $node;
  }

  return [...$oldNodes];
}
