export type DestroyFn = () => void;

let currentStack: DestroyFn[] | null = null;

export function setCleanupStack(stack: (() => void)[]) {
  currentStack = stack;
}

export function onDestroy(fn: () => void) {
  if (currentStack) {
    currentStack.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}

const cleanupMap = new Map<Node, (() => void)[]>();

export function registerComponentCleanup(node: Node, cleanups: (() => void)[]) {
  cleanupMap.set(node, cleanups);
  currentStack = null;
}

export function runDestroy($node: Node) {
  // console.log(cleanupMap.get($node));
  // function getCleanup($innerNode: Node): (() => void)[] {
  //   const cleanups: (() => void)[] = [];

  //   if (cleanupMap.has($innerNode)) {
  //     cleanups.push(...cleanupMap.get($innerNode)!);
  //   }

  //   for (const child of Array.from($innerNode.childNodes)) {
  //     cleanups.push(...getCleanup(child));
  //   }

  //   return cleanups;
  // }

  // const cleanups = getCleanup($node);
  // console.log(cleanupMap.get($node));
  const cleanups = cleanupMap.get($node) || [];
  for (const cleanup of cleanups) {
    cleanup();
  }
}
