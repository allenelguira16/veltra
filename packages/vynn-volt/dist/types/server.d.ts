import * as vinxi_http from 'vinxi/http';
import { JSX } from 'vynn';
import { AppProps } from './index.js';
import 'vinxi';
import 'vite';

declare const renderServer: (App: (props: AppProps) => JSX.Element) => vinxi_http.EventHandler<vinxi_http.EventHandlerRequest, Promise<string>>;

export { renderServer };
