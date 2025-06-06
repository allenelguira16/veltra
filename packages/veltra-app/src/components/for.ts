import { normalizeDom } from "../util";
import { effect, state } from "../state";
import { onDestroy, onMount } from "../life-cycle";
import { mountedPlaceholders } from "../render/mount-component";
import { patch } from "../render/patch";

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

function onNodeReattached($node: Node, callback: () => void) {
  // Create a MutationObserver instance
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      // Check for added nodes
      for (const node of mutation.addedNodes) {
        if (node === $node) {
          // observer.disconnect();
          callback();
          break;
        }
      }
    }
  });

  // callback();
  // Start observing the document body for child additions/removals
  observer.observe($node.parentNode!, { childList: true, subtree: true });
}

export function For<T>(props: ForProps<T>) {
  const {
    items: each,
    children: [_children],
    fallback: _fallback,
  } = props as unknown as ForPropsReal<T>;

  const $placeholder = document.createTextNode("");
  let parent = state<ParentNode | null>(null);
  const fallback = _fallback?.();
  const children = _children();

  let isFirstRender = true;
  let $oldNodes: Node[] = [];
  let $fallbackNodes: Node[] = [];

  function render() {
    effect(() => {
      const $parent = parent.value;
      if (!$parent) return;

      const items = each();
      let $newNodes: Node[] = [];

      if (!items.length && fallback) {
        const $nodes = normalizeDom(fallback()) as Node[];
        for (const $node of $nodes) {
          $parent.appendChild($node);
          $newNodes.push($node);
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const $nodes = normalizeDom(children(item, { value: i })) as Node[];
          $newNodes = [...$newNodes, ...$nodes.flat(Infinity)];
        }
      }

      $oldNodes = patch($parent, $oldNodes, $newNodes, isFirstRender);

      isFirstRender = false;
    });
  }

  onMount(() => {
    parent.value = $placeholder.parentNode;

    if (parent.value) {
      onNodeReattached($placeholder, () => {
        render();
      });
    }
  });

  onDestroy(() => {
    for (const node of $oldNodes) {
      (node as ChildNode).remove();
    }

    for (const $node of $fallbackNodes) {
      ($node as ChildNode).remove();
    }

    $fallbackNodes = [];
    $oldNodes = [];
  });

  render();

  mountedPlaceholders.add($placeholder);
  return $placeholder;
}
