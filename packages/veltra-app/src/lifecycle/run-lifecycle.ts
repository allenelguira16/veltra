import { getComponentContext } from "~/context";
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

  const cleanups: (() => Promise<void> | void)[] = [];

  setComponentCleanup(targetNode, cleanups);

  // Pass cleanups once dom is painted
  requestAnimationFrame(async () => {
    for (const mountFn of context.mount) {
      const mountCleanup = await mountFn();

      if (mountCleanup) cleanups.push(mountCleanup);
    }

    for (const destroyFn of context.destroy) {
      cleanups.push(destroyFn);
    }

    for (const effectFn of context.effect) {
      cleanups.push(() => Promise.resolve(removeEffect(effectFn)));
    }
  });
}
