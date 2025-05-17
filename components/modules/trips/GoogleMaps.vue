<template>
    <div class="google-map-container h-full w-full">
      <div ref="mapContainer" class="h-full w-full"></div>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        <p class="ml-3 text-gray-600">Loading map...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  
  interface LatLng {
    lat: number
    lng: number
  }
  
  interface Marker {
    position: LatLng
    title: string
    icon?: string
  }
  
  const props = defineProps<{
    origin: LatLng
    destination: LatLng
    markers?: Marker[]
    apiKey?: string
  }>()
  
  const mapContainer = ref<HTMLElement | null>(null)
  const loading = ref(true)
  const googleMapsLoaded = ref(false)
  let map = null
  let directionsService = null
  let directionsRenderer = null
  let originMarker = null
  let destinationMarker = null
  
  // Load Google Maps API
  const loadGoogleMapsApi = () => {
    return new Promise<void>((resolve, reject) => {
      // Check if Google Maps API is already loaded
      if (window.google && window.google.maps) {
        googleMapsLoaded.value = true
        resolve()
        return
      }
  
      // Create script element
      const script = document.createElement('script')
      const apiKey = props.apiKey || 'YOUR_API_KEY' // Replace with your actual API key
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMapsCallback`
      script.async = true
      script.defer = true
  
      // Define callback function
      window.initGoogleMapsCallback = () => {
        googleMapsLoaded.value = true
        resolve()
      }
  
      // Handle errors
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        reject(new Error('Failed to load Google Maps API'))
      }
  
      // Append script to document
      document.head.appendChild(script)
    })
  }
  
  // Initialize map
  const initMap = () => {
    if (!mapContainer.value || !window.google || !window.google.maps) {
      console.error('Map container or Google Maps not available')
      return
    }
  
    try {
      console.log('Initializing map with coordinates:', props.origin, props.destination)
      
      // Create map instance
      map = new window.google.maps.Map(mapContainer.value, {
        center: { 
          lat: (props.origin.lat + props.destination.lat) / 2, 
          lng: (props.origin.lng + props.destination.lng) / 2 
        },
        zoom: 12,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })
  
      // Create directions service and renderer
      directionsService = new window.google.maps.DirectionsService()
      directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // We'll add custom markers
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      })
  
      // Add markers
      addMarkers()
  
      // Calculate and display route
      calculateRoute()
  
      loading.value = false
      console.log('Map initialized successfully')
    } catch (error) {
      console.error('Error initializing map:', error)
      loading.value = false
    }
  }
  
  // Add markers for origin and destination
  const addMarkers = () => {
    if (!map || !window.google) return
  
    try {
      // Create custom marker icons
      const originIcon = {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40)
      }
  
      const destinationIcon = {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40)
      }
  
      // Create origin marker
      originMarker = new window.google.maps.Marker({
        position: props.origin,
        map: map,
        title: 'Pickup Location',
        icon: originIcon,
        animation: window.google.maps.Animation.DROP
      })
  
      // Create destination marker
      destinationMarker = new window.google.maps.Marker({
        position: props.destination,
        map: map,
        title: 'Dropoff Location',
        icon: destinationIcon,
        animation: window.google.maps.Animation.DROP
      })
  
      // Add info windows
      const originInfoWindow = new window.google.maps.InfoWindow({
        content: '<div class="p-2"><strong>Pickup Location</strong></div>'
      })
  
      const destinationInfoWindow = new window.google.maps.InfoWindow({
        content: '<div class="p-2"><strong>Dropoff Location</strong></div>'
      })
  
      // Add click listeners to markers
      originMarker.addListener('click', () => {
        originInfoWindow.open(map, originMarker)
      })
  
      destinationMarker.addListener('click', () => {
        destinationInfoWindow.open(map, destinationMarker)
      })
      
      console.log('Markers added successfully')
    } catch (error) {
      console.error('Error adding markers:', error)
    }
  }
  
  // Calculate and display route
  const calculateRoute = () => {
    if (!directionsService || !directionsRenderer || !window.google) {
      console.error('Directions service or renderer not available')
      return
    }
  
    try {
      directionsService.route(
        {
          origin: props.origin,
          destination: props.destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response)
            
            // Fit map to route bounds
            if (map && response?.routes[0]?.bounds) {
              map.fitBounds(response.routes[0].bounds)
            }
            
            // Extract route information
            if (response?.routes[0]?.legs[0]) {
              const leg = response.routes[0].legs[0]
              console.log('Distance:', leg.distance?.text)
              console.log('Duration:', leg.duration?.text)
            }
            
            console.log('Route calculated successfully')
          } else {
            console.error('Directions request failed due to ' + status)
          }
        }
      )
    } catch (error) {
      console.error('Error calculating route:', error)
    }
  }
  
  // Update map when coordinates change
  watch(
    () => [props.origin, props.destination],
    () => {
      if (map && originMarker && destinationMarker) {
        try {
          console.log('Updating map with new coordinates:', props.origin, props.destination)
          
          // Update marker positions
          originMarker.setPosition(props.origin)
          destinationMarker.setPosition(props.destination)
          
          // Recalculate route
          calculateRoute()
        } catch (error) {
          console.error('Error updating map:', error)
        }
      }
    },
    { deep: true }
  )
  
  // Clean up resources
  const cleanUp = () => {
    try {
      if (map && window.google) {
        // Remove event listeners and clear references
        window.google.maps.event.clearInstanceListeners(map)
      }
      
      if (originMarker) {
        if (window.google) window.google.maps.event.clearInstanceListeners(originMarker)
        originMarker.setMap(null)
      }
      
      if (destinationMarker) {
        if (window.google) window.google.maps.event.clearInstanceListeners(destinationMarker)
        destinationMarker.setMap(null)
      }
      
      if (directionsRenderer) {
        directionsRenderer.setMap(null)
      }
      
      map = null
      directionsService = null
      directionsRenderer = null
      originMarker = null
      destinationMarker = null
      
      console.log('Map resources cleaned up')
    } catch (error) {
      console.error('Error cleaning up map resources:', error)
    }
  }
  
  // Lifecycle hooks
  onMounted(async () => {
    console.log('GoogleMap component mounted')
    try {
      await loadGoogleMapsApi()
      console.log('Google Maps API loaded')
      initMap()
    } catch (error) {
      console.error('Error in GoogleMap onMounted:', error)
      loading.value = false
    }
  })
  
  onUnmounted(() => {
    console.log('GoogleMap component unmounted')
    cleanUp()
  })
  
  // Declare global type for Google Maps callback
  declare global {
    interface Window {
      initGoogleMapsCallback: () => void
      google: any
    }
  }
  </script>
  
  <style scoped>
  .google-map-container {
    position: relative;
  }
  </style>