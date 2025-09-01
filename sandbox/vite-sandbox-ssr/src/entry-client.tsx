import "./main.css";

import { hydrateApp } from "vynn";
import { Router } from "vynn-router";

import { routes } from "./routes";

hydrateApp(() => <Router url={location.pathname} routes={routes} />).mount("#app");
