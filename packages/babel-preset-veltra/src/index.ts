import { TransformOptions } from "@babel/core";
import { babelPlugin } from "./babelPlugin";
// @ts-ignore
import babelReactPlugin from "@babel/preset-react";

// Main preset function
export default function babelPresetVeltra(api: {
  assertVersion: (range: number) => void;
}): TransformOptions {
  api.assertVersion(7);

  return {
    presets: [
      [
        babelReactPlugin,
        {
          runtime: "automatic",
          importSource: "@veltra/app",
        },
      ],
    ],
    plugins: [babelPlugin],
  };
}
