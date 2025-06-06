import { normalizeDom } from "./util";
import { h, Fragment, hSSR } from "./render";
import { IS_SSR } from "./const";

// Transform jsx to use h
const baseJsx = (type: any, { children = [], ...props }: any) => {
  if (IS_SSR) {
    return hSSR(type, props, normalizeDom(children));
  }

  return h(type, props, normalizeDom(children));
};

export const jsx = baseJsx;
export const jsxs = baseJsx;
export { Fragment };

import "./jsx.d.ts";
