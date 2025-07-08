import { effect } from "~/reactivity";
import { getNode, toArray } from "~/util";

import { getSuspenseHandler } from "../async/suspense";
import { patch } from "./patch";

/**
 * render the children
 *
 * @param parentNode - The parent node.
 * @param children - The children to render.
 */
export function renderChildren(parentNode: Node, children: JSX.Element[], baseAnchor?: Node) {
  const cleanups: Record<"disposer" | "oldNodes", (() => void)[]> = {
    disposer: [],
    oldNodes: [],
  };

  for (const child of toArray(children)) {
    const anchor = document.createTextNode("");
    parentNode.insertBefore(anchor, baseAnchor ?? null); // insert before main anchor

    let oldNodes: (ChildNode | undefined)[] = [];
    const handler = getSuspenseHandler();

    const run = () => {
      const disposer = effect(() => {
        let newNodes: (ChildNode | undefined)[] = [];

        try {
          newNodes = toArray(getNode(child)) as ChildNode[];
        } catch (error) {
          if (error instanceof Promise) {
            if (handler) {
              handler(error);
            } else {
              queueMicrotask(() => disposer());
              error.then(() => run());
            }
          } else {
            throw error;
          }
        }

        oldNodes = patch(parentNode, oldNodes, newNodes, anchor);

        cleanups.oldNodes.push(() => {
          patch(parentNode, oldNodes, [], baseAnchor);
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
