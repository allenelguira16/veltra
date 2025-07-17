import "./main.css";

import { hydrateApp, onMount } from "vynn";
import { Router } from "vynn-router";

import { routes } from "./routes";

hydrateApp(() => {
  onMount(() => {
    console.log("mounted root");
  });

  return (
    <>
      {() => {
        console.log("suspense-child top");
        return null;
      }}
      <Router url={location.pathname} routes={routes} />
    </>
  );
}).mount("#app");
