// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://landing-res.b-cdn.net/freespins/bisonstorm/",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    open: true,
    host: true,
    // DEV-ONLY: проксируем сниппет email-guard и эндпоинт Zeruh на боевой nginx,
    // чтобы на localhost работали опечатки + проверка живости. В сборку не попадает.
    // Запуск: npm run dev -- --base=/
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
      // DEV-ONLY: проверка занятости телефона/почты (same-origin на боевом nginx).
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
