// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://landing-res.b-cdn.net/freespins/bigbasssplash/",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    open: true,
    host: true,
    // Dev only: proxy the email-guard snippet + Zeruh endpoint to the live nginx.
    // Run with `npm run dev -- --base=/` so absolute paths resolve.
    proxy: {
      "/email-guard.js": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: true,
      },
      "/api/email/verify": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
