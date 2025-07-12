import { componentRootNodes } from "~/render";

/**
 * log the JSX elements
 *
 * @param nodes - The nodes to log.
 * @returns The nodes that are not text nodes and are not in the componentRootNodes set.
 */
export function logJsx(nodes: Node[]) {
  const newNodes = [
    ...nodes.filter((node) => !(node instanceof Text && componentRootNodes.has(node))),
  ];

  return newNodes.length === 1 ? newNodes[0] : newNodes;
}
