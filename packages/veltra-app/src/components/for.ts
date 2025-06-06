// Types
import { reactor, state } from "../state";
import { onDestroy, onMount, runDestroy } from "../life-cycle";
import { mountedPlaceholders } from "../render/mount-component";
import { getNode, toArray } from "../util";

type ForProps<T> = {
  items: T[];
  fallback?: JSX.Element;
  children: (item: T, index: { value: number }) => JSX.Element;
};

type ForPropsReal<T> = {
  items: () => T[];
  fallback?: () => () => JSX.Element;
  children: [() => (item: T, index: { value: number }) => JSX.Element];
};

type Entry<T> = {
  id: number;
  item: T;
  nodes: Node[];
  index: { value: number };
};

// Helpers
function removeEntryNodes<T>($parent: Node, entry: Entry<T>) {
  for (const node of entry.nodes) {
    if ($parent.contains(node)) {
      runDestroy(node);
      $parent.removeChild(node);
    }
  }
}

function insertNodes($parent: Node, nodes: Node[], referenceNode: Node | null) {
  for (const node of nodes) {
    $parent.insertBefore(node, referenceNode);
  }
}

export function For<T>(props: ForProps<T>) {
  const {
    items: each,
    children: [_children],
    fallback: _fallback,
  } = props as unknown as ForPropsReal<T>;

  const $placeholder = document.createTextNode("");
  const children = _children();
  const fallback = _fallback?.();

  let entries: Entry<T>[] = [];
  let fallbackInserted = false;
  let fallbackNodes: Node[] = [];
  let idCounter = 0;

  function reconcile($parent: Node, items: T[]) {
    const newCounts = countOccurrences(items);
    const oldCounts = countOccurrences(entries.map((e) => e.item));

    // Remove extra
    entries = entries.filter((entry) => {
      if ((oldCounts.get(entry.item) ?? 0) > (newCounts.get(entry.item) ?? 0)) {
        removeEntryNodes($parent, entry);
        oldCounts.set(entry.item, (oldCounts.get(entry.item) ?? 0) - 1);
        return false;
      }
      return true;
    });

    // Add new
    const addedEntries: Entry<T>[] = [];
    const seenCounts = new Map<T, number>();
    for (const item of items) {
      seenCounts.set(item, (seenCounts.get(item) || 0) + 1);
      const exists =
        entries.filter((e) => e.item === item).length +
        addedEntries.filter((e) => e.item === item).length;
      if (exists < (seenCounts.get(item) || 0)) {
        const indexState = state(-1);
        const nodes = toArray(children(item, indexState)) as Node[];
        addedEntries.push({ id: idCounter++, item, nodes, index: indexState });
      }
    }
    entries.push(...addedEntries);

    reorderEntries($parent, items);
    handleFallback($parent, items);
  }

  function reorderEntries($parent: Node, items: T[]) {
    const placeCounts = new Map<T, number>();
    let ref: Node | null = $placeholder.nextSibling;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      placeCounts.set(item, (placeCounts.get(item) || 0) + 1);
      let count = 0;
      const entry = entries.find(
        (e) => e.item === item && ++count === placeCounts.get(item)
      );
      if (!entry) continue;
      entry.index.value = i;
      insertNodes($parent, entry.nodes, ref);
      ref = entry.nodes[entry.nodes.length - 1].nextSibling;
    }
  }

  function handleFallback($parent: Node, items: T[]) {
    if (!items.length && fallback && !fallbackInserted) {
      fallbackNodes = toArray(fallback()).map(getNode).flat() as Node[];
      insertNodes($parent, fallbackNodes, $placeholder.nextSibling);
      fallbackInserted = true;
    } else if (items.length && fallbackInserted) {
      fallbackNodes.forEach((node) => {
        runDestroy(node);
        if ($parent.contains(node)) $parent.removeChild(node);
      });
      fallbackNodes = [];
      fallbackInserted = false;
    }
  }

  function countOccurrences(list: T[]) {
    const counts = new Map<T, number>();
    for (const item of list) counts.set(item, (counts.get(item) || 0) + 1);
    return counts;
  }

  onMount(() => {
    reactor(() => {
      const $parent = $placeholder.parentNode;
      if (!$parent) return;
      reconcile($parent, each());
    });
  });

  onDestroy(() => {
    for (const entry of entries) {
      for (const $node of entry.nodes) {
        $placeholder.parentNode?.removeChild($node);
      }
    }
  });

  mountedPlaceholders.add($placeholder);
  return $placeholder;
}
