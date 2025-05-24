import { getNode, isNil } from "../util";
import {
  mountSpecialComponent,
  unmountSpecialComponent,
} from "./specialComponent";

export function patch(
  $parent: Node,
  $oldNodes: (JSX.Element | (() => JSX.Element))[],
  $newNodes: any[],
  $anchor: Node | null = null
) {
  const maxLength = Math.max($oldNodes.length, $newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const $oldNode = getNode($oldNodes[i]);
    const $newNode = getNode($newNodes[i]);

    // Remove old node if new one doesn't exist
    if (!isNil($oldNode) && isNil($newNode) && $oldNode instanceof Node) {
      unmountSpecialComponent($oldNode);
      $parent.removeChild($oldNode);
      $oldNodes.splice(i, 1);
      i--;
      continue;
    }

    // Add new node if cached one doesn't exist
    if (isNil($oldNode) && !isNil($newNode)) {
      $parent.insertBefore($newNode, $anchor);
      $oldNodes[i] = $newNode;
      mountSpecialComponent($newNode);
      continue;
    }

    // Update existing node
    if (isNil($oldNode) || isNil($newNode)) {
      // Only proceed if both nodes exist
      continue;
    }

    // Handle text-to-text update
    if ($oldNode instanceof Text && $newNode instanceof Text) {
      $oldNode.textContent = $newNode.textContent;
      continue;
    }

    // From here, we know cachedNode is an HTMLElement
    if (!($oldNode instanceof HTMLElement)) {
      continue;
    }

    // Case: HTMLElement → HTMLElement
    if ($newNode instanceof HTMLElement) {
      const isSame = $oldNode.isEqualNode($newNode);

      if (!isSame) {
        $oldNode.replaceWith($newNode);
        $oldNodes[i] = $newNode;
      }

      continue;
    }

    // Case: HTMLElement → Text
    if ($newNode instanceof Text) {
      $oldNode.replaceWith($newNode);
      $oldNodes[i] = $newNode;
    }

    // handleSpecialComponent(result);
  }
}
