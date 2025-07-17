import "./main.css";

import { renderToString } from "vynn";

import { App } from "./App";

export const render = (url: string) => {
  console.log(url);
  return renderToString(App);
};
