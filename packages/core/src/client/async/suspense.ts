import { IS_SSR } from "~/const";
import { state } from "~/reactivity";
import { JSX } from "~/types";
import { memo } from "~/util";

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
 * @returns The root node of the component.
 */
export function Suspense(props: { fallback?: JSX.Element; children: JSX.Element }) {
  if (IS_SSR) return props.fallback;

  const { fallback: _fallback, children: _children } = props as unknown as {
    fallback?: () => JSX.Element;
    children: () => JSX.Element[];
  };

  const children = memo(() => _children());
  const fallback = () => _fallback?.();

  const view = state<() => JSX.Element>();

  const handler = (promise: Promise<void>) => {
    suspenseHandlerStack.pop();

    view.value = fallback;

    promise.then(() => {
      withSuspenseRender(children);
    });
  };

  const withSuspenseRender = (newView: () => JSX.Element) => {
    suspenseHandlerStack.push(handler);
    view.value = newView;
  };

  withSuspenseRender(children);

  return () => {
    return view.value?.();
  };
}
