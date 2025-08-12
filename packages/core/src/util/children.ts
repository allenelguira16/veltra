import { JSX } from "~/types";

import { getNode } from "../client/get-node";
import { memo } from "./memo";

export function resolveChildren(child: JSX.Element) {
  const item = memo(() => getNode(child));

  return item;
}
