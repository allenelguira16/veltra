import { JSX } from 'vynn';

type Route = {
    path: string;
    component?: () => JSX.Element;
    children?: Route[];
};
type Location = {
    pathname: string;
    search: string;
};
declare const location: Location;
declare function navigate(path: string): void;
declare function isActiveRoute(path: string, exact?: boolean): boolean;
declare const params: Record<string, string>;
declare function Router({ url, routes }: {
    url?: string;
    routes: Route[];
}): () => JSX.Element;
declare function Outlet(): JSX.Element;
declare function Link({ children, href, activeClass, class: className, }: {
    children: () => JSX.Element;
    href: string;
    activeClass?: string;
    class?: string;
}): JSX.Element;

export { Link, Outlet, Router, isActiveRoute, location, navigate, params };
export type { Location, Route };
