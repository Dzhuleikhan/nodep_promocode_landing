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
    // email-guard: dev-прокси на прод, чтобы /email-guard.js и /api/email/verify
    // работали при локальном npm run dev (бэк живёт на goldbet.fun)
    proxy: {
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
      // проверка занятости (НЕ путать с Zeruh /verify выше)
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
    },
  },
});
