import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
  plugins: [injectHTML()],
});
