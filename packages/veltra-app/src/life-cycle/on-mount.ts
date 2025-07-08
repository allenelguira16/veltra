import { getRuntimeContext } from "~/context/runtime-context";

export type MountFn = () => void | (() => void);

/**
 * on mount
 *
 * @param fn - The function to run on mount.
 */
export function onMount(fn: () => () => void): void;
export function onMount(fn: () => void): void;
export function onMount(fn: MountFn): void {
  const context = getRuntimeContext();
  if (context && context.mount) {
    context.mount.push(fn);
  } else {
    throw new Error("onMount called outside of component");
  }
}
