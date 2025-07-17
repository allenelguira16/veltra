import { ConfigAPI, TransformOptions } from '@babel/core';

/**
 * babel preset for veltra
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
declare function babelPresetVeltra(api: ConfigAPI): TransformOptions;

export { babelPresetVeltra as default };
