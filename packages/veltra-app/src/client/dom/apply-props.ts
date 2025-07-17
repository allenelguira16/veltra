import { UNIT_LESS_PROPS } from "~/const";
import { effect } from "~/reactivity";

import { addEventListener, removeEventListener } from "./event-registry";

/**
 * apply the properties to the element
 *
 * @param element - The element to apply the properties to.
 * @param props - The properties to apply.
 */
export function applyProps(element: HTMLElement, props: Record<string, any>) {
  for (const key in props) {
    effect(() => {
      const raw = props[key];
      const value = typeof raw === "function" && key !== "ref" ? raw() : raw;

      // Event listeners
      if (key.startsWith("on") && typeof value === "function") {
        const type = key.slice(2).toLowerCase();
        addEventListener(element, type, value);
        return () => removeEventListener(element, type);
      }

      // Controlled form elements: <input>, <textarea>, <select>
      const isFormControl =
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement;

      if (
        key === "value" &&
        isFormControl &&
        typeof props["onInput"] !== "function" &&
        typeof props["onChange"] !== "function"
      ) {
        // Force revert if no handler is present
        element.value = value;

        const revert = () => {
          if (element.value !== value) {
            element.value = value;
          }
        };

        element.setAttribute(key, value);
        element.addEventListener("input", revert);
        return () => element.removeEventListener("input", revert);
      }

      // Ref
      if (key === "ref" && typeof value === "function") {
        value(element);
        return;
      }

      // Style
      if (key === "style") {
        applyStyle(element, value);
        return;
      }

      // Boolean attributes
      if (typeof value === "boolean") {
        element.toggleAttribute(key, value);
        return;
      }

      if (key === "html" && typeof value === "string") {
        // Set inner HTML
        element.innerHTML = value;
        return;
      }

      // Default attribute handling
      element.setAttribute(key, value);
    });
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
