import { Plugin } from 'vite';

type VitePluginVynnOptions = {
    ssr: boolean;
};
/**
 * vite plugin for vynn
 *
 * @returns The vite plugin.
 */
declare const _default: (options?: VitePluginVynnOptions) => Plugin;

export { _default as default };
