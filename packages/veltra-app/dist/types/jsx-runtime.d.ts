export { F as Fragment } from './fragment-D9myLsj2.js';

// TODO: add specific types not just any
declare global {
  namespace JSX {
    type Element =
      | string
      | number
      | Function
      | Node
      | DocumentFragment
      | Element[];

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

declare const jsx: (type: any, { children, ...props }: any) => any;

export { jsx, jsx as jsxs };
