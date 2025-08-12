import { effect } from "~/reactivity";
import { JSX } from "~/types";
import { toArray } from "~/util";
import { isNil } from "~/util";

import { getSuspenseHandler } from "../async";
import { patch } from "./patch";

/**
 * render the children
 *
 * @param parentNode - The parent node.
 * @param children - The children to render.
 */
export function renderChildren(parentNode: Node, rawChildren: JSX.Element, baseAnchor?: Node) {
  const cleanups: Record<"disposer" | "oldNodes", (() => void)[]> = {
    disposer: [],
    oldNodes: [],
  };

  // const children = toArray(rawChildren instanceof Function ? rawChildren() : rawChildren);
  const children = toArray(rawChildren);
  const oldNodes: (ChildNode | undefined)[][] = [];
  const newNodes: (ChildNode | undefined)[][] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // const anchor = createTargetNode("renderChildren");
    // parentNode.insertBefore(anchor, baseAnchor ?? null);

    const handler = getSuspenseHandler();

    const run = () => {
      const disposer = effect(() => {
        oldNodes[i] ??= [];
        newNodes[i] ??= [];
        try {
          newNodes[i] = toArray(getNode<ChildNode>(child)).flat();
        } catch (error) {
          if (error instanceof Promise) {
            if (handler) {
              handler(error);
            } else {
              queueMicrotask(disposer);
              error.then(run);
            }
          } else {
            throw error;
          }
        }

        const insertionAnchor = oldNodes[i - 1]?.find(
          (i) => i instanceof HTMLElement,
        )?.nextElementSibling;
        const anchor = baseAnchor ?? insertionAnchor ?? undefined;

        oldNodes[i] = patch(parentNode, oldNodes[i], newNodes[i], anchor);

        cleanups.oldNodes.push(() => {
          patch(parentNode, oldNodes[i], []);
        });
      });

      cleanups.disposer.push(() => {
        disposer();
      });
    };

    run();
  }

  return () => {
    cleanups.disposer.forEach((cleanup) => cleanup());
    cleanups.oldNodes.forEach((cleanup) => cleanup());
  };
}

/**
 * get the node for a JSX element
 *
 * @param jsxElement - The JSX element to get the node for.
 * @returns The node for the JSX element.
 */
export function getNode<T extends Node | undefined>(jsxElement: JSX.Element): T | T[] {
  if (jsxElement instanceof Node) {
    return jsxElement as T;
  }

  if (isNil(jsxElement)) {
    return undefined as T;
  }

  if (typeof jsxElement === "function") {
    return getNode(jsxElement());
  }

  if (Array.isArray(jsxElement)) {
    return jsxElement.map(getNode).flat() as T[];
  }

  return document.createTextNode(String(jsxElement)) as unknown as T;
}
