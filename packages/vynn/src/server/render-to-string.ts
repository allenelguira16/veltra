import { JSX } from "~/jsx-runtime";

// export const isServer = typeof window === "undefined";

export function renderToString(App: () => JSX.Element) {
  return App() as string;
}
