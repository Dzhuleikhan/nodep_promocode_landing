// vite.config.js
import { defineConfig } from "vite";

const DEV_PROXY_TARGET = "https://goldbet.fun";

export default defineConfig({
  base: "https://landing-res.b-cdn.net/chickenroad/new/fs/",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  // DEV ONLY — forwards the domain-rotator endpoint to the live nginx so the
  // relative /api/domain/available URL works on localhost.
  server: {
    open: true,
    host: true,
    proxy: {
      "/api/domain/available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
