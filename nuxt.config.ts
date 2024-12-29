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
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'cursor-fx'
    }
  },
  plugins: ["~/plugins/aos.client.ts"],
  css: ["/assets/css/main.css"],
  modules: ['@kevinmarrec/nuxt-pwa', "@nuxtjs/tailwindcss"],
  pwa: {
    workbox: {
      enabled: true
    },
    meta: {
      title: "Shuttlers - Exprience a simpler, better way to commute.",
      author: "Marquis",
      mobileAppIOS: false,
      mobileApp: true,
      description:
        "Exprience a simpler, better way to commute.",
      theme_color: "#27396B",
      background_color: "#27396B",
      display: "standalone",
      start_url: "/",
      nativeUI: true,
    },
    icon: {
      sizes: [64, 120, 144, 152, 192, 384, 512],
    },
    manifest: {
      name: "Achilles Drill",
      lang: "fa",
      useWebmanifestExtension: false,
    },
    runtimeCaching: [
      {
        urlPattern: "https://fonts.googleapis.com/.*",
        handler: "cacheFirst",
        method: "GET",
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: "https://fonts.gstatic.com/.*",
        handler: "cacheFirst",
        method: "GET",
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern: "https://cdn.snipcart.com/.*",
        method: "GET",
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
      {
        urlPattern:
          "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
        handler: "cacheFirst",
        method: "GET",
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
      },
    ],
  }
});
