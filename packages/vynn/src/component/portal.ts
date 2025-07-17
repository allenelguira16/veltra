import { onDestroy, onMount } from "~/lifecycle";
import { renderChildren } from "~/render";
import { PropsWithChildren } from "~/types";

/**
 *
 * @param children The children of the Portal.
 * @param target
 * @returns
 */
export function Portal({ children, target }: PropsWithChildren<{ target: Node }>) {
  let cleanup: () => void;

  onMount(() => {
    const mount: Node = (target instanceof Function ? target() : target) ?? document.body;
    cleanup = renderChildren(mount, children);
  });

  onDestroy(() => {
    cleanup();
  });

  return null;
}
