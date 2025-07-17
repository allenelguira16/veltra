import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import veltra from "vite-plugin-veltra";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    veltra(),
    tailwindcss(),
    sitemap({ hostname: "http://localhost:4173/" }),
  ],
});
