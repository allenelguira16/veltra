import "./main.css";

import { createApp } from "@veltra/app";

import { App } from "./App";
// import { StackedSuspense } from "./pages/StackedSuspense";

const app = createApp(App);
// const app = createApp(StackedSuspense);
// const app = createApp(Dropdowns);

app.mount("#app");
