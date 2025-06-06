import { execSync } from "child_process";

const workspaces = [
  "@babel/preset-veltra",
  "vite-plugin-veltra",
  "@veltra/app",
];

for (const workspace of workspaces) {
  try {
    console.log(`removing build files for ${workspace}`);
    execSync(`yarn workspace ${workspace} clean`, { stdio: "inherit" });
  } catch (error) {
    console.error(error);
    process.exit(1); // stop on failure
  }
}
