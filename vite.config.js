// vite.config.js
import { defineConfig } from "vite";

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
