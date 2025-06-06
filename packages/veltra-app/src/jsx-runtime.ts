import { Fragment } from "./components";
import { IS_SSR } from "./const";
import { h, hSSR } from "./render";
import { normalizeDom } from "./util";

import "./jsx.d.ts";

// Transform jsx to use h
const jsx = (type: any, { children = [], ...props }: any) => {
  if (IS_SSR) {
    return hSSR(type, props, normalizeDom(children));
  }

  return h(type, props, normalizeDom(children));
};

export { jsx, jsx as jsxs, Fragment };
