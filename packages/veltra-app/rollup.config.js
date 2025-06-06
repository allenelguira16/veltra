import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import del from "rollup-plugin-delete";

const { default: pkg } = await import("./package.json", {
  with: { type: "json" },
});

const input = {
  index: "src/index.ts",
  "jsx-runtime": "src/jsx-runtime.ts",
};

const IS_DEV = process.env.NODE_ENV === "development";

export default defineConfig([
  {
    input,
    external: Object.keys(pkg.dependencies),
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
      del({ targets: "dist/*", verbose: true }),
      esbuild({
        tsconfig: "tsconfig.json",
        minify: !IS_DEV,
      }),
    ],
  },
  {
    input,
    external: Object.keys(pkg.dependencies),
    output: {
      dir: "dist/types",
      format: "es",
    },
    plugins: [dts()],
  },
]);
