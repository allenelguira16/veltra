import { J as JSX } from './dom-attributes-ImFTtFmp.js';
export { F as Fragment } from './fragment-CVbKNcBb.js';
export { l as logJsx } from './log-jsx-DoXc7mAt.js';

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
declare const jsx: <T extends Record<string, any> & {
    children?: (...args: (T | any)[]) => JSX.Element;
}>(type: string | ((...args: (T | any)[]) => JSX.Element), { children, ...props }?: T, key?: () => string) => JSX.Element;

export { JSX, jsx, jsx as jsxs };
