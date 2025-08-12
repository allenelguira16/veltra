import { JSX } from "~/types";

export function createContext<T>() {
  // const contextStack: any[] = [];
  let value: any;

  function Provider(props: { value: T; children: () => JSX.Element }) {
    // const children = memo(() => props.children());

    // const rootNode = createTargetNode("Provider");
    // componentRootNodes.add(rootNode);

    // onMount(() => {
    //   const parentNode = rootNode.parentNode;

    //   if (!parentNode) return;

    //   value = props.value;
    //   renderChildren(parentNode, toArray(untrack(() => children())), rootNode);
    //   // contextStack.pop();
    // });

    // return rootNode;
    value = props.value;
    return props.children();
  }

  function getContext(): T {
    if (!value) {
      throw new Error("No provider found for context.");
    }
    // const context = contextStack[contextStack.length - 1];

    // return context;
    return value;
  }

  return [Provider, getContext] as const;
}
