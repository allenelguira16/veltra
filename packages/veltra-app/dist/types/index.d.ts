export { F as Fragment, c as createRoot, h, s as setCurrentRenderingDOM } from './render-DmTlmpbK.js';

declare function hSSR(type: string | Function, props: Record<string, any>, children: JSX.Element[]): any;

declare function state<T>(initialValue: T): {
    value: T;
};
declare function state<T = undefined>(): {
    value: T | undefined;
};

type EffectFn = () => void;
declare function effect(fn: EffectFn): void;

declare function computed<T>(getter: () => T): {
    readonly value: T;
};

type ForProps<T> = {
    items: T[];
    children: (item: T, index: number) => JSX.Element;
    fallback?: JSX.Element;
};
interface RefNode extends Text {
    mount?: (node: Node) => void;
    unmount?: (node: Node) => void;
}
declare function For<T>(props: ForProps<T>): RefNode;

export { For, computed, effect, hSSR, state };
