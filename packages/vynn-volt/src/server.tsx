/// <reference types="vinxi/types/server" />

import pretty from "pretty";
import { eventHandler } from "vinxi/http";
import { getManifest } from "vinxi/manifest";
import { JSX, NoHydration } from "vynn";
import { renderToString } from "vynn/server";
import { Router } from "vynn-router";

import { AppProps } from ".";
import { routes } from "./parse-route";

export const renderServer = (App: (props: AppProps) => JSX.Element) => {
  return eventHandler(async (event) => {
    // if (event.p)
    const clientManifest = getManifest("client");

    const rawAssets = await clientManifest.inputs[clientManifest.handler].assets();

    type Assets = ((typeof rawAssets)[number] & { children: string })[];
    const assets = () => (
      <>
        {(rawAssets as Assets).map(({ tag: Tag, attrs, children }) => (
          <Tag {...attrs}>{children}</Tag>
        ))}
      </>
    );

    const manifest = await (clientManifest.json() as Promise<object>);

    // TODO: Support NoHydration
    const scripts = () => (
      <NoHydration>
        <script html={`window.manifest = ${JSON.stringify(manifest)}`} />
        <script type="module" src={clientManifest.inputs[clientManifest.handler].output.path} />
      </NoHydration>
    );

    const html =
      "<!doctype html>" +
      renderToString(() => (
        <App assets={assets} scripts={scripts}>
          <div id="app">
            <Router url={event.path} routes={routes} />
          </div>
        </App>
      ));

    event.node.res.setHeader("Content-Type", "text/html");
    if (import.meta.env.PROD) return html;

    return pretty(html);
  });
};
