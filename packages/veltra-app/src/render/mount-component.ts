import { For } from "../components";
import {
  setMountStack,
  setCleanupStack,
  registerComponentCleanup,
} from "../life-cycle";
import {
  removeEffect,
  setEffectStack,
  detachEffectStack,
  wrapEffect,
  ReactorFn,
  setReactorStack,
  removeReactor,
  detachReactorStack,
  wrapReactor,
} from "../state";

import { type EffectFn } from "../state";
import { type DestroyFn, type MountFn } from "../life-cycle";
import { onNodeReattached } from "../util";

type Stack = {
  mount: MountFn[];
  effect: EffectFn[];
  reactor: ReactorFn[];
  destroy: DestroyFn[];
};

export const mountedPlaceholders = new Set<Node>();

export function mountComponent(
  type: Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  handleSpecialComponentProps(type, props);

  const stack: Stack = {
    mount: [],
    effect: [],
    reactor: [],
    destroy: [],
  };

  initializeStack(stack);

  // let $node = untrack(() => type({ ...props, children }));
  let $node = type({ ...props, children });
  let $target = Array.isArray($node) ? document.createTextNode("") : $node;

  const hasLifeCycle = (Object.keys(stack) as (keyof Stack)[]).reduce(
    (prev, key) => {
      return prev || !!stack[key].length;
    },
    false
  );

  if (!hasLifeCycle) {
    return $node;
  }

  registerStackToDom(stack, $target);

  mountedPlaceholders.add($target);

  return Array.isArray($node) ? [$target, ...$node] : $node;
}

function initializeStack(stack: Stack) {
  setMountStack(stack.mount);
  setEffectStack(stack.effect);
  setReactorStack(stack.reactor);
  setCleanupStack(stack.destroy);
}

function registerStackToDom(stack: Stack, $target: Node) {
  const cleanups: (() => void)[] = [];

  detachEffectStack();
  detachReactorStack();
  registerComponentCleanup($target, cleanups);

  // Pass cleanups once dom is painted
  queueMicrotask(() => {
    cleanups.push(
      ...stack.effect.map((fn) => () => removeEffect(fn)),
      ...stack.reactor.map((fn) => () => removeReactor(fn)),
      ...stack.mount.map((fn) => fn()).filter((c) => !!c),
      ...stack.destroy
    );
  });

  // Re-run effect and memo when node is reattached
  onNodeReattached($target, () => {
    stack.effect.forEach((effect) => wrapEffect(effect));
    stack.reactor.forEach((effect) => wrapReactor(effect));

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
