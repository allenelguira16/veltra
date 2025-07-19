import { J as JSX } from './fragment-BbyLuDT8.js';
export { F as Fragment } from './fragment-BbyLuDT8.js';

declare function lazy<M extends Record<string, any>, K extends keyof M = "default">(loader: () => Promise<M>, namedExport?: K): () => JSX.Element;

type ResourceReturn<T> = {
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
declare function resource<T>(fetcher: () => Promise<T>): ResourceReturn<T>;

/**
 * Suspense component
 *
 * @param props - The props of the component.
 * @returns The root node of the component.
 */
declare function Suspense(props: {
    fallback?: JSX.Element;
    children: JSX.Element;
}): ChildNode;

/**
 * create root app
 *
 * @param App - The app to render.
 */
declare function createApp(App: () => JSX.Element): {
    mount: (id: string | HTMLElement) => void;
    unmount: () => void;
};

/**
 * create root app
 *
 * @param App - The app to render.
 */
declare function hydrateApp(App: () => JSX.Element): {
    mount: (id: string | HTMLElement) => void;
    unmount: () => void;
};

type Computed<T> = {
    readonly value: T;
};
/**
 * Create a computed value
 *
 * @param getter - The getter function that returns the computed value from a reactive value.
 * @returns The computed value.
 */
declare function computed<T>(getter: () => T): Computed<T>;

/**
 * Create an effect with an attached render frame
 */
declare function effect(fn: (() => void | (() => void)) | (() => Promise<void | (() => void)>)): () => void;
declare function stopEffect(): void;

type State<T> = {
    value: T;
};
/**
 * Create a state
 *
 * @param initialValue - The initial value of the state.
 * @returns The state object.
 */
declare function state<T>(initialValue: T): State<T>;
declare function state<T = undefined>(): State<T | undefined>;

type Store<T extends object> = T;
declare function store<T extends object>(initialObject: T): Store<T>;

/**
 * Unwrap a reactive value
 *
 * @param fn - The function that returns the reactive value.
 * @returns The reactive value.
 */
declare function untrack<T>(fn: () => T): T;

/**
 * create a loop component
 *
 * @param items - The items to loop through.
 * @returns The loop component.
 */
declare function loop<T>(items: T[]): {
    each: (children: (item: T, index: State<number>) => JSX.Element) => JSX.Element;
};

declare function createContext<T>(): readonly [(props: {
    value: T;
    children: JSX.Element;
}) => Node | (Node | undefined)[] | undefined, () => T];

type DestroyFn = () => Promise<void> | void;
/**
 * on destroy
 *
 * @param fn - The function to run on destroy.
 */
declare function onDestroy(fn: DestroyFn): void;

type MountFn = () => Promise<void | DestroyFn> | (void | DestroyFn);
/**
 * on mount
 *
 * @param fn - The function to run on mount.
 */
declare function onMount(fn: () => Promise<DestroyFn> | DestroyFn): void;
declare function onMount(fn: () => Promise<void> | void): void;

declare function resolveChildren(child: JSX.Element): (...args: any[]) => Node | (Node | undefined)[] | undefined;

/**
 * log the JSX elements
 *
 * @param nodes - The nodes to log.
 * @returns The nodes that are not text nodes and are not in the componentRootNodes set.
 */
declare function logJsx(nodes: Node[]): Node | Node[];

/**
 * memoize a function
 *
 * @param fn - The function to memoize.
 * @returns The memoized function.
 */
declare function memo<T>(fn: (...args: any[]) => T): (...args: any[]) => T;

/**
 * unwraps proxy objects
 *
 * @param value - The value to unwrap.
 * @returns The unwrapped value.
 */
declare function unwrap<T>(value: any): Partial<T>;

export { JSX, Suspense, computed, createApp, createContext, effect, hydrateApp, lazy, logJsx, loop, memo, onDestroy, onMount, resolveChildren, resource, state, stopEffect, store, untrack, unwrap };
export type { Computed, DestroyFn, MountFn, State };
