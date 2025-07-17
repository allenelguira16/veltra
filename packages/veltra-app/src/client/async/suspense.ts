import { onMount } from "~/lifecycle";
import { createTargetNode, memo, toArray } from "~/util";

import { renderChildren } from "../dom";
import { componentRootNodes } from "../mount-component";

const suspenseHandlerStack: ((promise: Promise<void>) => void)[] = [];

/**
 * Suspense component
 *
 * @param props - The props of the component.
 * @returns The root node of the component.
 */
export function Suspense(props: { fallback?: JSX.Element; children: JSX.Element }) {
  const { fallback: _fallback, children: _children } = props as unknown as {
    fallback?: () => JSX.Element;
    children: () => JSX.Element[];
  };

  let parentNode: ParentNode | undefined;

  const rootNode = createTargetNode("Suspense");
  componentRootNodes.add(rootNode);

  const children = memo(() => _children());
  const fallback = () => _fallback?.();

  const cleanups: (() => void)[] = [];

  const handler = (promise: Promise<void>) => {
    queueMicrotask(() => {
      cleanups.forEach((cleanup) => cleanup());

      if (fallback) withSuspenseRender(fallback);
    });

    promise.then(() => {
      cleanups.forEach((cleanup) => cleanup());

      withSuspenseRender(children);
    });
  };

  const withSuspenseRender = (items: JSX.Element) => {
    if (!parentNode) return;

    suspenseHandlerStack.push(handler);
    cleanups.push(renderChildren(parentNode, toArray(items), rootNode));
    suspenseHandlerStack.pop();
  };

  onMount(() => {
    if (!rootNode.parentNode) return;

    parentNode = rootNode.parentNode;

    withSuspenseRender(children);
  });

  return rootNode;
}

export function getSuspenseHandler() {
  return suspenseHandlerStack[suspenseHandlerStack.length - 1] as
    | ((promise: Promise<void>) => void)
    | undefined;
}
