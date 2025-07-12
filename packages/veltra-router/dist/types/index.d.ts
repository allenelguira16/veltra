type Route = {
    path: string;
    component: () => JSX.Element;
    children?: Route[];
    guard?: () => boolean;
    lazy?: () => Promise<{
        default: () => JSX.Element;
    }>;
};
type Location = {
    pathname: string;
    search: string;
};
declare const location: Location;
/**
 * navigate to a path
 *
 * @param path - The path to navigate to.
 */
declare function navigate(path: string): void;
declare function isActiveRoute(path: string, exact?: boolean): boolean;
declare const params: Record<string, string>;
/**
 * create a router
 *
 * @param props - The properties of the router.
 * @returns The router.
 */
declare function Router({ routes }: {
    routes: Route[];
}): () => JSX.Element;

export { Router, isActiveRoute, location, navigate, params };
export type { Location, Route };
