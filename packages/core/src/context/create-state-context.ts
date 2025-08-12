const stateMap = new Map<string, { states: any[] }>();

/**
 * Creates a state context associated with a specific component key
 */
export const createStateContext = (key?: string) => {
  let instance: { states: any[] };

  if (key !== undefined) {
    if (!stateMap.has(key)) {
      stateMap.set(key, { states: [] });
    }
    instance = stateMap.get(key)!;
  } else {
    instance = { states: [] };
  }

  return { ...instance, index: 0 };
};
