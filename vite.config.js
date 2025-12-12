// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://goldbet.wiki/freespins/monkeyheist/",
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
