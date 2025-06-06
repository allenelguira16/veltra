type Effects = Set<EffectFn>;

export type EffectFn = {
  (): void;
  effects?: Effects[];
};

export let activeEffect: EffectFn | null = null;
export let effectStack: EffectFn[] | null = null;

const effects: EffectFn[] = [];

export function setEffectStack(stack: EffectFn[]) {
  effectStack = stack;
}

export function detachEffectStack() {
  effectStack = null;
}

export function removeEffect(effectFn: EffectFn) {
  if (effectFn.effects) {
    for (const dep of effectFn.effects) {
      dep.delete(effectFn);
    }
    effectFn.effects.length = 0;
  }
}

export function effect(fn: EffectFn): void {
  wrapEffect(fn);
}

export function wrapEffect(fn: EffectFn): EffectFn {
  const run = (() => {
    effects.push(run);
    activeEffect = run;
    run.effects = [];
    fn();
    effects.pop();
    activeEffect = effects[effects.length - 1] || null;
  }) as EffectFn;

  run.effects = [];
  run();

  effectStack?.push(run);
  return run;
}

// export let untrackSet = false;

// export function untrack<T>(fn: () => T): T {
//   const previousEffect = activeComponentEffect;
//   const previousUntrackSet = untrackSet;

//   activeComponentEffect = null;
//   untrackSet = true;

//   const result = fn();

//   activeComponentEffect = previousEffect;
//   untrackSet = previousUntrackSet;

//   return result;
// }

// export function untrackRender<T>(fn: () => T): T {
//   const previousRenderEffect = activeRenderEffect;
//   activeRenderEffect = null;
//   const result = fn();
//   activeRenderEffect = previousRenderEffect;
//   return result;
// }
