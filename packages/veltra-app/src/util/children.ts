import { getNode } from "./get-node";
import { memo } from "./memo";

export function resolveChildren(child: JSX.Element) {
  const item = memo(() => getNode(child));

  return item;
}
