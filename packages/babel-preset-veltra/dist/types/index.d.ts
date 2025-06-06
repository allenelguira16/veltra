import { TransformOptions } from '@babel/core';

declare function babelPresetVeltra(api: {
    assertVersion: (range: number) => void;
}): TransformOptions;

export { babelPresetVeltra as default };
