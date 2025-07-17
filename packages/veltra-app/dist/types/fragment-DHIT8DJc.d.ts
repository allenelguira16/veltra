/**
 * Create a fragment
 *
 * @param children - The children of the fragment.
 * @returns The fragment.
 */
declare function Fragment({ children }: {
    children: JSX.Element[];
}): JSX.Element[];

export { Fragment as F };
