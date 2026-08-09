// vite.config.js
import { defineConfig } from "vite";

// Общий адрес боевого nginx для всех dev-прокси ниже.
const DEV_PROXY_TARGET = "https://goldbet.fun";

export default defineConfig({
  base: "https://landing-res.b-cdn.net/freespins/monkeyheist/",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    open: true,
    host: true,
    // Dev-only: проксируем сниппет email-guard и Zeruh-эндпоинт на боевой nginx,
    // чтобы на localhost работала проверка email целиком (опечатки + Zeruh).
    // В сборку не попадает. Запуск: npm run dev -- --base=/
    proxy: {
      "/email-guard.js": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/api/email/verify": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
      // phone-guard (IPQS): сниппет + verify-эндпоинт на боевой nginx.
      "/phone-guard.js": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/api/phone/verify": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
      // Проверка занятости телефона/почты (same-origin прокси на боевой nginx).
      "/api/phone/check-available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
      "/api/email/check-available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: true,
      },
      // Ротатор домена: стабильный алиас в nginx-include.
      "/api/domain/available": {
        target: DEV_PROXY_TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
