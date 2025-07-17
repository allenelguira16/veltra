import { Fragment } from "~/component";
import { h } from "~/render";
import { type JSX } from "~/types";
import { isServer, logJsx } from "~/util";

import { h as hSSR } from "./h";

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
const jsx = <T extends Record<string, any> & { children?: (...args: any[]) => string }>(
  type: string | ((props: T) => string | (() => string)),
  { children, ...props }: T,
  key?: () => string,
) => {
  if (isServer) {
    return hSSR(type, props, children);
  }

  return h(type, props, children, key);
};

export { Fragment, type JSX, jsx, jsx as jsxs, logJsx };
