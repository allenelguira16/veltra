import { JSX } from "~/types";
import { memo } from "~/util";

/**
 *
 * @param loader lazy loader import
 * @param namedExport name of the exported
 * @returns jsx
 */
export function lazy<M extends Record<string, any>, K extends keyof M = "default">(
  loader: () => Promise<M>,
  namedExport?: K,
): () => JSX.Element {
  let component: M[K] | undefined;
  let error: Error | undefined;
  let promise: Promise<void> | null = null;

  const key = namedExport ?? ("default" as K);

  // TODO: make ssr compatible make async into sync or similar sync
  const getComponent = memo((): M[K] => {
    if (component) return component;
    if (error) throw error;

    if (!promise) {
      promise = loader()
        .then((mod) => {
          if (!(key in mod)) {
            throw new Error(`lazy(): Export "${String(key)}" not found in module`);
          }
          component = mod[key];
        })
        .catch((err) => {
          error = err instanceof Error ? err : new Error(String(err));
        });
    }

    throw promise;
  });

  return () => {
    const Comp = getComponent();
    return Comp();
  };
}
