import { setRuntimeContext } from "~/context";
import { createLifeCycleContext, runComponentCleanup, runLifecycle } from "~/lifecycle";
import { untrack } from "~/reactivity";
import { JSX } from "~/types";
import { isServer } from "~/util";
import { createTargetNode, toArray } from "~/util";

import { resolveComponentProps } from "./resolve-component-props";

export const rootNodes = new WeakSet<Node>();
export const cleanupMap = new WeakMap<Node, (() => Promise<void> | void)[]>();

/**
 * mount a component
 *
 * @param type - The type of the component.
 * @param props - The properties of the component.
 * @param children - The children of the component.
 */
export function mountComponent<
  T extends Record<string, any> & { children?: (...args: any[]) => JSX.Element },
>(
  type: (props: T) => JSX.Element,
  props: Omit<T, "children"> = {} as Omit<T, "children">,
  children?: T["children"],
  _key?: () => string | number,
) {
  resolveComponentProps(type, props);

  const key = _key ? _key().toString() + type.toString() : undefined;
  const context = createLifeCycleContext(key);

  setRuntimeContext(context);
  const rootNode = createTargetNode(type.name);
  const jsxElements = toArray([rootNode, untrack(() => type({ ...props, children } as T))]).flat();
  setRuntimeContext(null);

  runLifecycle(rootNode, context);

  return jsxElements as JSX.Element;
}

queueMicrotask(() => {
  if (!isServer) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removedNodes of mutation.removedNodes) {
          runComponentCleanup(removedNodes);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});
