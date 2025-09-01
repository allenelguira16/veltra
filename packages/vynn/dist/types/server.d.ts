import { J as JSX } from './dom-attributes-CCUg0DNA.js';

/**
 * Create a JSX element for SSR
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element for SSR.
 */
declare function h<T extends Record<string, any> & {
    children?: (...args: any[]) => string;
}>(type: string | ((props: T) => string | (() => string)), props: Record<string, any>, children?: T["children"]): string | null;

declare let isStreaming: boolean;
declare let resolveStream: () => void;
declare function renderToStream(App: () => JSX.Element): ReadableStream<Uint8Array<ArrayBuffer>>;

declare function renderToString(App: () => JSX.Element): string;

export { h, isStreaming, renderToStream, renderToString, resolveStream };
