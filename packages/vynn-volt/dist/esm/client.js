import { hydrateApp } from 'vynn';
import { Router } from 'vynn-router';
import { r as routes } from './parse-route-BIk3jRTk.js';
import { jsx } from 'vynn/server/jsx-runtime';
import 'vinxi/routes';

const createClient = () => {
  hydrateApp(() => jsx(Router, {
    url: () => location.pathname,
    routes: () => routes
  })).mount("#app");
};

export { createClient };
//# sourceMappingURL=client.js.map
