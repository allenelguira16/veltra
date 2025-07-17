import * as vinxi from 'vinxi';
import { AppOptions } from 'vinxi';
import { PluginOption } from 'vite';

type DefineConfig = {
    plugins: PluginOption[];
    server?: AppOptions["server"];
};
declare function defineConfig({ plugins, server }: DefineConfig): vinxi.App;

export { defineConfig };
