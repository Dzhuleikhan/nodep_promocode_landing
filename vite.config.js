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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap"],
          swiper: ["swiper"],
          "intl-tel-input": ["intl-tel-input"],
          "libphonenumber-js": ["libphonenumber-js"],
          flatpickr: ["flatpickr"],
        },
      },
    },
  },
});
