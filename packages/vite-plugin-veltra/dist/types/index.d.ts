import { Plugin } from 'vite';

/**
 * vite plugin for veltra
 *
 * @returns The vite plugin.
 */
declare const vitePlugin: () => Plugin;

export { vitePlugin as default };
