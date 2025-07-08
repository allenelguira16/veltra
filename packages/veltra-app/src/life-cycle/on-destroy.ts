import { getRuntimeContext } from "~/context/runtime-context";

export type DestroyFn = () => void;

/**
 * on destroy
 *
 * @param fn - The function to run on destroy.
 */
export function onDestroy(fn: () => void) {
  const context = getRuntimeContext();
  if (context && context.destroy) {
    context.destroy.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}
