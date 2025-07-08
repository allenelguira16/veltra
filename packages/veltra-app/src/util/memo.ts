/**
 * memoize a function
 *
 * @param fn - The function to memoize.
 * @returns The memoized function.
 */
export function memo<T>(fn: (...args: any[]) => T) {
  let cachedResult: T;
  let firstRun = true;

  return (...args: any[]) => {
    if (firstRun) {
      cachedResult = fn(...args);
      firstRun = false;
    }
    return cachedResult;
  };
}
