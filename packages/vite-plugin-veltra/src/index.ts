import { transformAsync } from "@babel/core";
// @ts-expect-error - babel-preset-typescript is not typed
import babelPluginTS from "@babel/preset-typescript";
import babelPluginVeltra from "@babel/preset-veltra";
import type { Plugin } from "vite";

/**
 * vite plugin for veltra
 *
 * @returns The vite plugin.
 */
const vitePlugin = (): Plugin => {
  return {
    name: "vite-plugin-veltra",
    enforce: "pre",
    async transform(code, id) {
      if (/\.(tsx?|jsx?)$/.test(id)) {
        const result = await transformAsync(code, {
          filename: id,
          sourceMaps: true,
          presets: [babelPluginVeltra, babelPluginTS],
        });

        if (result?.code) {
          return {
            code: result.code,
            map: result.map,
          };
        }
      }
    },
  };
};

export default vitePlugin;
