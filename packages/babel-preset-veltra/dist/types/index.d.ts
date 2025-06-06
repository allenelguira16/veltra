import { ConfigAPI, TransformOptions } from '@babel/core';

declare function babelPresetVeltra(api: ConfigAPI): TransformOptions;

export { babelPresetVeltra as default };
