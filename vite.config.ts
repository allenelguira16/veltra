import { defineConfig } from "vite";
import miniApp from "./mini-app/miniAppPlugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [miniApp(), tailwindcss()],
});
