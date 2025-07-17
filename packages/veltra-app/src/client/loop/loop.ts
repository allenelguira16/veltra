import { jsx } from "~/jsx-runtime";
import { onDestroy, onMount } from "~/lifecycle";
import { effect, State } from "~/reactivity";
import { createTargetNode } from "~/util";

import { getSuspenseHandler } from "../async";
import { componentRootNodes } from "../mount-component";
import { newEntries, removeEntryNodes, removeOldNodes, reorderEntries } from "./util";

export type Entry<T> = {
  item: T;
  nodes: Node[];
  index: { value: number };
};

/**
 * create a loop component
 *
 * @param items - The items to loop through.
 * @returns The loop component.
 */
export function loop<T>(items: T[]) {
  const handler = getSuspenseHandler();

  return {
    each: (children: (item: T, index: State<number>) => JSX.Element) => {
      const each = items as unknown as () => T[];
      children = children as unknown as [(item: T, index: State<number>) => JSX.Element][0];

      // Use jsx to register it as a component
      // That way we can use life cycles hooks
      const component = jsx(Loop, { each, children, handler });

      return component;
    },
  };
}

export function Loop<T>({
  children,
  each,
  handler,
}: {
  each: () => T[];
  children: (item: T, index: State<number>) => JSX.Element;
  handler: ((promise: Promise<void>) => void) | undefined;
}) {
  const rootNode = createTargetNode("Loop");
  componentRootNodes.add(rootNode);

  let entries: Entry<T>[] = [];

  function reconcile(parentNode: Node, items: T[]) {
    // Remove extra
    entries = removeOldNodes(parentNode, items, entries);
    // Add new
    entries.push(...newEntries(items, entries, children));

    reorderEntries(rootNode, parentNode, entries, items);
  }

  const render = () => {
    effect(() => {
      try {
        const parentNode = rootNode.parentNode;
        if (!parentNode) return;

        const list = each();
        if (!list) return;

        reconcile(parentNode, [...list]);
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
  };

  onMount(() => {
    render();
  });

  onDestroy(() => {
    for (const entry of entries) {
      removeEntryNodes(rootNode.parentNode!, entry);
    }
  });

  return rootNode;
}
