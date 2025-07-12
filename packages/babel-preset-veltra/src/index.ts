import { ConfigAPI, TransformOptions } from "@babel/core";
// @ts-expect-error - babel-preset-react is not typed
import babelReactPlugin from "@babel/preset-react";

import {
  logJsxPlugin,
  loopAutoWrapPlugin,
  wrapComponentChildrenPlugin,
  wrapJSXExpressionsPlugin,
} from "./plugins";

/**
 * babel preset for veltra
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
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
    plugins: [
      logJsxPlugin,
      loopAutoWrapPlugin,
      wrapJSXExpressionsPlugin,
      wrapComponentChildrenPlugin,
    ],
  };
}
