import { IS_SSR } from "~/const";
import { getRuntimeContext } from "~/context";

export type DestroyFn = () => Promise<void> | void;

/**
 * on destroy
 *
 * @param fn - The function to run on destroy.
 */
export function onDestroy(fn: DestroyFn) {
  if (IS_SSR) return;

  const context = getRuntimeContext();
  if (!context) {
    throw new Error("onDestroy called outside of component");
  }

  context.destroy.push(fn);
}
