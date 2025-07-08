import { getRuntimeContext } from "~/context/runtime-context";

/**
 * Effect function type with dependency tracking
 */
export type EffectFn = (() => void) & {
  deps?: Set<EffectFn>[];
  owner?: string;
};

/**
 * Currently active effect
 */
export let activeEffect: EffectFn | null = null;

export function setActiveEffect(newActiveEffect: EffectFn | null) {
  activeEffect = newActiveEffect;
}

let lastDisposer: (() => void) | null = null;

let currentOwner: string | null = null;

export function getCurrentOwner(): string {
  if (!currentOwner) {
    throw new Error("Must be inside an effect");
  }

  return currentOwner;
}

/**
 * Create an effect with an attached render frame
 */
export function effect(fn: () => void): () => void {
  const context = getRuntimeContext();
  const wrappedEffect: EffectFn = () => {
    removeEffect(wrappedEffect);

    const previousEffect = activeEffect;
    const previousOwner = currentOwner;

    activeEffect = wrappedEffect;
    currentOwner = wrappedEffect.owner!;

    if (context) context.effect.push(wrappedEffect);

    try {
      fn();
    } finally {
      activeEffect = previousEffect;
      currentOwner = previousOwner;
    }
  };

  const disposer = () => removeEffect(wrappedEffect);
  lastDisposer = disposer;

  wrappedEffect.deps = [];

  wrappedEffect.owner = crypto.randomUUID();

  wrappedEffect();

  return disposer;
}

export function stopEffect() {
  if (lastDisposer) {
    lastDisposer();
    lastDisposer = null;
  }
}

/**
 * Remove an effect
 */
export function removeEffect(effect: EffectFn) {
  if (effect.deps) {
    for (const depSet of effect.deps) {
      depSet.delete(effect);
    }
    effect.deps.length = 0;
  }
}
