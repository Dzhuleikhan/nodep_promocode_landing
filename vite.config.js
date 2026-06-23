// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  base: "https://landing-res.b-cdn.net/freespins/buffalossun/",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  server: {
    open: true,
    host: true,
    // Email-Guard (Zeruh) — проксируем сниппет и эндпоинт на боевой домен,
    // чтобы фичу можно было тестировать локально (`npm run dev -- --base=/`).
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
      // Phone-Guard (IPQS) — сниппет проверки телефона + эндпоинт verify.
      "/phone-guard.js": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: false,
      },
      "/api/phone/verify": {
        target: "https://goldbet.fun",
        changeOrigin: true,
        secure: false,
      },
      // Проверка занятости телефона/почты (same-origin прокси на nginx ленда).
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
