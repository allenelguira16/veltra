import { transform } from "@babel/core";
// @ts-expect-error - not typed
import babelPluginTS from "@babel/preset-typescript";
import type { Plugin } from "vite";

import babelPluginVynn from "../../babel-preset/src/index";

type VitePluginVynnOptions = {
  ssr: boolean;
};

/**
 * vite plugin for vynn
 *
 * @returns The vite plugin.
 */
export default (options: VitePluginVynnOptions = { ssr: false }): Plugin => {
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
  };
};

// const ssrCSSDev = (): Plugin => {
//   const virtualCssPath = "/@virtual:ssr-css.css";

//   const collectedStyles = new Map<string, string>();

//   let server: ViteDevServer;

//   return {
//     name: "vite-plugin-ssr-css-dev",
//     apply: "serve",
//     transform(code: string, id: string) {
//       if (id.includes("node_modules")) return null;
//       if (id.includes(".css")) {
//         collectedStyles.set(id, code);
//       }
//       return null;
//     },
//     configureServer(server_) {
//       server = server_;

//       server.middlewares.use((req, _res, next) => {
//         if (req.url === virtualCssPath) {
//           _res.setHeader("Content-Type", "text/css");
//           _res.write(Array.from(collectedStyles.values()).join("\n"));
//           _res.end();
//           return;
//         }
//         next();
//       });
//     },

//     transformIndexHtml: {
//       handler: async () => {
//         return [
//           {
//             tag: "link",
//             injectTo: "head",
//             attrs: {
//               rel: "stylesheet",
//               href: virtualCssPath,
//             },
//           },
//         ];
//       },
//     },
//   };
// };
