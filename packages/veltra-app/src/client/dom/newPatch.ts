import { runComponentCleanup } from "~/lifecycle";
import { isNil } from "~/util";

import { componentRootNodes } from "../mount-component";
import { copyEventListeners } from "./event-registry";

export function newPatch(
  parentNode: Node,
  oldNodes: (ChildNode | undefined)[],
  newNodes: (ChildNode | undefined)[],
) {
  const maxLength = Math.max(oldNodes.length, newNodes.length);

  for (let i = 0; i < maxLength; i++) {
    const oldNode = oldNodes[i];
    const newNode = newNodes[i];

    runComponentCleanup(oldNode!);

    // Add new node
    if (isNil(oldNode) && !isNil(newNode)) {
      parentNode.appendChild(newNode);
      oldNodes[i] = newNode;
      continue;
    }

    // Remove old node
    if (!isNil(oldNode) && isNil(newNode)) {
      runComponentCleanup(oldNode);
      // parentNode.removeChild(oldNode);
      oldNode.remove();
      oldNodes[i] = undefined;
      continue;
    }

    if (isNil(oldNode) && isNil(newNode)) {
      continue;
    }

    if (oldNode && newNode) {
      const isComponentRoot = componentRootNodes.has(oldNode);
      copyEventListeners(newNode as HTMLElement, oldNode as HTMLElement);

      // If component root node, always replace (especially important for text nodes)
      if (isComponentRoot) {
        replaceNode();
        continue;
      }

      // Different node type: replace
      if (oldNode.nodeType !== newNode.nodeType) {
        replaceNode();
        continue;
      }

      if (oldNode.nodeType === Node.TEXT_NODE) {
        // Text node: update content if not component root
        if (oldNode.textContent !== newNode.textContent) {
          oldNode.textContent = newNode.textContent;
        }
      } else if ((oldNode as Element).tagName === (newNode as Element).tagName) {
        // Same tag: patch attributes and children
        patchElement(oldNode as Element, newNode as Element);
      } else {
        // Different tag name: must replace
        replaceNode();
      }
    }

    function replaceNode() {
      parentNode.replaceChild(newNode!, oldNode!);
      oldNodes[i] = newNode;
    }
  }

  return [...oldNodes];
}

function patchElement(oldEl: Element, newEl: Element) {
  // Update attributes
  for (const attr of Array.from(newEl.attributes)) {
    if (oldEl.getAttribute(attr.name) !== attr.value) {
      oldEl.setAttribute(attr.name, attr.value);
    }
  }

  // Remove attributes not present in newEl
  for (const attr of Array.from(oldEl.attributes)) {
    if (!newEl.hasAttribute(attr.name)) {
      oldEl.removeAttribute(attr.name);
    }
  }

  // Patch children recursively
  newPatch(oldEl, Array.from(oldEl.childNodes), Array.from(newEl.childNodes));
}
