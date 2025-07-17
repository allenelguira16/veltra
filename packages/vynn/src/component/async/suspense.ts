import { JSX } from "~/jsx-runtime";
import { state } from "~/reactivity";
import { serverRenderedDOM } from "~/render/ssr-dom";
import { isServer } from "~/server";

const suspenseHandlerStack: ((promise: Promise<void>) => void)[] = [];

export function getSuspenseHandler() {
  return suspenseHandlerStack[suspenseHandlerStack.length - 1] as
    | ((promise: Promise<void>) => void)
    | undefined;
}

/**
 * Suspense component
 *
 * @param props - The props of the component.
 * @returns jsx function
 */
export function Suspense(props: { fallback?: JSX.Element; children: JSX.Element }) {
  const { fallback: _fallback, children: _children } = props as unknown as {
    fallback?: () => JSX.Element;
    children: () => JSX.Element;
  };

  const children = () => (isServer ? _children : _children());
  const fallback = () => (isServer ? _fallback : _fallback?.());

  const { currentDOM } = serverRenderedDOM();

  // SSR starts with fallback, CSR may start with children if resolved
  const view = state<JSX.Element>(fallback());

  const handler = (promise: Promise<void>) => {
    suspenseHandlerStack.pop();

    currentDOM?.remove();
    queueMicrotask(() => {
      view.value = fallback();
    });

    promise.then(() => {
      withSuspenseRender(children);
    });
  };

  const withSuspenseRender = (newView: () => JSX.Element) => {
    suspenseHandlerStack.push(handler);
    try {
      view.value = newView();
    } catch (error) {
      if (error instanceof Promise) {
        handler(error);
      } else {
        throw error;
      }
    }
  };

  function onDoneHydration(fn: () => void) {
    if (!serverRenderedDOM().isHydrating) {
      fn();
      return;
    }
    requestAnimationFrame(() => onDoneHydration(fn));
  }

  onDoneHydration(() => {
    withSuspenseRender(children);
  });

  return () => view.value;
}
