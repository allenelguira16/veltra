import { defineConfig } from "vite";
import veltraPlugin from "vite-plugin-veltra";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), veltraPlugin(), tailwindcss()],
});
