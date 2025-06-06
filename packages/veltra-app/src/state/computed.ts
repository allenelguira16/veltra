import { reactor } from "./reactor";
import { track, trigger } from "./track";

export function computed<T>(getter: () => T): { readonly value: T } {
  let cachedValue: T;
  let dirty = true;
  let initialized = false;

  const obj = {
    get value(): T {
      initialized = true;
      track(obj, "value");
      return cachedValue;
    },
    set value(_: unknown) {
      throw new Error("Computed is read-only and cannot be modified");
    },
  };

  reactor(() => {
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
