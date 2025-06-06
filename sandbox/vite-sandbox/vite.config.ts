import { defineConfig } from "vite";
import veltraPlugin from "vite-plugin-veltra";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import sitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    veltraPlugin(),
    tailwindcss(),
    sitemap({ hostname: "http://localhost:4173/" }),
  ],
});
