import { effect, state, store } from "@veltra/app";

export type Route = {
  path: string;
  component: () => JSX.Element;
  children?: Route[];
  guard?: () => boolean;
  lazy?: () => Promise<{ default: () => JSX.Element }>;
};

export type Location = {
  pathname: string;
  search: string;
};

export const location = store<Location>({
  pathname: window.location.pathname,
  search: window.location.search,
});

window.addEventListener("popstate", () => {
  location.pathname = window.location.pathname;
});

/**
 * navigate to a path
 *
 * @param path - The path to navigate to.
 */
export function navigate(path: string) {
  history.pushState(null, "", path);
  location.pathname = path;
}

export function isActiveRoute(path: string, exact = true): boolean {
  const current = location.pathname;
  const currentParts = current.split("/").filter(Boolean);
  const targetParts = path.split("/").filter(Boolean);

  if (exact && currentParts.length !== targetParts.length) return false;
  if (!exact && currentParts.length < targetParts.length) return false;

  return targetParts.every((part, i) => {
    return part.startsWith(":") || part === currentParts[i];
  });
}

function matchRoute(
  path: string,
  routes: Route[],
): { route: Route; params: Record<string, string> } | undefined {
  const pathSegments = path.split("/").filter(Boolean);

  for (const route of routes) {
    const routeSegments = route.path.split("/").filter(Boolean);

    if (routeSegments.length !== pathSegments.length) continue;

    const params: Record<string, string> = {};
    let matched = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const segment = routeSegments[i];
      const part = pathSegments[i];

      if (segment.startsWith(":")) {
        params[segment.slice(1)] = part;
      } else if (segment !== part) {
        matched = false;
        break;
      }
    }

    if (matched) return { route, params };

    if (route.children) {
      const child = matchRoute(path, route.children);
      if (child) return child;
    }
  }

  return undefined;
}

export const params = store<Record<string, string>>({});

/**
 * create a router
 *
 * @param props - The properties of the router.
 * @returns The router.
 */
export function Router({ routes }: { routes: Route[] }) {
  const current = state<() => JSX.Element>(() => <></>);

  effect(() => {
    const matched = matchRoute(location.pathname, routes);

    if (matched) {
      const { route, params: extractedParams } = matched;

      // Set the extracted params to the reactive store
      for (const key in params) delete params[key];
      Object.assign(params, extractedParams);

      if (route.guard && !route.guard()) {
        current.value = () => <div>Access Denied</div>;
        return;
      }

      if (route.lazy) {
        route.lazy().then((mod) => {
          current.value = mod.default;
        });
        return;
      }

      current.value = route.component;
    } else {
      for (const key in params) delete params[key];
      current.value = () => <div>404 Not Found</div>;
    }
  });

  return () => current.value();
}
