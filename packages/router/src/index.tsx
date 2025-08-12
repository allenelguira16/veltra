import { JSX, store } from "@vynn/core";

export type Route = {
  path: string;
  component?: () => JSX.Element;
  children?: Route[];
  lazy?: () => Promise<JSX.Element>;
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

export function Router({ routes }: { routes: Route[] }) {
  return () => {
    const matched = matchRoute(location.pathname, routes);

    if (matched) {
      const { chain, params: extractedParams } = matched;
      for (const key in params) delete params[key];
      Object.assign(params, extractedParams);

      return buildComponentTree(chain);
    }

    for (const key in params) delete params[key];
    return <></>;
  };
}

const lazyCache = new WeakMap<() => Promise<JSX.Element>, JSX.Element>();

let outletContent: JSX.Element = <></>;

export function Outlet() {
  return outletContent;
}

function buildComponentTree(chain: Route[]): JSX.Element {
  outletContent = <></>;

  for (let i = chain.length - 1; i >= 0; i--) {
    const route = chain[i];

    if (route.lazy) {
      const cached = lazyCache.get(route.lazy);
      if (!cached) {
        const promise = route.lazy().then((el) => {
          lazyCache.set(route.lazy!, el);
        });

        throw promise;
      }

      outletContent = cached;
    } else if (route.component) {
      outletContent = route.component();
    }
  }

  return outletContent;
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
