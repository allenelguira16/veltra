let parentNode: ParentNode | undefined;

export function getParentNode() {
  return parentNode;
}

export function setParentNode(node: ParentNode) {
  parentNode = node;
}
