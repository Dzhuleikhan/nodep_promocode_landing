// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://dynamic-res.b-cdn.net/freespins/monkeyheist/",
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
