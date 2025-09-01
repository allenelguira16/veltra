import { ConfigAPI, TransformOptions } from "@babel/core";
// @ts-expect-error - babel-preset-react is not typed
import jsxTransformPlugin from "@babel/plugin-transform-react-jsx";

import {
  logJsxPlugin,
  loopAutoWrapPlugin,
  wrapJsxChildrenPlugin,
  wrapJsxExpressionsPlugin,
  wrapJsxVariables,
} from "./plugins";

type BabelPresetVynnOptions = {
  ssr: boolean;
};

/**
 * babel preset for vynn
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export default function babelPresetVynn(
  api: ConfigAPI,
  opts: BabelPresetVynnOptions = { ssr: false },
): TransformOptions {
  api.assertVersion(7);

  return {
    plugins: [
      [
        jsxTransformPlugin,
        {
          runtime: "automatic",
          importSource: !opts.ssr ? "vynn" : "vynn/server",
          jsx: "preserve",
        },
      ],
      logJsxPlugin,
      wrapJsxVariables,
      loopAutoWrapPlugin,
      wrapJsxChildrenPlugin,
      wrapJsxExpressionsPlugin,
    ],
  };
}
