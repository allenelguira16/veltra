import { getSuspenseHandler } from "~/component";
import { runComponentCleanup } from "~/lifecycle";
import { effect } from "~/reactivity";
import { JSX } from "~/types";
import { isNil, toArray } from "~/util";

import { getNode } from "../get-node";

/**
 * Render JSX children recursively into parentNode.
 * Supports arrays, functions, and nested dynamic expressions.
 */
export function renderChildren(parentNode: Node, children: JSX.Element) {
  const cleanups: (() => void)[] = [];

  function renderRecursive(value: JSX.Element, parentAnchor: Node | null): () => void {
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

    const handler = getSuspenseHandler();
    const disposer = effect(() => {
      try {
        cleanup();

        const resolvedChildren = value instanceof Function ? value() : value;
        const children = toArray(resolvedChildren);

        for (const child of children) {
          if (isNil(child)) continue;

          if (typeof child === "function") {
            const anchor = document.createTextNode("");
            parentNode.insertBefore(anchor, parentAnchor);

            const childDisposer = renderRecursive(child, anchor);
            disposers.push(childDisposer);
            nodes.push(anchor);
          } else {
            const node = getNode(child);

            parentNode.insertBefore(node, parentAnchor);
            nodes.push(node);
          }
        }
      } catch (error) {
        if (error instanceof Promise) {
          handler?.(error);
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

  const dispose = renderRecursive(children, null);
  cleanups.push(dispose);

  return () => {
    console.log("run");
    for (const c of cleanups) c();
  };
}
