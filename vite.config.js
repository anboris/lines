import {defineConfig} from "vite";
import injectHTML from "vite-plugin-html-inject";
import {ViteEjsPlugin} from "vite-plugin-ejs";
import textData from "./data.json";
import svgSpriter from "vite-plugin-svg-spriter";
import path from "path";

export default defineConfig({
  base: "/",
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
  plugins: [
    injectHTML(),
    ViteEjsPlugin(textData),
    svgSpriter({
      svgFolder: path.resolve(import.meta.dirname, "src/assets/svg"),
    }),
  ],
});
