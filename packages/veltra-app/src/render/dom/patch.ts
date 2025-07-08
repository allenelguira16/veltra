import { runComponentCleanup, runLifecycle } from "~/life-cycle";
import { isNil } from "~/util";

/**
 * patch the old nodes with the new nodes
 *
 * @param parentNode - The parent node.
 * @param oldNodes - The old nodes.
 * @param newNodes - The new nodes.
 */
export function patch(
  parentNode: Node,
  oldNodes: (ChildNode | undefined)[],
  newNodes: (ChildNode | undefined)[],
  insertBeforeNode?: Node,
) {
  const maxLength = Math.max(oldNodes.length, newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const oldNode = oldNodes[i];
    const newNode = newNodes[i];

    // Add new node
    if (isNil(oldNode) && !isNil(newNode)) {
      if (insertBeforeNode) {
        parentNode.insertBefore(newNode, insertBeforeNode);
      } else {
        parentNode.appendChild(newNode);
      }
      runLifecycle(newNode);
      oldNodes[i] = newNode;
      continue;
    }

    // Remove old node
    if (!isNil(oldNode) && isNil(newNode)) {
      runComponentCleanup(oldNode);
      parentNode.removeChild(oldNode);
      oldNodes[i] = undefined;
      continue;
    }

    // If both empty, continue to next iteration
    if (isNil(oldNode) && isNil(newNode)) {
      continue;
    }

    if (oldNode && newNode) {
      runComponentCleanup(oldNode);
      runLifecycle(newNode);
      oldNode.replaceWith(newNode);
      oldNodes[i] = newNode;
      continue;
    }

    console.warn(`[veltra]: warning - unknown dom detected: `, {
      old: oldNode,
      new: newNode,
    });
  }

  return [...oldNodes];
}
