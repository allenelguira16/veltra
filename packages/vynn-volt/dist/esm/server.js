import pretty from 'pretty';
import { eventHandler } from 'vinxi/http';
import { getManifest } from 'vinxi/manifest';
import { renderToString } from 'vynn/server';
import { Router } from 'vynn-router';
import { r as routes } from './parse-route-BIk3jRTk.js';
import { jsx } from 'vynn/server/jsx-runtime';
import 'vinxi/routes';

let Assets;
let Scripts;
let VynnApp;
function createServer(Root) {
  return eventHandler(async (event) => {
    const clientManifest = getManifest("client");
    const rawAssets = await clientManifest.inputs[clientManifest.handler].assets();
    Assets = () => rawAssets.map(({
      tag: Tag,
      attrs,
      children
    }) => jsx(Tag, {
      ...attrs,
      children: () => children
    }));
    Scripts = () => [jsx("script", {
      html: () => `window.manifest = ${JSON.stringify(clientManifest.json())}`
    }), jsx("script", {
      type: () => "module",
      src: () => clientManifest.inputs[clientManifest.handler].output.path
    })];
    VynnApp = () => jsx("div", {
      id: () => "app",
      children: () => jsx(Router, {
        url: () => event.path,
        routes: () => routes
      })
    });
    const html = "<!doctype html>" + renderToString(() => jsx(Root, {}));
    if (import.meta.env.PROD) return html;
    return pretty(html, {
      ocd: true
    });
  });
}

export { Assets, Scripts, VynnApp, createServer };
//# sourceMappingURL=server.js.map
