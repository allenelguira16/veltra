import { Fragment } from "./components";
import { IS_SSR } from "./const";
import { h, hSSR } from "./render";
import { toArray } from "./util";

import "./jsx.d";

// Transform jsx to use h
const jsx = (type: any, { children = [], ...props }: any) => {
  if (IS_SSR) {
    return hSSR(type, props, toArray(children));
  }

  return h(type, props, toArray(children));
};

export { jsx, jsx as jsxs, Fragment };
