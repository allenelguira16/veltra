import { componentRootNodes } from "~/client";

export function createTargetNode(name: string) {
  let targetNode: ChildNode;

  if (process.env.NODE_ENV === "development") {
    targetNode = document.createComment(name);
  } else {
    targetNode = document.createTextNode("");
  }

  componentRootNodes.add(targetNode);

  return targetNode;
}
