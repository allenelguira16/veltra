import { PropsWithChildren, JSX } from 'vynn';
import * as vinxi from 'vinxi';
import { AppOptions } from 'vinxi';
import { PluginOption } from 'vite';

type DefineConfig = {
    plugins: PluginOption[];
    server?: AppOptions["server"];
};
declare function defineConfig({ plugins, server }: DefineConfig): vinxi.App;

type AppProps = PropsWithChildren<{
    assets: JSX.Element;
    scripts: JSX.Element;
}>;

export { defineConfig };
export type { AppProps };
