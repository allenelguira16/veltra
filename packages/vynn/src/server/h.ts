import { getSuspenseSSRHandler } from "~/component";
import { resolveComponentProps } from "~/render/mount-component/resolve-component-props";

import { applyProps } from "./apply-props";
import { getNode } from "./get-node";
import { JSX } from "./jsx-runtime";
import { renderChildrenToString } from "./render-children-to-string";

const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * Create a JSX element for SSR
 *
 * @param type - The type of the element.
 * @param props - The properties of the element.
 * @param children - The children of the element.
 * @returns The JSX element for SSR.
 */
export function h<T extends Record<string, any> & { children?: (...args: any[]) => string }>(
  type: string | ((props: T) => string | (() => string)),
  props: Record<string, any>,
  children?: T["children"],
) {
  if (typeof type === "function") {
    resolveComponentProps(type, props);

    const resolved = type({ ...props, children } as T);
    const handler = getSuspenseSSRHandler();
    try {
      return normalizeToString(resolved);
    } catch (error) {
      if (error instanceof Promise) {
        return handler?.() || null;
      }

      throw error;
    }
  }

  if (voidElements.has(type)) {
    return `<${type}${applyProps(props)}>`;
  }

  return `<${type}${applyProps(props)}>${renderChildrenToString(type, "html" in props ? props["html"] : children)}</${type}>`;
}

function normalizeToString(value: JSX.Element): string {
  if (value == null) return "";

  if (typeof value === "function") {
    return normalizeToString(value());
  }

  if (Array.isArray(value)) {
    return value.map(normalizeToString).join("");
  }

  return getNode(value);
}
