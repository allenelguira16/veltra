import { renderChildren } from "./render-children";
import { applyProps } from "./apply-props";
import { mountComponent } from "./mount-component";
import { MATH_ML_TAGS, SVG_TAGS } from "../const";

export function h(
  type: string | Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  if (typeof type === "function") {
    return mountComponent(type, props, children);
  }

  const $element = createElement(type, props.xmlns);

  applyProps($element, props);
  renderChildren($element, children);

  return $element;
}

function createElement(tag: string, namespace?: string) {
  if ((SVG_TAGS.has(tag) || MATH_ML_TAGS.has(tag)) && namespace) {
    return document.createElementNS(namespace, tag);
  }

  return document.createElement(tag);
}
