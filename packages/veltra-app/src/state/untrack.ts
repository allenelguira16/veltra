export let shouldTrack = true;

export function untrack<T>(fn: () => T): T {
  const prev = shouldTrack;
  shouldTrack = false; // turn off tracking
  const result = fn();
  shouldTrack = prev; // restore tracking
  return result;
}
