// import VueGoogleMaps from 'vue-google-maps-community-fork'
// import { defineNuxtPlugin } from '#app'
// // import { useAlert } from '@/composables/core/notification'

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string

// export default defineNuxtPlugin((nuxtApp) => {
//  // Check if google.maps object already exists
//  if (typeof window !== 'undefined' && !window.google?.maps) {
//     // Load the Google Maps API
//     nuxtApp.vueApp.use(VueGoogleMaps, {
//       load: {
//         key: GOOGLE_MAPS_API_KEY,
//         libraries: 'places',
//       }
//     })
//  } else {
//     console.log('Google Maps API already loaded.')
// //   useAlert().openAlert({ type: 'SUCCESS', msg: 'Google Maps API already loaded.' })
//  }
// })

// plugins/vue-google-maps.client.ts
// import { defineNuxtPlugin, useRuntimeConfig } from '#app'
// import VueGoogleMaps from 'vue-google-maps-community-fork'

// export default defineNuxtPlugin((nuxtApp) => {
//   const config = useRuntimeConfig()

//   nuxtApp.vueApp.use(VueGoogleMaps, {
//     load: {
//       key: config.public.googleMapsApiKey,
//       libraries: 'places',
//     },
//   })
// })

export default defineNuxtPlugin(async (nuxtApp) => {
  const module = await import('@fawmi/vue-google-maps')
  nuxtApp.vueApp.use(module.default, {
    load: {
      key: useRuntimeConfig().public.GOOGLE_MAPS_API_KEY,
      libraries: 'places',
      // Remove `callback`, Google will auto-init
    },
    autobindAllEvents: true,
    installComponents: true,
  })
})
