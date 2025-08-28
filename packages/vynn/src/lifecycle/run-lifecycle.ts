import { RuntimeContext } from "~/context";
import { removeEffect } from "~/reactivity";

import { setComponentCleanup } from "./component-cleanup";

/**
 * run the life cycle
 *
 * @param context - The lifecycle context.
 * @param targetNode - The target node.
 */
export function runLifecycle(rootNode: Node, context: RuntimeContext) {
  if (!context) return;

  const cleanups: (() => Promise<void> | void)[] = [];
  setComponentCleanup(rootNode, cleanups);

  const runMounts = async () => {
    for (const mountFn of context.mount) {
      const cleanup = await mountFn();
      if (cleanup) cleanups.push(cleanup);
    }

    for (const destroyFn of context.destroy) {
      cleanups.push(destroyFn);
    }

    for (const effectFn of context.effect) {
      cleanups.push(() => Promise.resolve(removeEffect(effectFn)));
    }
  };

  queueMicrotask(() => Promise.resolve().then(runMounts));
}
