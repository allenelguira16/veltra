import babel from "@rollup/plugin-babel";
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
  index: "src/index.tsx",
};

const IS_DEV = process.env.NODE_ENV === "development";

const external = [
  "vynn",
  "vynn/jsx-runtime",
  "vynn/server",
  "vynn/server/jsx-runtime",
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

export default defineConfig([
  // Transpile JS/TS files
  {
    input,
    external,
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins: [
      del({ targets: "dist/*", runOnce: IS_DEV }),
      tsConfigPaths(),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-vynn", { ssr: true }], "@babel/preset-typescript"],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      }),
      esbuild({
        tsconfig: "tsconfig.json",
        minify: !IS_DEV,
      }),
      filesize({
        showGzippedSize: true,
        showBrotliSize: true,
      }),
    ],
  },

  // Generate type declarations
  {
    input,
    external,
    output: {
      dir: "dist/types",
      format: "es",
    },
    plugins: [tsConfigPaths(), dts()],
  },
]);
