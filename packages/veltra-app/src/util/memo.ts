export function memo<T>(fn: () => T) {
  let cachedResult: T;
  let firstRun = true;

  return () => {
    if (firstRun) {
      cachedResult = fn();
      firstRun = false;
    }
    return cachedResult;
  };
}
