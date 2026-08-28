import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
  base: '/lines/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
  plugins: [injectHTML()],
});
