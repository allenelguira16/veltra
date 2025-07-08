import { UNIT_LESS_PROPS } from "~/const";

import { effect } from "../../reactivity";
import { addEventListener, removeEventListener } from "./event-registry";

/**
 * apply the properties to the element
 *
 * @param element - The element to apply the properties to.
 * @param props - The properties to apply.
 */
export function applyProps(element: HTMLElement, props: Record<string, any>) {
  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const type = key.slice(2).toLowerCase();
      let cleanup: () => void;

      effect(() => {
        // Remove the previous listener if there was one
        if (cleanup) cleanup();

        const fn = props[key]();
        if (typeof fn === "function") {
          addEventListener(element, type, fn);
          // Setup cleanup for next effect run
          cleanup = () => removeEventListener(element, type);
        }
      });
    } else {
      const run = () => {
        const value = typeof props[key] === "function" && key !== "ref" ? props[key]() : props[key];

        if (key === "ref") {
          value(element);
        } else if (key === "style") {
          applyStyle(element, value);
        } else if (key === "disabled") {
          element.toggleAttribute(key, value);
        } else {
          element.setAttribute(key, value);
        }
      };
      effect(() => {
        try {
          run();
        } catch (error) {
          if (error instanceof Promise) {
            error.then(run);
          } else {
            throw error;
          }
        }
      });
    }
  }
}

/**
 * apply the style to the element
 *
 * @param element - The element to apply the style to.
 * @param style - The style to apply.
 */
function applyStyle(element: HTMLElement, style: Record<string, any>) {
  if (!(element instanceof HTMLElement)) return;

  for (const [key, value] of Object.entries(style)) {
    const cssKey = key as keyof CSSStyleDeclaration;
    if (cssKey === "length" || cssKey === "parentRule") continue;

    const isNumber = typeof value === "number";
    const needsUnit = isNumber && !isUnitLessCSSProperty(key);
    const finalValue = needsUnit ? `${value}px` : String(value);

    element.style.setProperty(String(cssKey), finalValue);
  }
}

/**
 * check if a property is a unit less CSS property
 *
 * @param prop - The property to check.
 * @returns True if the property is a unit less CSS property.
 */
function isUnitLessCSSProperty(prop: string): boolean {
  const unitLessProps = new Set(UNIT_LESS_PROPS);

  return unitLessProps.has(prop);
}
