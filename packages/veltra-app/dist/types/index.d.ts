export { F as Fragment } from './fragment-D9myLsj2.js';

declare function h(type: string | Function, props: Record<string, any>, children: JSX.Element[]): any;

declare function hSSR(type: string | Function, props: Record<string, any>, children: JSX.Element[]): any;

declare function createRoot($root: HTMLElement, app: JSX.Element): void;

declare function state<T>(initialValue: T): {
    value: T;
};
declare function state<T = undefined>(): {
    value: T | undefined;
};

type Effects = Set<EffectFn>;
type EffectFn = {
    (): void;
    componentEffects?: Effects[];
    renderEffects?: Effects[];
};
declare function effect(fn: EffectFn): void;
declare function untrack<T>(fn: () => T): T;

declare function computed<T>(getter: () => T): {
    readonly value: T;
};

type ForProps<T> = {
    items: T[];
    fallback?: JSX.Element;
    children: (item: T, index: {
        value: number;
    }) => JSX.Element;
};
declare function For<T>(props: ForProps<T>): Text;

declare function onDestroy(fn: () => void): void;

declare function onMount(fn: () => () => void): void;
declare function onMount(fn: () => void): void;

declare function memo<T>(fn: () => T): () => T;

declare function cleanLog($nodes: Node[]): Node | Node[];

export { For, cleanLog, computed, createRoot, effect, h, hSSR, memo, onDestroy, onMount, state, untrack };
