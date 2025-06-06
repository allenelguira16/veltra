export const toArray = <T>(item: T) => {
  return (Array.isArray(item) ? item : [item]).flat(Infinity) as T[];
};
