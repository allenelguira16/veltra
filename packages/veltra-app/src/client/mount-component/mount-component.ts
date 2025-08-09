import {
  createStateContext,
  RuntimeContext,
  setComponentContext,
  setRuntimeContext,
} from "~/context";
import { untrack } from "~/reactivity";
import { JSX } from "~/types";
import { createTargetNode, toArray } from "~/util";

import { Suspense } from "../async";
import { Fragment } from "../dom";
import { Loop } from "../loop";
import { resolveComponentProps } from "./resolve-component-props";

export const componentRootNodes = new WeakSet<Node>();

const COMPONENTS = [Suspense, Loop, Fragment] as Array<(...args: any[]) => any>;

/**
 * mount a component
 *
 * @param type - The type of the component.
 * @param props - The properties of the component.
 * @param children - The children of the component.
 */
export function mountComponent(
  type: (props: Record<string, any>) => any,
  { key: _key, ...props }: { key?: () => string | number } & Record<string, any>,
  children: JSX.Element[] | (() => JSX.Element[]),
) {
  resolveComponentProps(type, props);

  const key = _key ? _key().toString() + type.toString() : undefined;

  const context: RuntimeContext = {
    id: crypto.randomUUID(),
    mount: [],
    state: createStateContext(key),
    effect: [],
    destroy: [],
  };

  setRuntimeContext(context);

  const node = toArray(untrack(() => type({ ...props, children }))) as Node[];

  if (componentRootNodes.has(node[0]) && COMPONENTS.includes(type)) {
    setRuntimeContext(null);
    setComponentContext(node[0], context);

    return node;
  }

  const targetNode = createTargetNode(type.name);
  componentRootNodes.add(targetNode);

  setRuntimeContext(null);
  setComponentContext(targetNode, context);

  return [targetNode, ...node];
}
