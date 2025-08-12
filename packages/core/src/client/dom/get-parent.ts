let parentNode: ParentNode | null;

export function getParentNode() {
  return parentNode;
}

export function setParentNode(node: ParentNode | null) {
  parentNode = node;
}
