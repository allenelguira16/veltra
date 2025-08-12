import { JSX } from "~/types";
/**
 * Create a fragment
 *
 * @param children - The children of the fragment.
 * @returns The fragment.
 */
export function Fragment({ children }: { children: () => JSX.Element[] }) {
  // const children = toArray(rawChildren instanceof Function ? rawChildren() : rawChildren);

  // return children;
  return () => (children instanceof Function ? children() : children);
}
