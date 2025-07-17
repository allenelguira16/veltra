'use strict';

var vynn = require('vynn');
var vynnRouter = require('vynn-router');
var parseRoute = require('./parse-route-Dv6iTiKO.js');
var jsxRuntime = require('vynn/server/jsx-runtime');
require('vinxi/routes');

const createClient = () => {
  vynn.hydrateApp(() => jsxRuntime.jsx(vynnRouter.Router, {
    url: () => location.pathname,
    routes: () => parseRoute.routes
  })).mount("#app");
};

exports.createClient = createClient;
//# sourceMappingURL=client.js.map
