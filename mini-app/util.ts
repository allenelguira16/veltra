export const normalizeDom = <T = any>(children: T | T[]) => {
  return Array.isArray(children) ? children : [children];
};

export const isNil = (value: unknown): value is null | undefined | false => {
  return value === undefined || value === null || value === false;
};

export function getNode(
  node: JSX.Element | (() => JSX.Element)
): Node | undefined {
  if (typeof node === "string" || typeof node === "number") {
    return document.createTextNode(String(node)) as Node;
  }

  if (node instanceof HTMLElement || node instanceof Text) {
    return node as Node;
  }

  if (isNil(node)) {
    return undefined;
  }

  if (typeof node !== "function") {
    return node as Node;
  }

  return getNode((node as () => Node)());
}
