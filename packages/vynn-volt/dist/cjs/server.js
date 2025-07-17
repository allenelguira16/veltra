'use strict';

var pretty = require('pretty');
var http = require('vinxi/http');
var manifest = require('vinxi/manifest');
var server = require('vynn/server');
var vynnRouter = require('vynn-router');
var parseRoute = require('./parse-route-Dv6iTiKO.js');
var jsxRuntime = require('vynn/server/jsx-runtime');
require('vinxi/routes');

exports.Assets = void 0;
exports.Scripts = void 0;
exports.VynnApp = void 0;
function createServer(Root) {
  return http.eventHandler(async (event) => {
    const clientManifest = manifest.getManifest("client");
    const rawAssets = await clientManifest.inputs[clientManifest.handler].assets();
    exports.Assets = () => rawAssets.map(({
      tag: Tag,
      attrs,
      children
    }) => jsxRuntime.jsx(Tag, {
      ...attrs,
      children: () => children
    }));
    exports.Scripts = () => [jsxRuntime.jsx("script", {
      html: () => `window.manifest = ${JSON.stringify(clientManifest.json())}`
    }), jsxRuntime.jsx("script", {
      type: () => "module",
      src: () => clientManifest.inputs[clientManifest.handler].output.path
    })];
    exports.VynnApp = () => jsxRuntime.jsx("div", {
      id: () => "app",
      children: () => jsxRuntime.jsx(vynnRouter.Router, {
        url: () => event.path,
        routes: () => parseRoute.routes
      })
    });
    const html = "<!doctype html>" + server.renderToString(() => jsxRuntime.jsx(Root, {}));
    if (undefined.PROD) return html;
    return pretty(html, {
      ocd: true
    });
  });
}

exports.createServer = createServer;
//# sourceMappingURL=server.js.map
