import { J as JSX } from './fragment-rgqNNppe.js';
export { F as Fragment } from './fragment-rgqNNppe.js';

/**
 * log the JSX elements
 *
 * @param nodes - The nodes to log.
 * @returns The nodes that are not text nodes and are not in the componentRootNodes set.
 */
declare function logJsx(nodes: Node[]): ChildNode | ChildNode[];

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
declare const jsx: (type: string | ((props: any) => any), { children, ...props }: Record<string, any>, key?: () => string) => JSX.Element;

export { JSX, jsx, jsx as jsxs, logJsx };
