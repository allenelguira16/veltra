export let currentEffect: (() => void) | null = null;
let currentCleanup: ((fn: () => void) => void) | null = null;

export function effect(fn: () => void) {
  let cleanupFn: (() => void) | void;

  const wrappedEffect = () => {
    if (cleanupFn) cleanupFn();

    currentEffect = wrappedEffect;
    currentCleanup = (cb) => (cleanupFn = cb); // Allow registering a new cleanup
    cleanupFn = fn();
    currentEffect = null;
    currentCleanup = null;
  };

  wrappedEffect(); // Run initially
}

export function onCleanup(cb: () => void) {
  if (!currentCleanup) {
    throw new Error("onCleanup() must be called inside an effect");
  }
  currentCleanup(cb);
}
