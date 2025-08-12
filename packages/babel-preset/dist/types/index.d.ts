import { ConfigAPI, TransformOptions } from '@babel/core';

/**
 * babel preset for vynn
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
declare function babelPresetVynn(api: ConfigAPI): TransformOptions;

export { babelPresetVynn as default };
