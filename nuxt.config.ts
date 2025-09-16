import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // ──────────────────────────────────────────────
  // Rendering & Build
  // ──────────────────────────────────────────────
  ssr: false, // static-site style SPA
  build: {
    transpile: ['chart.js', 'vue-cal', 'fullcalendar'],
  },
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // ──────────────────────────────────────────────
  // Modules
  // ──────────────────────────────────────────────
  modules: [
    '@kevinmarrec/nuxt-pwa', // PWA support
    // add '@nuxt/content' if you later want Markdown pages
  ],

  // ──────────────────────────────────────────────
  // Nitro prerender (static export)
  // ──────────────────────────────────────────────
  nitro: {
    prerender: {
      routes: ['/200.html', '/services', '/article', '/about', '/404.html'],
      ignore: ['/dynamic-routes', '/api'],
      failOnError: false,
    },
  },

  // ──────────────────────────────────────────────
  // Runtime configuration (manifesto text lives here)
  // ──────────────────────────────────────────────
  runtimeConfig: {
    public: {
      praise4vpManifesto: `
PRAISE4VP
INSPIRING IMPACTS, BUILDING BRIDGES

“To improve is to change, and to be perfect is to change often.”
Change does not come by being passive but by actively creating the difference we want to see.
• Olawuyi Praise

Dearest COMPSSAites,
An association is only as strong as the vision that drives it and the people who carry that vision with purpose. COMPSSA deserves leaders who can inspire, represent, and work tirelessly to transform possibilities into progress.
My name is Olawuyi Praise Deborah, a 300-level student of the Department of Nursing Science, and it is with great honor that I declare my intention to serve as the Vice President of the College of Medicine and Pharmaceutical Sciences Students’ Association (COMPSSA).
This aspiration is driven not by position but by purpose, and by a genuine commitment to serve with heart, consistency, and excellence.
For me, this role is not just about leadership, it is about service, inclusivity, and impact. I am driven by the vision of a COMPSSA that truly represents every student and fosters a culture where we lift one another up.

My Mission & Vision Statement
I envision a COMPSSA where:
 • Every student values the uniqueness of their colleagues’ courses, without any department feeling superior or inferior.
 • Academics remain a priority, but with room for balance because medical students deserve to live beyond the books.
 • Unity, care, and support become our core values, making COMPSSA a true community that serves and belongs to us all.

[… keep the remainder of your manifesto exactly as written …]
`
    }
  },

  // ──────────────────────────────────────────────
  // App head tags & meta
  // ──────────────────────────────────────────────
  app: {
    head: {
      title:
        'PRAISE4VP – Inspiring Impacts, Building Bridges | Official Campaign Website',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'initial-scale=1.0, user-scalable=no, width=device-width',
        },
        { name: 'description', content: 'Official campaign site of Olawuyi Praise Deborah for COMPSSA Vice President.' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-touch-fullscreen', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // include your apple-touch startup images here if desired
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/pwacompat@2.0.6/pwacompat.min.js',
          integrity:
            'sha384-GOaSLecPIMCJksN83HLuYf9FToOiQ2Df0+0ntv7ey8zjUHESXhthwvq9hXAZTifA',
          crossorigin: 'anonymous',
          defer: true,
        },
      ],
    },
    pageTransition: false,
  },
})
