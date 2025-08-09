import { onMount } from "~/lifecycle";
import { JSX } from "~/types";
import { createTargetNode } from "~/util";

import { renderChildren } from "../dom";

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

  const children = () => _children();
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
    cleanups.push(renderChildren(parentNode, items, rootNode));
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
