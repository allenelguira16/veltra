import { JSX } from "~/types";
import { resolveChildren } from "~/util";

const contextStack: any[] = [];

export function createContext<T>() {
  function Provider(props: { value: T; children: JSX.Element }) {
    contextStack.push(props.value);

    const children = resolveChildren(props.children);

    try {
      return children();
    } finally {
      contextStack.pop();
    }
  }

  function getContext(): T {
    if (!contextStack.length) {
      throw new Error("No provider found for context.");
    }
    const context = contextStack[contextStack.length - 1];

    return context;
  }

  return [Provider, getContext] as const;
}
