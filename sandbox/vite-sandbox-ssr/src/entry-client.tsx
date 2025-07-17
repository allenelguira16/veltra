import { hydrateApp } from "@veltra/app";

import { App } from "./App";
const app = hydrateApp(App);

app.mount("#app");
