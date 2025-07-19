import resolve from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import tsConfigPaths from "rollup-plugin-tsconfig-paths";

const { default: pkg } = await import("./package.json", {
  with: { type: "json" },
});

const input = {
  index: "src/index.ts",
  "jsx-runtime": "src/jsx-runtime.ts",
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
      esbuild({
        tsconfig: "tsconfig.json",
        minify: !IS_DEV,
      }),
    ],
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
