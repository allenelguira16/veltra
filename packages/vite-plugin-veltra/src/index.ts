import { transform } from "@babel/core";
// @ts-expect-error - not typed
import babelPluginTS from "@babel/preset-typescript";
import type { Plugin } from "vite";

import babelPluginVeltra from "../../babel-preset-veltra/src/index";

/**
 * vite plugin for veltra
 *
 * @returns The vite plugin.
 */
export default function vitePlugin(): Plugin {
  return {
    name: "vite-plugin-veltra",
    enforce: "pre",
    transform: (code, filename) => {
      if (/\.(tsx?|jsx?)$/.test(filename)) {
        const result = transform(code, {
          filename,
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
}
