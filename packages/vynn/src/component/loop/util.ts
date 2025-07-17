import { runComponentCleanup } from "~/lifecycle";
import { State, state, untrack } from "~/reactivity";
import { JSX } from "~/types";
import { toArray } from "~/util";

import { getNode } from "../../render/get-node";
import { Entry } from "./loop";

/**
 * remove the entry nodes
 *
 * @param parentNode - The parent node.
 * @param entry - The entry to remove.
 */
export function removeEntryNodes<T>(parentNode: Node, entry: Entry<T>) {
  for (const node of entry.nodes) {
    if (parentNode.contains(node)) {
      runComponentCleanup(node);
      parentNode.removeChild(node);
    }
  }
}

/**
 * insert the nodes
 *
 * @param parentNode - The parent node.
 * @param nodes - The nodes to insert.
 * @param referenceNode - The reference node.
 */
export function insertNodes(parentNode: Node, nodes: Node[], referenceNode: Node | null) {
  for (const node of nodes) {
    parentNode.insertBefore(node, referenceNode);
  }
}

/**
 * reorder the entries
 *
 * @param rootNode - The root node.
 * @param parentNode - The parent node.
 * @param entries - The entries to reorder.
 * @param items - The items to reorder.
 */
export function reorderEntries<T>(
  rootNode: Node,
  parentNode: Node,
  entries: Entry<T>[],
  items: T[],
) {
  const placeCounts = new Map<T, number>();
  let ref: Node | null = rootNode.nextSibling;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    placeCounts.set(item, (placeCounts.get(item) || 0) + 1);
    let count = 0;
    const entry = entries.find((e) => e.item === item && ++count === placeCounts.get(item));
    if (!entry) continue;
    untrack(() => (entry.index.value = i));
    insertNodes(parentNode, entry.nodes, ref);
    ref = entry.nodes[entry.nodes.length - 1].nextSibling;
  }
}

/**
 * count the occurrences of an item in a list
 *
 * @param list - The list to count the occurrences of.
 * @returns The occurrences of the item in the list.
 */
export function countOccurrences<T>(list: T[]) {
  const counts = new Map<T, number>();
  for (const item of list) counts.set(item, (counts.get(item) || 0) + 1);
  return counts;
}

/**
 * remove the old nodes
 *
 * @param parentNode - The parent node.
 * @param items - The items to remove.
 * @param entries - The entries to remove.
 */
export function removeOldNodes<T>(parentNode: Node, items: T[], entries: Entry<T>[]) {
  const newCounts = countOccurrences(items);
  const oldCounts = countOccurrences(entries.map((e) => e.item));

  return entries.filter((entry) => {
    if ((oldCounts.get(entry.item) ?? 0) > (newCounts.get(entry.item) ?? 0)) {
      removeEntryNodes(parentNode, entry);
      oldCounts.set(entry.item, (oldCounts.get(entry.item) ?? 0) - 1);
      return false;
    }
    return true;
  });
}

/**
 * create new entries
 *
 * @param items - The items to create new entries for.
 * @param entries - The entries to create new entries for.
 * @param children - The children to create new entries for.
 * @param idCounter - The id counter.
 * @returns The new entries.
 */
export function newEntries<T>(
  items: T[],
  entries: Entry<T>[],
  children: (item: T, index: State<number>) => JSX.Element,
) {
  const addedEntries: Entry<T>[] = [];
  const seenCounts = new Map<T, number>();
  for (const item of items) {
    seenCounts.set(item, (seenCounts.get(item) || 0) + 1);
    const exists =
      entries.filter((e) => e.item === item).length +
      addedEntries.filter((e) => e.item === item).length;
    if (exists < (seenCounts.get(item) || 0)) {
      const indexState = state(-1);
      const nodes = toArray(getNode(children(item, indexState))) as Node[];
      addedEntries.push({
        item,
        nodes,
        index: indexState,
      });
    }
  }

  return addedEntries;
}
