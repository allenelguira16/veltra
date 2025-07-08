import { getComponentContext } from "~/context/runtime-context";
import { removeEffect } from "~/reactivity";

import { setComponentCleanup } from "./component-cleanup";

/**
 * run the life cycle
 *
 * @param context - The lifecycle context.
 * @param targetNode - The target node.
 */
export function runLifecycle(targetNode: Node) {
  const context = getComponentContext(targetNode);

  if (!context) return;

  const cleanups: (() => void)[] = [];

  setComponentCleanup(targetNode, cleanups);

  // Pass cleanups once dom is painted
  queueMicrotask(() => {
    cleanups.push(
      ...context.destroy,
      ...context.mount.map((fn) => fn()).filter((c) => !!c),
      ...context.effect.map((fn) => () => removeEffect(fn)),
    );
  });
}
