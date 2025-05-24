import { currentEffect } from "./effect";

type StateReturn<T> = readonly [() => T, (value: T | ((prev: T) => T)) => T];

export function state<T>(initialValue: T): StateReturn<T>;
export function state<T = undefined>(): StateReturn<T | undefined>;
export function state<T>(initialValue?: T) {
  let value = initialValue as T;
  const subscribers = new Set<() => void>();

  const get = () => {
    if (currentEffect) subscribers.add(currentEffect);
    return value;
  };

  const set = (newValue: StateReturn<T>["1"]) => {
    value = typeof newValue === "function" ? newValue(value) : newValue;
    for (const sub of subscribers) sub();
  };

  return [get, set] as const;
}
