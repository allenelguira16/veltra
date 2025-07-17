/// <reference types="vinxi/types/server" />

import pretty from "pretty";
import { eventHandler } from "vinxi/http";
import { getManifest } from "vinxi/manifest";
import { JSX } from "vynn";
import { renderToString } from "vynn/server";
import { Router } from "vynn-router";

import { routes } from "./parse-route";

// import Root from "./root";

export let Assets: () => JSX.Element;
export let Scripts: () => JSX.Element;
export let VynnApp: () => JSX.Element;

export function createServer(Root: () => JSX.Element) {
  return eventHandler(async (event) => {
    const clientManifest = getManifest("client");

    const rawAssets = await clientManifest.inputs[clientManifest.handler].assets();

    type Assets = ((typeof rawAssets)[number] & { children: string })[];
    Assets = () =>
      (rawAssets as Assets).map(({ tag: Tag, attrs, children }) => (
        <Tag {...attrs}>{children}</Tag>
      ));

    Scripts = () => [
      <script html={`window.manifest = ${JSON.stringify(clientManifest.json())}`} />,
      <script type="module" src={clientManifest.inputs[clientManifest.handler].output.path} />,
    ];

    VynnApp = () => (
      <div id="app">
        <Router url={event.path} routes={routes} />
      </div>
    );

    const html = "<!doctype html>" + renderToString(() => <Root />);

    if (import.meta.env.PROD) return html;

    return pretty(html, { ocd: true });
  });
}
