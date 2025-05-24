import { normalizeDom } from "./util";
import { h, Fragment } from "./render";

// Transform jsx to use h
export const jsx = (type: any, { children = [], ...props }: any) =>
  h(type, props, normalizeDom(children));

export const jsxs = jsx;
export { Fragment };
