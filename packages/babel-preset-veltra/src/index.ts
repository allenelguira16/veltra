import { ConfigAPI, TransformOptions } from "@babel/core";
// @ts-expect-error - babel-preset-react is not typed
import jsxTransformPlugin from "@babel/plugin-transform-react-jsx";

import {
  logJsxPlugin,
  loopAutoWrapPlugin,
  wrapJsxChildrenPlugin,
  wrapJsxExpressionsPlugin,
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
    plugins: [
      [
        jsxTransformPlugin,
        {
          runtime: "automatic",
          importSource: "@veltra/app",
        },
      ],
      logJsxPlugin,
      loopAutoWrapPlugin,
      wrapJsxChildrenPlugin,
      wrapJsxExpressionsPlugin,
    ],
  };
}
