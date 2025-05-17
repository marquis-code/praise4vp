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
  plugins: ["~/plugins/aos.client.ts", "~/plugins/googleMaps.client.ts"],
  css: ["/assets/css/main.css"],
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
    },
  },
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
  app: {
    baseURL: process.env.DEPLOYMENT_TARGET === "s3" ? '/landing-page/' : '/'
  },
  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal'],
    },
  },
});
