import { effectify, track, trigger } from "./effect";

export function computed<T>(getter: () => T): { readonly value: T } {
  let cachedValue: T;
  let dirty = true;
  let initialized = false;

  const obj = {
    get value(): T {
      if (dirty) {
        run();
        dirty = false;
      }
      initialized = true;
      track(obj, "value");
      return cachedValue;
    },
    set value(_: unknown) {
      throw new Error("Computed is read-only and cannot be modified");
    },
  };

  const run = effectify(() => {
    cachedValue = getter();
    dirty = false;

    if (initialized) {
      queueMicrotask(() => {
        trigger(obj, "value");
      });
    }
  });

  return obj;
}
