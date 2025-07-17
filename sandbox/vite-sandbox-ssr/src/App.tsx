import { state } from "vynn";
import { Router } from "vynn-router";

import { routes } from "./routes";

export const App = ({ url }: { url: string }) => {
  const i = state(0);

  setInterval(() => {
    i.value++;
  }, 1000);

  return <Router url={url} routes={routes} />;
};
