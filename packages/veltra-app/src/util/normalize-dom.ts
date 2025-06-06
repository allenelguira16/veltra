export const normalizeDom = (children: JSX.Element) => {
  return (Array.isArray(children) ? children : [children]).flat();
};
