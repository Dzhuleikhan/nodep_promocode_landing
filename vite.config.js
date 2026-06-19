// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    open: true,
    host: true,
    proxy: {
      "/api/phone/check-available": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: false,
      },
      "/api/email/check-available": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: false,
      },
      "/email-guard.js": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: false,
      },
      "/api/email/verify": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
