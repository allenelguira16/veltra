import { mountedPlaceholders } from "../render/mount-component";

export function cleanLog($nodes: Node[]) {
  // console.log($nodes);

  mountedPlaceholders;
  const $newNodes = [
    ...$nodes.filter(
      ($node) => !($node instanceof Text && mountedPlaceholders.has($node))
    ),
  ];

  return $newNodes.length === 1 ? $newNodes[0] : $newNodes;
}
