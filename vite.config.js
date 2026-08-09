// vite.config.js
import { defineConfig } from "vite";

const DEV_PROXY_TARGET = "https://goldbet.fun";

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
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/email/verify": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // DEV-ONLY: проверка занятости телефона/почты (same-origin на боевом nginx).
      "/api/phone/check-available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/api/email/check-available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // DEV-ONLY: сниппет phone-guard + эндпоинт IPQS (проверка реальности телефона).
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
      // DEV-ONLY: ротатор доменов (стабильный алиас в nginx-include).
      "/api/domain/available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
