import { JSX } from "~/jsx-runtime";
import { state } from "~/reactivity";
import { serverRenderedDOM } from "~/render";
import { isServer } from "~/util";
import { memo } from "~/util";

const suspenseHandlerStack: ((promise: Promise<void>) => void)[] = [];
const suspenseSSRHandlerStack: (() => JSX.Element)[] = [];

export function getSuspenseHandler() {
  return suspenseHandlerStack[suspenseHandlerStack.length - 1] as
    | ((promise: Promise<void>) => void)
    | undefined;
}

export function getSuspenseSSRHandler() {
  return suspenseSSRHandlerStack[suspenseSSRHandlerStack.length - 1] as (() => void) | undefined;
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

  const children = memo(() => _children());
  const fallback = _fallback ? memo(() => _fallback()) : undefined;

  if (isServer) return fallback?.();

  const view = state<() => JSX.Element>(() => fallback?.());

  const ssrHandler = () => {
    suspenseSSRHandlerStack.pop();

    return fallback?.();
  };

  const handler = (promise: Promise<void>) => {
    suspenseHandlerStack.pop();

    queueMicrotask(() => {
      if (fallback) view.value = fallback;
    });

    promise.then(() => {
      withSuspenseRender(children);
    });
  };

  const withSuspenseRender = (newView: () => JSX.Element) => {
    if (isServer) suspenseSSRHandlerStack.push(ssrHandler);
    else suspenseHandlerStack.push(handler);

    try {
      view.value = newView;
    } catch (error) {
      if (error instanceof Promise) {
        if (!isServer) handler(error);
        else
          view.value = () => {
            throw error;
          };
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

  try {
    return () => {
      return view.value();
    };
  } finally {
    onDoneHydration(() => {
      withSuspenseRender(children);
    });
  }
}
