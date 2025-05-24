import { track, trigger } from "./effect";

export function state<T>(initialValue: T): { value: T };
export function state<T = undefined>(): { value: T | undefined };
export function state<T>(initialValue?: T): { value: T | undefined } {
  const state = { value: initialValue };

  return new Proxy(state, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key as keyof typeof target];
      const result = Reflect.set(target, key, newValue, receiver);

      const isArray = Array.isArray(newValue);
      const isObject =
        typeof newValue === "object" &&
        !Array.isArray(newValue) &&
        newValue !== null;
      const isPrimitive =
        typeof newValue !== "object" && typeof newValue !== "function";

      const shouldTrigger =
        isArray || isObject || (isPrimitive && oldValue !== newValue);

      if (shouldTrigger) {
        trigger(target, key);
      }

      return result;
    },
  });
}
