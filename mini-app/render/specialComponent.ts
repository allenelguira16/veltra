// Mount special components need to be mounted manually like <For>
export const mountSpecialComponent = (_$node: Node) => {
  interface RefNode extends Text {
    mount?: (node: Node) => void;
  }
  const $node = _$node as RefNode;
  $node.mount?.($node);
  delete $node.mount;
};

// Unmount special components need to be mounted manually like <For>
export const unmountSpecialComponent = (_$node: Node) => {
  interface RefNode extends Text {
    unmount?: (node: Node) => void;
  }
  const $node = _$node as RefNode;
  $node.unmount?.($node);
  delete $node.unmount;
};
