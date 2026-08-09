// vite.config.js
import { defineConfig } from "vite";

const DEV_PROXY_TARGET = "https://goldbet.fun";

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
      "/email-guard.js": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/email/verify": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/phone/check-available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/phone-guard.js": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/phone/verify": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/email/check-available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/domain/available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
