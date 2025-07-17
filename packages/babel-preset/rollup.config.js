import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import filesize from "rollup-plugin-filesize";

const { default: pkg } = await import("./package.json", {
  with: { type: "json" },
});

const IS_DEV = process.env.NODE_ENV === "development";

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
];

export default defineConfig([
  {
    input: "src/index.ts",
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
        exports: "named",
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      del({ targets: "dist/*", runOnce: IS_DEV }),
      json(),
      resolve(),
      commonjs(),
      esbuild({
        tsconfig: "./tsconfig.json",
        minify: !IS_DEV,
      }),
      filesize({
        showGzippedSize: true,
        showBrotliSize: true,
      }),
    ],
  },
  {
    input: "src/index.ts",
    external,
    output: {
      dir: "dist/types",
      format: "es",
    },
    plugins: [dts()],
  },
]);
