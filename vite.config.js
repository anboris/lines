import {defineConfig} from "vite";
import injectHTML from "vite-plugin-html-inject";
import svgSpriter from "vite-plugin-svg-spriter";
import path from "path";
import handlebars from 'vite-plugin-handlebars';
import fs from "fs";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
  plugins: [
    handlebars({
      partialDirectory: path.resolve(import.meta.dirname, "src/partials"),
      context() {
        const jsonPath = path.resolve(import.meta.dirname, "data.json");
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        return JSON.parse(rawData);
      }
    }),
    injectHTML(),
    svgSpriter({
      svgFolder: path.resolve(import.meta.dirname, "src/assets/svg"),
    }),
  ],
});
