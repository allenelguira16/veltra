import { IS_SSR } from "~/const";
import { getRuntimeContext } from "~/context";

import { DestroyFn } from "./on-destroy";

export type MountFn = () => Promise<void | DestroyFn> | (void | DestroyFn);

/**
 * on mount
 *
 * @param fn - The function to run on mount.
 */
export function onMount(fn: () => Promise<DestroyFn> | DestroyFn): void;
export function onMount(fn: () => Promise<void> | void): void;
export function onMount(fn: MountFn): void {
  if (IS_SSR) return;

  const context = getRuntimeContext();
  if (context && context.mount) {
    context.mount.push(fn);
  } else {
    throw new Error("onMount called outside of component");
  }
}
