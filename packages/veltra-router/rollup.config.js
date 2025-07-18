import babel from "@rollup/plugin-babel";
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
  index: "src/index.tsx",
};

const IS_DEV = process.env.NODE_ENV === "development";

export default defineConfig([
  {
    input,
    external: [
      "@veltra/app",
      "@veltra/app/jsx-runtime",
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ],
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
      del({ targets: "dist/*", runOnce: IS_DEV, verbose: true }),
      tsConfigPaths(),
      resolve(),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-typescript", "@babel/preset-veltra"],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      esbuild({
        tsconfig: "tsconfig.json",
        minify: !IS_DEV,
      }),
    ],
  },
  {
    input,
    external: [
      "@veltra/app",
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ],
    output: {
      dir: "dist/types",
      format: "es",
    },
    plugins: [tsConfigPaths(), dts()],
  },
]);
