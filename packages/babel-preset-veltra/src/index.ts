import { TransformOptions, ConfigAPI } from "@babel/core";
import { babelPlugin } from "./babel-plugin";
// @ts-ignore
import babelReactPlugin from "@babel/preset-react";

// Main preset function
export default function babelPresetVeltra(api: ConfigAPI): TransformOptions {
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
