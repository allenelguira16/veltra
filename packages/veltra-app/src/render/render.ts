import { handleChildren } from "./handleChildren";
import { handleProps } from "./handleProps";

export function createRoot($root: HTMLElement, app: JSX.Element) {
  if (app instanceof HTMLElement) $root.appendChild(app);
}

export let currentRenderingDOM: HTMLElement;

export function h(
  type: string | Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  const $element = document.createElement(type);

  handleProps($element, props);

  handleChildren($element, children);

  return $element;
}

export function setCurrentRenderingDOM(dom: HTMLElement) {
  currentRenderingDOM = dom;
}

export function Fragment({ children }: { children: any[] }) {
  return children;
}
