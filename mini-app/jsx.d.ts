// TODO: add specific types not just any
declare namespace JSX {
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
