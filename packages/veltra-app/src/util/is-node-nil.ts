export const isNil = (value: unknown): value is null | undefined | false => {
  return value === undefined || value === null || value === false;
};
