import { effect, state, store } from "@veltra/app";

export type Route = {
  path: string;
  component?: (props: { children: () => JSX.Element }) => JSX.Element;
  children?: Route[];
  guard?: () => boolean;
  lazy?: () => Promise<{ default: (props: { children: () => JSX.Element }) => JSX.Element }>;
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
  basePath = "",
): { chain: Route[]; params: Record<string, string> } | undefined {
  const fullPath = (prefix: string, sub: string) => (prefix + "/" + sub).replace(/\/+/g, "/");
  const pathSegments = path.split("/").filter(Boolean);

  for (const route of routes) {
    const fullRoutePath = fullPath(basePath, route.path);
    const routeSegments = fullRoutePath.split("/").filter(Boolean);

    if (routeSegments.length > pathSegments.length) continue;

    const params: Record<string, string> = {};
    let matched = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const routePart = routeSegments[i];
      const pathPart = pathSegments[i];

      if (routePart.startsWith(":")) {
        params[routePart.slice(1)] = pathPart;
      } else if (routePart !== pathPart) {
        matched = false;
        break;
      }
    }

    if (!matched) continue;

    if (routeSegments.length === pathSegments.length) {
      return { chain: [route], params };
    }

    if (route.children) {
      const childMatch = matchRoute(path, route.children, fullRoutePath);
      if (childMatch) {
        return {
          chain: [route, ...childMatch.chain],
          params: { ...params, ...childMatch.params },
        };
      }
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
      const { chain, params: extractedParams } = matched;

      // Clear and assign params
      for (const key in params) delete params[key];
      Object.assign(params, extractedParams);

      const lastRoute = chain[chain.length - 1];
      if (lastRoute.guard && !lastRoute.guard()) {
        current.value = () => <div>Access Denied</div>;
        return;
      }

      current.value = () => buildComponentTree(chain);
    } else {
      for (const key in params) delete params[key];
      current.value = () => <></>;
    }
  });

  return () => {
    const Comp = current.value;
    return <Comp />;
  };
}

function buildComponentTree(chain: Route[]): JSX.Element {
  let current: JSX.Element = <></>;

  for (let i = chain.length - 1; i >= 0; i--) {
    const route = chain[i];

    if (route.lazy) {
      // Optional: support async lazy chain, currently we just fallback
      current = <div>Loading...</div>;
    } else if (route.component) {
      const prev = current;
      current = route.component({ children: () => prev });
    }
  }

  return current;
}

export function Link({
  children,
  href,
  activeClass,
  class: className,
}: {
  children: () => JSX.Element;
  href: string;
  activeClass?: string;
  class?: string;
}) {
  return (
    <a
      href={href}
      class={(className + (isActiveRoute(href) ? ` ${activeClass}` : "")).trim()}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
    >
      {children()}
    </a>
  );
}
