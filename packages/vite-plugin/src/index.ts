import { transform } from "@babel/core";
// @ts-expect-error - not typed
import babelPluginTS from "@babel/preset-typescript";
import babelPluginVynn from "@babel/preset-vynn";
import { PluginOption } from "vite";

type VitePluginVynnOptions = {
  ssr: boolean;
};

/**
 * vite plugin for vynn
 *
 * @returns The vite plugin.
 */
export default (options: VitePluginVynnOptions = { ssr: false }) => {
  return {
    name: "vite-plugin-vynn",
    enforce: "pre",

    transform(code, id) {
      const [filename] = id.split("?", 2);

      if (/\.(t|j)sx($|\?)/.test(filename)) {
        const result = transform(code, {
          filename,
          sourceMaps: true,
          presets: [[babelPluginVynn, options], babelPluginTS],
        });

        if (result?.code) {
          return {
            code: result.code,
            map: result.map,
          };
        }
      }
    },
  } satisfies PluginOption;
};
