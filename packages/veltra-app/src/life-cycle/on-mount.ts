export type MountFn = () => void | (() => void);

let currentStack: MountFn[] | null = null;

export function setMountStack(stack: (() => void)[]) {
  currentStack = stack;
}

export function onMount(fn: () => () => void): void;
export function onMount(fn: () => void): void;
export function onMount(fn: MountFn): void {
  if (currentStack) {
    currentStack.push(fn);
  } else {
    throw new Error("onDestroy called outside of component");
  }
}
