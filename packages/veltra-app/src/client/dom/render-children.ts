import { effect } from "~/reactivity";
import { createTargetNode, toArray } from "~/util";

import { getSuspenseHandler } from "../async";
import { getNode } from "../get-node";
import { patch } from "./patch";

/**
 * render the children
 *
 * @param parentNode - The parent node.
 * @param children - The children to render.
 */
export function renderChildren(parentNode: Node, rawChildren: JSX.Element[], baseAnchor?: Node) {
  const cleanups: Record<"disposer" | "oldNodes", (() => void)[]> = {
    disposer: [],
    oldNodes: [],
  };

  const children = toArray(rawChildren instanceof Function ? rawChildren() : rawChildren);

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const anchor = createTargetNode("renderChildren");
    parentNode.insertBefore(anchor, baseAnchor ?? null);

    const handler = getSuspenseHandler();

    const run = () => {
      let oldNodes: (ChildNode | undefined)[] = [];
      let newNodes: (ChildNode | undefined)[] = [];

      const disposer = effect(() => {
        try {
          newNodes = toArray(getNode<ChildNode>(child)).flat();
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

        oldNodes = patch(parentNode, oldNodes, newNodes, anchor);

        cleanups.oldNodes.push(() => {
          patch(parentNode, oldNodes, [], anchor);
          anchor.remove();
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
