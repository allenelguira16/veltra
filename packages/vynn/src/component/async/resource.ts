import { onDestroy } from "~/lifecycle";
import { isServer } from "~/util";

import { effect } from "../../reactivity/effect";
import { state } from "../../reactivity/state";
import { untrack } from "../../reactivity/untrack";

export type ResourceReturn<T> = {
  readonly loading: boolean;
  readonly error: Error | null;
  readonly data: T;
  refetch: () => Promise<void>;
  mutate: (newValue: T) => void;
};

/**
 * Create a reactive resource
 *
 * @param fetcher - The function to fetch the data.
 * @returns The resource.
 */
export function baseResource<T>(fetcher: () => Promise<T>): ResourceReturn<T> {
  let loading = true;
  let error = null as Error | null;
  let data = undefined as T | undefined;
  let promise: Promise<T> | null = null;
  let promiseStatus = "pending" as "pending" | "fulfilled" | "rejected";

  const version = state(0);

  const refetch = async () => {
    loading = true;
    error = null;
    data = undefined as T | undefined;
    promiseStatus = "pending";
    promise = fetcher();

    promise
      .then((result) => {
        data = result;
        error = null;
        promiseStatus = "fulfilled";
        loading = false;
        untrack(() => version.value++);
      })
      .catch((err) => {
        data = undefined as T | undefined;
        error = err;
        promiseStatus = "rejected";
        loading = false;
        untrack(() => version.value++);
      });

    untrack(() => version.value++);
  };

  effect(() => {
    refetch();
  });

  return {
    get loading() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      version.value;
      return loading;
    },
    get error() {
      return error;
    },
    get data() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      version.value;

      if (promiseStatus === "pending") throw promise;
      if (promiseStatus === "rejected") throw error;

      return data as T;
    },
    refetch,
    mutate(newValue: T) {
      data = newValue;
      version.value++;
    },
  };
}

const resourceCache = new Map<string, ResourceReturn<any>>();

/**
 * Create a reactive resource
 *
 * @param fetcher - The function to fetch the data.
 * @returns The resource.
 */
export function resource<T>(fetcher: () => Promise<T>, key: string): ResourceReturn<T> {
  if (isServer) return baseResource(fetcher);

  onDestroy(() => {
    resourceCache.delete(key);
  });

  if (resourceCache.has(key)) {
    return resourceCache.get(key) as ResourceReturn<T>;
  }

  const resourceFn = baseResource(fetcher);
  resourceCache.set(key, resourceFn);

  return resourceFn;
}
