import { rootNodes } from "~/render";

export function createTargetNode(_name: string) {
  let targetNode: ChildNode;

  if (process.env.NODE_ENV === "development") {
    targetNode = document.createTextNode("");
  } else {
    targetNode = document.createTextNode("");
  }

  rootNodes.add(targetNode);

  return targetNode;
}

// function toKebabCase(str: string) {
//   return str
//     .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // insert hyphen before capital letters
//     .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // handle consecutive capitals (e.g., "XMLHttpRequest")
//     .toLowerCase();
// }
