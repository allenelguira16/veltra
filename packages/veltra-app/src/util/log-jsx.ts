import { componentRootNodes, renderChildren } from "~/client";

/**
 * log the JSX elements
 *
 * @param nodes - The nodes to log.
 * @returns The nodes that are not text nodes and are not in the componentRootNodes set.
 */
export function logJsx(nodes: Node[]) {
  const fragment = document.createDocumentFragment();
  renderChildren(fragment, nodes);

  const newNodes = [
    ...Array.from(fragment.childNodes).filter((node) => !componentRootNodes.has(node)),
  ];

  return newNodes.length === 1 ? newNodes[0] : newNodes;
}
