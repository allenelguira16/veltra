export function hSSR(
  type: string | Function,
  props: Record<string, any>,
  children: JSX.Element[]
) {
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  return `<${type} ${handlePropsSSR(props)}>${handleChildrenSSR(
    children
  )}</${type}>`;
}

function handlePropsSSR(props: Record<string, any>) {
  const transformedProps: string[] = [];

  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      continue;
    }

    const value = typeof props[key] === "function" ? props[key]() : props[key];

    if (key === "ref" && typeof value === "function") {
      // value($element);
    } else if (key === "style") {
      // applyStyle($element, value);
    } else if (key === "disabled") {
      value && transformedProps.push("disabled");
    } else {
      transformedProps.push(`${key}=\"${value}\"`);
    }
  }

  return transformedProps.join(" ");
}

function handleChildrenSSR(children: JSX.Element[]) {
  let transformedChildren: string[] = [];

  for (const child of children) {
    if (typeof child === "function") {
      transformedChildren.push(child());
    } else if (Array.isArray(child)) {
      // RECURSIVELY flatten nested arrays
      child.forEach((nested) =>
        transformedChildren.push(handleChildrenSSR([nested]))
      );
    } else {
      // console.log(child);
      transformedChildren.push(child as string);
      // return child
      // const childRef = getNode(child) as Node;

      // $parent.appendChild(childRef);
      // mountSpecialComponent(childRef);
    }
  }

  return transformedChildren.join("");
}
