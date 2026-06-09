export default defineNuxtConfig({
  css: ["~/src/style.css"],
  compatibilityDate: "2026-06-01",
  vite: {
    server: {
      proxy: {
        "/api/v1": {
          target: "http://kt.polytech.edu.kz",
          changeOrigin: true,
        },
      },
    },
  },
});
