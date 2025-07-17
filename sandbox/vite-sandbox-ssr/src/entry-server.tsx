import "./main.css";

import { renderToString } from "vynn/server";
import { Router } from "vynn-router";

import { routes } from "./routes";

export const render = (url: string) => {
  return renderToString(() => <Router url={url} routes={routes} />);
};
