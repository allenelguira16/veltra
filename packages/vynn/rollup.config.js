import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import filesize from "rollup-plugin-filesize";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";

const { default: pkg } = await import("./package.json", {
  with: { type: "json" },
});

const input = {
  index: "src/index.ts",
  "jsx-runtime": "src/jsx-runtime.ts",
  server: "src/server/index.ts",
  "server/jsx-runtime": "src/server/jsx-runtime.ts",
};

const IS_DEV = process.env.NODE_ENV === "development";

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
];

export default defineConfig([
  {
    input,
    external,
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
        entryFileNames: "esm/[name].js",
        chunkFileNames: "esm/chunks/[name]-[hash].js",
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        entryFileNames: "cjs/[name].js",
        chunkFileNames: "cjs/chunks/[name]-[hash].js",
      },
    ],
    plugins: [
      del({ targets: "dist/*", runOnce: IS_DEV }),
      tsConfigPaths(),
      resolve(),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-typescript", "@babel/preset-vynn"],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      esbuild({
        tsconfig: "tsconfig.json",
        minify: !IS_DEV,
      }),
      !IS_DEV &&
        filesize({
          showGzippedSize: true,
          showBrotliSize: true,
        }),
    ].filter(Boolean),
  },
  {
    input,
    external,
    output: {
      dir: "dist/types",
      format: "es",
      paths: undefined,
    },
    plugins: [tsConfigPaths(), dts()],
  },
]);
