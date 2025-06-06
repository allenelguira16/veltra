import { activeEffect, EffectFn } from "./effect";
import { activeReactor, ReactorFn } from "./reactor";
import { shouldTrack } from "./untrack";

const targetToPropertyEffectsMap: WeakMap<
  object,
  Map<PropertyKey, Set<ReactorFn | EffectFn>>
> = new WeakMap();

export function track(target: object, key: PropertyKey) {
  if (!shouldTrack) return;

  const currentActive = activeEffect || activeReactor;
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

  if ("effects" in currentActive && currentActive.effects) {
    currentActive.effects.push(effects);
  }

  if ("renderEffects" in currentActive && currentActive.renderEffects) {
    currentActive.renderEffects.push(effects);
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
