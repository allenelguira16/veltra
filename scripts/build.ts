import { execSync } from "child_process";

const workspaces = [
  "@babel/preset-veltra",
  "vite-plugin-veltra",
  "@veltra/app",
];

for (const workspace of workspaces) {
  console.clear();
  try {
    console.log(`Building for ${workspace}`);
    execSync(`yarn workspace ${workspace} build`, { stdio: "inherit" });
  } catch (error) {
    console.error(error);
    process.exit(1); // stop on failure
  }
}

console.clear();
console.log("Done building packages");
