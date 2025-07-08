import { getCurrentOwner } from "~/reactivity";

const __componentCaches = new Map<string, any>();

/**
 * Cache a single value scoped to the current component.
 *
 * @param factory - The factory function to create the value.
 * @returns The cached value.
 */
export function componentCache<T>(factory: () => T): T {
  const owner = getCurrentOwner();

  if (__componentCaches.has(owner)) {
    return __componentCaches.get(owner);
  }

  const value = factory();
  __componentCaches.set(owner, value);

  return value;
}
