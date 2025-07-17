import { declare } from "@babel/helper-plugin-utils";

import { loopMetadata } from "../get-metadata";

const fileSet = new Set<string>();

export const metadataCollectorPlugin = declare(() => {
  return {
    name: "loop-metadata-collector",
    pre(file) {
      if (file.opts.filename) fileSet.add(file.opts.filename);
    },
    post() {
      loopMetadata([...fileSet]); // Pass to ts-morph after all files
    },
    visitor: {}, // no transformation here
  };
});
