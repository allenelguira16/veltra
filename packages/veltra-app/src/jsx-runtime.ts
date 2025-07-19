import { Fragment, h } from "./client/index.ts";
import { IS_SSR } from "./const";
import { h as hSSR } from "./server";
import { type JSX } from "./types";
import { toArray } from "./util";

/**
 * jsx runtime
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element.
 */
const jsx = (
  type: string | ((props: any) => any),
  { children = [], ...props }: Record<string, any>,
  key?: () => string,
) => {
  if (IS_SSR) {
    return hSSR(type, props, toArray(children)) as JSX.Element;
  }

  return h(type, props, children, key) as JSX.Element;
};

export { Fragment, type JSX, jsx, jsx as jsxs };
