// import fs from "node:fs";

// import tailwindcss from "@tailwindcss/vite";
// // @ts-expect-error no type
// import { serverFunctions } from "@vinxi/server-functions/plugin";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
// import { AppOptions, createApp, RouterSchemaInput } from "vinxi";
// import { BaseFileSystemRouter, cleanPath } from "vinxi/fs-router";
// import { PluginOption } from "vite";
// import vynn from "vite-plugin-vynn";
// import tsconfigPaths from "vite-tsconfig-paths";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// class VynnFileSystemRouter extends BaseFileSystemRouter {
//   toPath(filePath: string) {
//     // only treat "page.tsx/ts/jsx/js" as routes
//     if (!/page\.(t|j)sx?$/.test(path.basename(filePath))) {
//       return "";
//     }

//     const routePath = cleanPath(filePath, this.config)
//       .replace(/\/page$/, "") // remove trailing /page
//       .replace(/\[([^/]+)\]/g, (_, m) => {
//         if (m.startsWith("...")) return `*${m.slice(3)}`;
//         return `:${m}`;
//       });

//     return routePath?.length > 0 ? `${routePath}` : "/";
//   }

//   toRoute(filePath: string) {
//     const routePath = this.toPath(filePath);
//     if (!routePath) return null; // skip non-page files

//     const dir = path.dirname(filePath);
//     const layoutFilePath = path.join(dir, "layout.tsx");

//     return {
//       $$component: {
//         src: filePath,
//         pick: ["default"],
//       },
//       ...(fs.existsSync(layoutFilePath)
//         ? {
//             $$layout: {
//               src: layoutFilePath,
//               pick: ["default"],
//             },
//           }
//         : {}),
//       path: routePath,
//       filePath,
//     };
//   }
// }

// type RouterOptions = {
//   dir: string;
// };

// function fileSystemRouter({ dir }: RouterOptions) {
//   return (router: RouterSchemaInput, app: AppOptions) => {
//     // const appDir = path.join(__dirname, dir);

//     return new VynnFileSystemRouter(
//       {
//         dir,
//         extensions: ["tsx", "ts", "jsx", "js"],
//       },
//       router,
//       app,
//     );
//   };
// }

// type DefineConfig = {
//   plugins: PluginOption[];
//   server?: AppOptions["server"];
// };

// function defineConfig({ plugins, server = {} }: DefineConfig) {
//   const rootDir = process.cwd();
//   return createApp({
//     devtools: true,
//     server: {
//       compressPublicAssets: {
//         brotli: process.versions.bun ? false : true,
//       },
//       ...server,
//     },
//     routers: [
//       {
//         name: "public",
//         type: "static",
//         dir: path.resolve(rootDir, "./public"),
//         base: "/",
//       },
//       {
//         name: "ssr",
//         type: "http",
//         base: "/",
//         target: "server",
//         handler: path.resolve(rootDir, "./src/entry-server.tsx"),
//         plugins: () => [vynn({ ssr: true }), tsconfigPaths(), ...plugins],
//         routes: fileSystemRouter({ dir: path.resolve(rootDir, "./src/app") }),
//         link: {
//           client: "client",
//         },
//       },
//       {
//         name: "client",
//         type: "client",
//         base: "/_build",
//         target: "browser",
//         handler: path.resolve(rootDir, "./src/entry-client.tsx"),
//         plugins: () => [serverFunctions.client(), vynn({ ssr: true }), tsconfigPaths(), ...plugins],
//         routes: fileSystemRouter({ dir: path.resolve(rootDir, "./src/app") }),
//       },
//       serverFunctions.router({ plugins: () => [tsconfigPaths()] }),
//     ],
//   });
// }

// export default defineConfig({
//   plugins: [tailwindcss()],
// });

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@vynn/volt";

export default defineConfig({
  plugins: [tailwindcss()],
});
