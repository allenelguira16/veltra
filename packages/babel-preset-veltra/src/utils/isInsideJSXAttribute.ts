import { NodePath } from "@babel/core";

export function isInsideJSXAttribute(path: NodePath) {
  let current: NodePath | null = path;
  while ((current = current.parentPath)) {
    if (current.isJSXAttribute()) return true;
    if (current.isJSXElement() || current.isJSXFragment()) return false;
  }
  return false;
}
