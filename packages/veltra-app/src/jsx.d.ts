// TODO: add specific types not just any
declare global {
  namespace JSX {
    type Element =
      | undefined
      | string
      | number
      | Node
      | Element[]
      | (() => Element);

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
