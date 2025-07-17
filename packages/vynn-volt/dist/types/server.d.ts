import * as vinxi_http from 'vinxi/http';
import { JSX } from 'vynn';

declare let Assets: () => JSX.Element;
declare let Scripts: () => JSX.Element;
declare let VynnApp: () => JSX.Element;
declare function createServer(Root: () => JSX.Element): vinxi_http.EventHandler<vinxi_http.EventHandlerRequest, Promise<string>>;

export { Assets, Scripts, VynnApp, createServer };
