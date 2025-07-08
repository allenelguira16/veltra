import {
  createStateContext,
  RuntimeContext,
  setComponentContext,
  setRuntimeContext,
} from "~/context";
import { getCurrentOwner, untrack } from "~/reactivity";
import { toArray } from "~/util";

import { resolveComponentProps } from "./resolve-component-props";

export const componentRootNodes = new Set<Node>();

/**
 * mount a component
 *
 * @param type - The type of the component.
 * @param props - The properties of the component.
 * @param children - The children of the component.
 */
export function mountComponent(
  type: (props: Record<string, any>) => any,
  { key: _key, ...props }: { key?: () => string } & Record<string, any>,
  children: JSX.Element[],
) {
  resolveComponentProps(type, props);

  const key = _key ? _key() + getCurrentOwner() : undefined;
  const targetNode = document.createTextNode("");
  componentRootNodes.add(targetNode);

  const context: RuntimeContext = {
    mount: [],
    state: createStateContext(key),
    effect: [],
    destroy: [],
  };

  setRuntimeContext(context);

  const node = toArray(untrack(() => type({ ...props, children }))) as Node[];

  setRuntimeContext(null);
  setComponentContext(targetNode, context);

  return [targetNode, ...node];
}
