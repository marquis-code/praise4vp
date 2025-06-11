<template>
    <div class="relative w-full h-full">
      <!-- Map container -->
      <div ref="mapContainer" class="w-full h-full google-map-container"></div>
      
      <!-- Loading overlay -->
      <div 
        v-if="!mapReady" 
        class="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p class="text-gray-600">Loading map...</p>
        </div>
      </div>
      
      <!-- Connection status overlay -->
      <div 
        v-if="connectionStatus !== 'connected'" 
        class="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div 
          class="px-4 py-2 rounded-full text-sm font-medium"
          :class="{
            'bg-yellow-100 text-yellow-800': connectionStatus === 'connecting',
            'bg-red-100 text-red-800': connectionStatus === 'disconnected'
          }"
        >
          {{ connectionStatus === 'connecting' ? 'Connecting to live tracking...' : 'Live tracking disconnected' }}
        </div>
      </div>
  
      <!-- Real-time info panel -->
      <div 
        v-if="lastUpdateTime !== 'Never'" 
        class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20 text-sm"
      >
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-gray-600">Last update: {{ lastUpdateTime }}</span>
        </div>
        <div v-if="driverPosition" class="text-xs text-gray-500 mt-1">
          Speed: {{ driverPosition.speed || 0 }} km/h
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  
  interface Props {
    trip: any
    realTimeRoute: any
    driverPosition: any
    apiKey: string
    connectionStatus: string
    lastUpdateTime: string
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits(['map-ready'])
  
  // Map state
  const mapContainer = ref<HTMLElement>()
  const mapReady = ref(false)
  const map = ref<any>()
  const directionsService = ref<any>()
  const directionsRenderer = ref<any>()
  
  // Markers
  const pickupMarkers = ref<any[]>([])
  const dropoffMarkers = ref<any[]>([])
  const driverMarker = ref<any>()
  const routePolyline = ref<any>()
  
  // Car icon SVG for driver marker
  const carIconSvg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <path d="M8 16L12 12H20L24 16V20H22C22 21.1 21.1 22 20 22S18 21.1 18 20H14C14 21.1 13.1 22 12 22S10 21.1 10 20H8V16Z" fill="white"/>
      <circle cx="12" cy="20" r="1" fill="#3B82F6"/>
      <circle cx="20" cy="20" r="1" fill="#3B82F6"/>
    </svg>
  `
  
  const initializeMap = async () => {
    if (!mapContainer.value || !props.apiKey) return
  
    try {
      // Wait for Google Maps to be available
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API not loaded')
        return
      }
  
      // Initialize Google Maps
      map.value = new window.google.maps.Map(mapContainer.value, {
        zoom: 13,
        center: { lat: 4.7863956, lng: 7.1332013 }, // Default to Nigeria
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      })
  
      directionsService.value = new window.google.maps.DirectionsService()
      directionsRenderer.value = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      })
  
      directionsRenderer.value.setMap(map.value)
  
      mapReady.value = true
      emit('map-ready', map.value)
  
      // Initialize trip data
      if (props.trip) {
        await initializeTripData()
      }
  
    } catch (error) {
      console.error('Error initializing map:', error)
    }
  }
  
  const initializeTripData = async () => {
    if (!map.value || !props.trip) return
  
    // Clear existing markers
    clearMarkers()
  
    // Add pickup and dropoff markers
    addTripMarkers()
  
    // Draw initial route if available
    if (props.trip.route) {
      drawRouteFromTripData(props.trip.route)
    }
  
    // Set initial driver position if available
    if (props.driverPosition) {
      updateDriverPosition(props.driverPosition)
    }
  }
  
  const addTripMarkers = () => {
    if (!map.value || !props.trip.passengers) return
  
    props.trip.passengers.forEach((passenger: any, index: number) => {
      // Pickup marker
      const pickupCoords = passenger.origin.geometry.coordinates
      const pickupMarker = new window.google.maps.Marker({
        position: { lat: pickupCoords[1], lng: pickupCoords[0] },
        map: map.value,
        title: `Pickup ${index + 1}: ${passenger.origin.properties.address}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      })
  
      const pickupInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-green-600">Pickup Location</h3>
            <p class="text-sm">${passenger.origin.properties.address}</p>
            <p class="text-xs text-gray-500">Passenger: ${passenger.passengerId?.firstName} ${passenger.passengerId?.lastName}</p>
          </div>
        `
      })
  
      pickupMarker.addListener('click', () => {
        pickupInfoWindow.open(map.value, pickupMarker)
      })
  
      pickupMarkers.value.push(pickupMarker)
  
      // Dropoff marker
      const dropoffCoords = passenger.destination.geometry.coordinates
      const dropoffMarker = new window.google.maps.Marker({
        position: { lat: dropoffCoords[1], lng: dropoffCoords[0] },
        map: map.value,
        title: `Dropoff ${index + 1}: ${passenger.destination.properties.address}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 8
        }
      })
  
      const dropoffInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-red-600">Dropoff Location</h3>
            <p class="text-sm">${passenger.destination.properties.address}</p>
            <p class="text-xs text-gray-500">Passenger: ${passenger.passengerId?.firstName} ${passenger.passengerId?.lastName}</p>
            <p class="text-xs text-gray-500">Fare: ₦${passenger.totalFare?.toLocaleString()}</p>
          </div>
        `
      })
  
      dropoffMarker.addListener('click', () => {
        dropoffInfoWindow.open(map.value, dropoffMarker)
      })
  
      dropoffMarkers.value.push(dropoffMarker)
    })
  }
  
  const drawRouteFromTripData = (routeData: any) => {
    if (!map.value || !routeData.features) return
  
    // Find LineString feature for the route
    const routeFeature = routeData.features.find((feature: any) => 
      feature.geometry.type === 'LineString'
    )
  
    if (routeFeature) {
      const path = routeFeature.geometry.coordinates.map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0]
      }))
  
      // Remove existing polyline
      if (routePolyline.value) {
        routePolyline.value.setMap(null)
      }
  
      // Create new polyline
      routePolyline.value = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 4
      })
  
      routePolyline.value.setMap(map.value)
  
      // Fit map to route bounds
      const bounds = new window.google.maps.LatLngBounds()
      path.forEach(point => bounds.extend(point))
      map.value.fitBounds(bounds, { padding: 50 })
    }
  }
  
  const updateDriverPosition = (position: any) => {
    if (!map.value) return
  
    const driverLatLng = { lat: position.lat, lng: position.lng }
  
    if (driverMarker.value) {
      // Animate marker movement
      animateMarkerMovement(driverMarker.value, driverLatLng)
    } else {
      // Create new driver marker
      driverMarker.value = new window.google.maps.Marker({
        position: driverLatLng,
        map: map.value,
        title: 'Driver Location',
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(carIconSvg)}`,
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        },
        zIndex: 1000
      })
  
      const driverInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-blue-600">Driver Location</h3>
            <p class="text-sm">${props.trip.driverId?.firstName} ${props.trip.driverId?.lastName}</p>
            <p class="text-xs text-gray-500">Speed: ${position.speed || 0} km/h</p>
            <p class="text-xs text-gray-500">Last update: ${new Date(position.timestamp).toLocaleTimeString()}</p>
          </div>
        `
      })
  
      driverMarker.value.addListener('click', () => {
        driverInfoWindow.open(map.value, driverMarker.value)
      })
    }
  }
  
  const animateMarkerMovement = (marker: any, newPosition: any) => {
    const currentPosition = marker.getPosition()
    if (!currentPosition) return
  
    const startLat = currentPosition.lat()
    const startLng = currentPosition.lng()
    const endLat = newPosition.lat
    const endLng = newPosition.lng
  
    let step = 0
    const numSteps = 30
    const timePerStep = 50
  
    const animate = () => {
      step++
      const progress = step / numSteps
  
      if (progress <= 1) {
        const lat = startLat + (endLat - startLat) * progress
        const lng = startLng + (endLng - startLng) * progress
        
        marker.setPosition({ lat, lng })
        
        if (progress < 1) {
          setTimeout(animate, timePerStep)
        }
      }
    }
  
    animate()
  }
  
  const clearMarkers = () => {
    // Clear pickup markers
    pickupMarkers.value.forEach(marker => marker.setMap(null))
    pickupMarkers.value = []
  
    // Clear dropoff markers
    dropoffMarkers.value.forEach(marker => marker.setMap(null))
    dropoffMarkers.value = []
  
    // Clear driver marker
    if (driverMarker.value) {
      driverMarker.value.setMap(null)
      driverMarker.value = undefined
    }
  
    // Clear route polyline
    if (routePolyline.value) {
      routePolyline.value.setMap(null)
      routePolyline.value = undefined
    }
  }
  
  // Watch for real-time route updates
  watch(() => props.realTimeRoute, (newRoute) => {
    if (newRoute && map.value) {
      drawRouteFromTripData(newRoute)
    }
  }, { deep: true })
  
  // Watch for driver position updates
  watch(() => props.driverPosition, (newPosition) => {
    if (newPosition && map.value) {
      updateDriverPosition(newPosition)
    }
  }, { deep: true })
  
  // Watch for trip changes
  watch(() => props.trip, async (newTrip) => {
    if (newTrip && map.value) {
      await nextTick()
      await initializeTripData()
    }
  }, { deep: true })
  
  // Load Google Maps API
  const loadGoogleMapsAPI = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve()
        return
      }
  
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=geometry`
      script.async = true
      script.defer = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps API'))
      
      document.head.appendChild(script)
    })
  }
  
  onMounted(async () => {
    try {
      await loadGoogleMapsAPI()
      await initializeMap()
    } catch (error) {
      console.error('Error loading Google Maps:', error)
    }
  })
  
  onUnmounted(() => {
    clearMarkers()
  })
  </script>
  
  <style scoped>
  .google-map-container {
    width: 100%;
    height: 100%;
  }
  </style>
  