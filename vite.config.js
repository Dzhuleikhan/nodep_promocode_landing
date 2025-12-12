// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://monkeyheist/",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    open: true,
    host: true,
  },
});
