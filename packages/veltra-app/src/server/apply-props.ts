/**
 * Handle the properties of the element for SSR
 *
 * @param props - The properties of the element.
 * @returns The transformed properties.
 */
export function applyProps(props: Record<string, any>) {
  const transformedProps: string[] = [];

  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      continue;
    }

    const value = typeof props[key] === "function" ? props[key]() : props[key];

    if (key === "ref") {
      continue;
    }

    if (key === "style") {
      // applyStyle($element, value);
      continue;
    }

    if (typeof value === "boolean") {
      if (value) transformedProps.push(key);
      continue;
    }

    transformedProps.push(`${key}="${value}"`);
  }

  return transformedProps.join(" ");
}
