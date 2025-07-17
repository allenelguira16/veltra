import { Fragment } from "./component";
import { h } from "./render";
import { type JSX } from "./types";
import { logJsx } from "./util";

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
const jsx = <T extends Record<string, any> & { children?: (...args: (T | any)[]) => JSX.Element }>(
  type: string | ((...args: (T | any)[]) => JSX.Element),
  { children, ...props }: T = {} as T,
  key?: () => string,
) => {
  return h(type, props, children, key) as JSX.Element;
};

export { Fragment, type JSX, jsx, jsx as jsxs, logJsx };
