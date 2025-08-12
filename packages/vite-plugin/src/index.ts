import { transform } from "@babel/core";
// @ts-expect-error - not typed
import babelPluginTS from "@babel/preset-typescript";
import type { Plugin } from "vite";

import babelPluginVynn from "../../babel-preset/src/index";

/**
 * vite plugin for vynn
 *
 * @returns The vite plugin.
 */
export default function vitePlugin(): Plugin {
  return {
    name: "vite-plugin-vynn",
    enforce: "pre",
    transform(code, filename) {
      if (/\.(t|j)sx?$/.test(filename)) {
        const result = transform(code, {
          filename,
          sourceMaps: true,
          presets: [babelPluginVynn, babelPluginTS],
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
}
