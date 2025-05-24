export type EffectFn = () => void;

export let activeEffect: EffectFn | null = null;

export function effect(fn: EffectFn): void {
  const run = () => {
    activeEffect = run;
    fn();
    activeEffect = null;
  };
  run();
}

export function effectify(fn: EffectFn): EffectFn {
  const run = () => {
    activeEffect = run;
    fn();
    activeEffect = null;
  };
  run();
  return run;
}

const depMap: WeakMap<object, Map<PropertyKey, Set<EffectFn>>> = new WeakMap();

export function track(target: object, key: PropertyKey): void {
  if (!activeEffect) return;

  let deps = depMap.get(target);
  if (!deps) {
    deps = new Map<PropertyKey, Set<EffectFn>>();
    depMap.set(target, deps);
  }

  let dep = deps.get(key);
  if (!dep) {
    dep = new Set<EffectFn>();
    deps.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target: object, key: PropertyKey): void {
  const deps = depMap.get(target);
  if (!deps) return;

  const dep = deps.get(key);
  if (!dep) return;

  for (const effect of dep) {
    effect();
  }
}
