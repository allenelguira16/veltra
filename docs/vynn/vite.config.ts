import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import sitemap from "vite-plugin-sitemap";
import vynn from "vite-plugin-vynn";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [
    vynn(),
    tailwindcss(),
    tsconfigPaths(),
    sitemap({ hostname: "http://localhost:4173/" }),
  ],
});
