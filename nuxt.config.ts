import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [],
  css: ["/assets/css/main.css"],
  modules: ['@kevinmarrec/nuxt-pwa', "@nuxtjs/tailwindcss"],
  pwa: {
    workbox: {
      enabled: true
    },
    meta: {
      title: "CoMiles Admin – Elevating Ride Experiences",
      author: "Marquis",
      mobileAppIOS: false,
      mobileApp: true,
      description:
        "Elevating Ride Experiences",
      theme_color: "#27396B"
    },
    icon: {
      sizes: [64, 120, 144, 152, 192, 384, 512],
    },
    manifest: {
      name: "CoMiles – Elevating Ride Experiences",
      lang: "fa",
    },
  },
  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal'],
    },
  },
});
