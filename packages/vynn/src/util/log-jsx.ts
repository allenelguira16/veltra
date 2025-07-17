import { JSX } from "~/jsx-runtime";
import { renderChildren, rootNodes } from "~/render";
import { isServer } from "~/util";

/**
 * log the JSX elements
 *
 * @param nodes - The nodes to log.
 * @returns The nodes that are not text nodes and are not in the componentRootNodes set.
 */
export function logJsx(nodes: JSX.Element) {
  if (isServer) return nodes;

  const fragment = document.createDocumentFragment();
  renderChildren(fragment, nodes);

  const newNodes = [...Array.from(fragment.childNodes).filter((node) => !rootNodes.has(node))];

  return newNodes.length === 1 ? newNodes[0] : newNodes;
}
