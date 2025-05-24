import { handleChildren } from "./handleChildren";
import { handleProps } from "./handleProps";

export function createRoot($root: HTMLElement, app: JSX.Element) {
  if (app instanceof HTMLElement) $root.appendChild(app);
}

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

  $element.appendChild(handleChildren(children));

  return $element;
}

export function Fragment({ children }: { children: any[] }) {
  return flatten(children);
}

function flatten(children: any): any[] {
  const result: any[] = [];

  const walk = (child: any) => {
    if (typeof child === "function") {
      child = child();
    }

    if (Array.isArray(child)) {
      for (const c of child) walk(c);
    } else {
      result.push(child);
    }
  };

  walk(children);
  return result;
}
