import { For } from "../components";
import {
  setMountStack,
  setCleanupStack,
  registerComponentCleanup,
} from "../life-cycle";
import {
  stopComponentEffect,
  setComponentEffectStack,
  resetComponentEffectStack,
  setRenderEffectStack,
  stopRenderEffect,
  untrack,
} from "../state";

import { type EffectFn } from "../state";
import { type DestroyFn, type MountFn } from "../life-cycle";

type Stack = {
  effect: EffectFn[];
  destroy: DestroyFn[];
  mount: MountFn[];
};

export const mountedPlaceholders = new Set<Node>();

export function mountComponent(
  type: Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  handleSpecialComponentProps(type, props);

  const stack: Stack = {
    effect: [],
    destroy: [],
    mount: [],
  };

  initializeStack(stack);

  let $node = untrack(() => type({ ...props, children }));
  let $target = Array.isArray($node) ? document.createTextNode("") : $node;

  registerStackToDom(stack, $target);

  mountedPlaceholders.add($target);

  return Array.isArray($node) ? [$target, ...$node] : $node;
}

function initializeStack(stack: Stack) {
  setComponentEffectStack(stack.effect);
  // setRenderEffectStack(stack.renderEffect);
  setCleanupStack(stack.destroy);
  setMountStack(stack.mount);
}

function registerStackToDom(stack: Stack, $target: Node) {
  const cleanups: (() => void)[] = [
    // run onMount after dom is ready then pass onMount cleanup to the current cleanups queue
    ...stack.effect.map((fn) => () => stopComponentEffect(fn)),
    // ...stack.renderEffect.map((fn) => () => stopRenderEffect(fn)),
    ...stack.destroy,
  ];

  // console.log(cleanups);

  // Register first the stack to the component then later on attach the stacks needed for cleanup
  resetComponentEffectStack();
  registerComponentCleanup($target, cleanups);

  // waitForParent($target).then(() => {
  queueMicrotask(() => {
    // console.log($target.parentNode);
    // pass cleanups once dom is painted, this is to prevent race conditions
    cleanups.push(...stack.mount.map((fn) => fn()).filter((c) => !!c));
  });
}

function handleSpecialComponentProps(
  type: Function,
  props: Record<string, any>
) {
  const EXCLUDE_PROP_CALL: Function[] = [For];

  if (!EXCLUDE_PROP_CALL.includes(type)) {
    for (const key in props) {
      props[key] = props[key] instanceof Function ? props[key]() : props[key];
    }
  }
}
