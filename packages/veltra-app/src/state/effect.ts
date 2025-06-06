type Effects = Set<EffectFn>;

export type EffectFn = {
  (): void;
  componentEffects?: Effects[];
  renderEffects?: Effects[];
};

export let activeEffect: EffectFn | null = null;
export let activeRenderEffect: EffectFn | null = null;

export let componentEffectStack: EffectFn[] | null = null;
export let renderEffectStack: EffectFn[] | null = null;

// Component stack setters
export function setComponentEffectStack(stack: EffectFn[]) {
  componentEffectStack = stack;
}

export function resetComponentEffectStack() {
  componentEffectStack = null;
}

export function setRenderEffectStack(stack: EffectFn[]) {
  renderEffectStack = stack;
}

export function resetRenderEffectStack() {
  renderEffectStack = null;
}

export function stopComponentEffect(effectFn: EffectFn) {
  if (effectFn.componentEffects) {
    for (const dep of effectFn.componentEffects) {
      dep.delete(effectFn);
    }
    effectFn.componentEffects.length = 0;
  }
}

export function stopRenderEffect(effectFn: EffectFn) {
  if (effectFn.renderEffects) {
    for (const dep of effectFn.renderEffects) {
      dep.delete(effectFn);
    }
    effectFn.renderEffects.length = 0;
  }
}

export function effect(fn: EffectFn): void {
  wrapComponentEffect(fn);
}

export function wrapComponentEffect(fn: EffectFn): EffectFn {
  const run = (() => {
    activeEffect = run;
    run.componentEffects = [];
    fn();
    activeEffect = null;
  }) as EffectFn;

  run.componentEffects = [];
  run();

  componentEffectStack?.push(run);
  return run;
}

export function wrapRenderEffect(fn: EffectFn): EffectFn {
  const run = (() => {
    activeRenderEffect = run;
    run.renderEffects = [];
    fn();
    activeRenderEffect = null;
  }) as EffectFn;

  run.renderEffects = [];
  run();

  renderEffectStack?.push(run);
  return run;
}

export let untrackSet = false;

export function untrack<T>(fn: () => T): T {
  const previousEffect = activeEffect;
  const previousUntrackSet = untrackSet;

  activeEffect = null;
  untrackSet = true;

  const result = fn();

  activeEffect = previousEffect;
  untrackSet = previousUntrackSet;

  return result;
}

export function untrackRenderEffect<T>(fn: () => T): T {
  const previousRenderEffect = activeRenderEffect;
  activeRenderEffect = null;
  const result = fn();
  activeRenderEffect = previousRenderEffect;
  return result;
}

const targetToPropertyEffectsMap: WeakMap<
  object,
  Map<PropertyKey, Set<EffectFn>>
> = new WeakMap();

export function track(target: object, key: PropertyKey) {
  const currentActive = activeEffect || activeRenderEffect;
  if (!currentActive) return;

  let propertyEffectsMap = targetToPropertyEffectsMap.get(target);
  if (!propertyEffectsMap) {
    propertyEffectsMap = new Map();
    targetToPropertyEffectsMap.set(target, propertyEffectsMap);
  }

  let effects = propertyEffectsMap.get(key);
  if (!effects) {
    effects = new Set();
    propertyEffectsMap.set(key, effects);
  }

  effects.add(currentActive);

  if (currentActive.componentEffects) {
    currentActive.componentEffects.push(effects);
  }
}

export function trigger(target: object, key: PropertyKey) {
  const propertyEffectsMap = targetToPropertyEffectsMap.get(target);
  if (!propertyEffectsMap) return;

  const effects = propertyEffectsMap.get(key);
  if (!effects) return;

  for (const effect of effects) {
    effect();
  }
}
