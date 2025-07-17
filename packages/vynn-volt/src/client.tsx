/// <reference types="vinxi/types/client" />

import { hydrateApp } from "vynn";
import { Router } from "vynn-router";

import { routes } from "./parse-route";

export const createClient = () => {
  hydrateApp(() => <Router url={location.pathname} routes={routes} />).mount("#app");
};
