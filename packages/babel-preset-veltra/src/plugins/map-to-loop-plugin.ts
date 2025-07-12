import { PluginObj } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";

/**
 * babel plugin to wrap jsx expressions except loop and handle ref specially
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export const mapToLoopPlugin = declare((api): PluginObj => {
  api.assertVersion(7);

  return {
    name: "wrap-jsx-expressions",
    visitor: {},
  };
});
