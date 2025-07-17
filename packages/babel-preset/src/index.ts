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
 * babel preset for vynn
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export default function babelPresetVynn(api: ConfigAPI): TransformOptions {
  api.assertVersion(7);

  return {
    plugins: [
      [
        jsxTransformPlugin,
        {
          runtime: "automatic",
          importSource: "vynn",
        },
      ],
      logJsxPlugin,
      loopAutoWrapPlugin,
      wrapJsxChildrenPlugin,
      wrapJsxExpressionsPlugin,
    ],
  };
}
