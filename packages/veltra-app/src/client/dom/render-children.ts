import { runComponentCleanup, runLifecycle } from "~/lifecycle";
import { effect } from "~/reactivity";
import { JSX } from "~/types";
import { createTargetNode, isNil, toArray } from "~/util";

import { getSuspenseHandler } from "../async";
import { getNode } from "../get-node";

/**
 * Render JSX children recursively into parentNode.
 * Supports arrays, functions, and nested dynamic expressions.
 */
export function renderChildren(
  parentNode: Node,
  children: JSX.Element,
  baseAnchor: Node | null = null,
) {
  const cleanups: (() => void)[] = [];

  function renderRecursive(value: JSX.Element, anchor: Node | null): () => void {
    let nodes: Node[] = [];
    let disposers: (() => void)[] = [];

    const cleanup = () => {
      for (const node of nodes) {
        runComponentCleanup(node);
        if (node.parentNode === parentNode) {
          parentNode.removeChild(node);
        }
      }
      for (const dispose of disposers) dispose();
      nodes = [];
      disposers = [];
    };

    const disposer = effect(() => {
      const handler = getSuspenseHandler();

      try {
        cleanup();

        const children = toArray(value instanceof Function ? value() : value);

        for (const child of children) {
          if (isNil(child)) continue;

          if (typeof child === "function") {
            const childAnchor = createTargetNode("childAnchor");
            parentNode.insertBefore(childAnchor, anchor);

            const childDisposer = renderRecursive(child, childAnchor);
            disposers.push(childDisposer);
            nodes.push(childAnchor);
          } else {
            const node = getNode(child);
            runLifecycle(node);
            parentNode.insertBefore(node, anchor);
            nodes.push(node);
          }
        }
      } catch (error) {
        if (error instanceof Promise) {
          if (handler) {
            handler(error);
          }
        } else {
          throw error;
        }
      }
    });

    return () => {
      disposer();
      cleanup();
    };
  }

  const dispose = renderRecursive(children, baseAnchor);
  cleanups.push(dispose);

  return () => {
    for (const c of cleanups) c();
  };
}
