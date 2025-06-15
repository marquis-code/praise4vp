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

    <!-- Trip info panel -->
    <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20 min-w-64">
      <div class="flex items-center space-x-2 mb-2">
        <div 
          class="w-3 h-3 rounded-full"
          :class="{
            'bg-green-500 animate-pulse': connectionStatus === 'connected',
            'bg-yellow-500': connectionStatus === 'connecting',
            'bg-red-500': connectionStatus === 'disconnected'
          }"
        ></div>
        <span class="font-semibold text-sm">Trip {{ trip?.status || 'Unknown' }}</span>
      </div>
      
      <div class="space-y-1 text-xs text-gray-600">
        <div>Driver: {{ trip?.driverId || 'N/A' }}</div>
        <div>Distance: {{ totalDistance }}km</div>
        <div>Duration: {{ estimatedDuration }}</div>
        <div v-if="currentDriverPosition">
          Speed: {{ currentDriverPosition.speed || 0 }} km/h
        </div>
        <div>Progress: {{ routeProgress }}%</div>
        <div>Last update: {{ formatLastUpdateTime(lastUpdateTime) }}</div>
      </div>
    </div>

    <!-- Debug info panel (development only) -->
    <div 
      v-if="showDebugInfo && isDevelopment" 
      class="absolute bottom-4 left-4 bg-black bg-opacity-90 text-white text-xs p-3 rounded-lg z-20 max-w-sm max-h-64 overflow-y-auto"
    >
      <div class="font-bold mb-2">🐛 Debug Info</div>
      <div>Route Coordinates: {{ allRouteCoordinates.length }}</div>
      <div>Traveled Path: {{ traveledPath.length }}</div>
      <div>Car Heading: {{ currentHeading }}°</div>
      <div>Movement Status: {{ movementStatus }}</div>
      <div class="mt-2">
        <div class="font-semibold">Recent Events:</div>
        <div v-for="log in debugLogs.slice(-5)" :key="log" class="text-xs">
          {{ log }}
        </div>
      </div>
    </div>

    <!-- Toggle debug button (development only) -->
    <button
      v-if="isDevelopment"
      @click="showDebugInfo = !showDebugInfo"
      class="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded text-xs z-20"
    >
      {{ showDebugInfo ? 'Hide' : 'Show' }} Debug
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'

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

// Development mode detection
const isDevelopment = process.env.NODE_ENV === 'development'

// Map state
const mapContainer = ref<HTMLElement>()
const mapReady = ref(false)
const map = ref<any>()
const directionsService = ref<any>()
const directionsRenderer = ref<any>()

// Markers and polylines
const pickupMarkers = ref<any[]>([])
const dropoffMarkers = ref<any[]>([])
const driverMarker = ref<any>()
const plannedRoutePolyline = ref<any>() // The planned route (purple line)
const traveledPathPolyline = ref<any>() // The actual traveled path (blue line)
const currentLocationCircle = ref<any>() // Current location accuracy circle

// Real-time tracking state
const allRouteCoordinates = ref<Array<{lat: number, lng: number, timestamp: string}>>([])
const traveledPath = ref<Array<{lat: number, lng: number, timestamp: string}>>([])
const currentDriverPosition = ref<any>(null)
const currentHeading = ref(0)
const routeProgress = ref(0)
const totalDistance = ref('0')
const estimatedDuration = ref('0 min')
const movementStatus = ref('stationary')

// Debug state
const showDebugInfo = ref(false)
const debugLogs = ref<string[]>([])

// Add debug logging function
const debugLog = (message: string, data?: any) => {
  const timestamp = new Date().toLocaleTimeString()
  const logMessage = `[${timestamp}] ${message}`
  
  console.log(`🚗 REALTIME MAP: ${logMessage}`, data || '')
  
  // Store debug events for UI
  debugLogs.value.push(logMessage)
  if (debugLogs.value.length > 20) {
    debugLogs.value = debugLogs.value.slice(-20)
  }
}

// Enhanced car icon with direction
const createDirectionalCarIcon = (heading: number = 0) => {
  return {
    path: 'M12 2C13.1 2 14 2.9 14 4V6H18C18.6 6 19 6.4 19 7V11C19 11.6 18.6 12 18 12H17V14C17 15.1 16.1 16 15 16H13V18H15V20H9V18H11V16H9C7.9 16 7 15.1 7 14V12H6C5.4 12 5 11.6 5 11V7C5 6.4 5.4 6 6 6H10V4C10 2.9 10.9 2 12 2M12 4V6H12V4M8 8V10H16V8H8Z',
    fillColor: '#1E40AF',
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1.5,
    anchor: { x: 12, y: 12 },
    rotation: heading
  }
}

const formatLastUpdateTime = (timestamp: string) => {
  if (!timestamp || timestamp === 'Never') return 'Never'
  
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return date.toLocaleTimeString()
  } catch {
    return 'Invalid time'
  }
}

const initializeMap = async () => {
  if (!mapContainer.value || !props.apiKey) {
    debugLog('Cannot initialize map - missing container or API key')
    return
  }

  try {
    debugLog('Initializing Google Maps...')
    
    // Wait for Google Maps to be available
    if (!window.google || !window.google.maps) {
      debugLog('ERROR: Google Maps API not loaded')
      return
    }

    // Initialize Google Maps
    map.value = new window.google.maps.Map(mapContainer.value, {
      zoom: 16,
      center: { lat: 6.5477189, lng: 3.2919835 },
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      gestureHandling: 'greedy'
    })

    // Initialize Directions Service
    directionsService.value = new window.google.maps.DirectionsService()
    
    // Initialize Directions Renderer for planned route
    directionsRenderer.value = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#8B5CF6', // Purple color like Uber
        strokeWeight: 6,
        strokeOpacity: 0.8,
        zIndex: 10
      }
    })

    directionsRenderer.value.setMap(map.value)

    mapReady.value = true
    debugLog('Google Maps initialized successfully')
    emit('map-ready', map.value)

    // Initialize trip data
    if (props.trip) {
      debugLog('Initializing trip data...', { tripId: props.trip._id })
      await initializeTripData()
    }

  } catch (error) {
    debugLog('ERROR initializing map', error)
    console.error('Error initializing map:', error)
  }
}

const initializeTripData = async () => {
  if (!map.value || !props.trip) {
    debugLog('Cannot initialize trip data - missing map or trip')
    return
  }

  debugLog('Starting trip data initialization', { 
    tripId: props.trip._id, 
    status: props.trip.status,
    passengersCount: props.trip.passengers?.length || 0
  })

  // Clear existing markers and polylines
  clearMarkersAndPolylines()

  // Add pickup and dropoff markers
  addTripMarkers()

  // Create planned route using Google Directions API
  await createPlannedRoute()

  // Process initial route data for traveled path
  if (props.trip.route) {
    debugLog('Processing initial route data', { 
      featuresCount: props.trip.route.features?.length || 0 
    })
    processRouteData(props.trip.route)
  }

  // Set initial driver position
  updateDriverPosition()
}

const addTripMarkers = () => {
  if (!map.value || !props.trip.passengers) {
    debugLog('Cannot add trip markers - missing map or passengers')
    return
  }

  debugLog('Adding trip markers', { passengersCount: props.trip.passengers.length })

  props.trip.passengers.forEach((passenger: any, index: number) => {
    // Pickup marker (Green)
    const pickupCoords = passenger.origin.geometry.coordinates
    const pickupLatLng = { lat: pickupCoords[1], lng: pickupCoords[0] }
    
    const pickupMarker = new window.google.maps.Marker({
      position: pickupLatLng,
      map: map.value,
      title: `Pickup: ${passenger.origin.properties.address}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#10B981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 8
      },
      zIndex: 100
    })

    const pickupInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="font-semibold text-green-600 mb-2">📍 Pickup Location</h3>
          <p class="text-sm mb-1">${passenger.origin.properties.address}</p>
          <p class="text-xs text-gray-500">Status: ${passenger.passengerStatus || 'Unknown'}</p>
        </div>
      `
    })

    pickupMarker.addListener('click', () => {
      pickupInfoWindow.open(map.value, pickupMarker)
    })

    pickupMarkers.value.push(pickupMarker)

    // Dropoff marker (Red)
    const dropoffCoords = passenger.destination.geometry.coordinates
    const dropoffLatLng = { lat: dropoffCoords[1], lng: dropoffCoords[0] }
    
    const dropoffMarker = new window.google.maps.Marker({
      position: dropoffLatLng,
      map: map.value,
      title: `Dropoff: ${passenger.destination.properties.address}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#EF4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 8
      },
      zIndex: 100
    })

    const dropoffInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="font-semibold text-red-600 mb-2">🎯 Dropoff Location</h3>
          <p class="text-sm mb-1">${passenger.destination.properties.address}</p>
          <p class="text-xs text-gray-500">Fare: ₦${passenger.totalFare?.priceInUserCurrency?.toLocaleString() || 'N/A'}</p>
        </div>
      `
    })

    dropoffMarker.addListener('click', () => {
      dropoffInfoWindow.open(map.value, dropoffMarker)
    })

    dropoffMarkers.value.push(dropoffMarker)
  })
}

const createPlannedRoute = async () => {
  if (!directionsService.value || !props.trip.passengers || props.trip.passengers.length === 0) {
    debugLog('Cannot create planned route - missing service or passengers')
    return
  }

  const passenger = props.trip.passengers[0]
  const origin = passenger.origin.geometry.coordinates
  const destination = passenger.destination.geometry.coordinates

  const request = {
    origin: { lat: origin[1], lng: origin[0] },
    destination: { lat: destination[1], lng: destination[0] },
    travelMode: window.google.maps.TravelMode.DRIVING,
    avoidHighways: false,
    avoidTolls: false
  }

  try {
    debugLog('Creating planned route with Google Directions API')
    
    const result = await new Promise((resolve, reject) => {
      directionsService.value.route(request, (result: any, status: any) => {
        if (status === 'OK') {
          resolve(result)
        } else {
          reject(new Error(`Directions request failed: ${status}`))
        }
      })
    })

    // Display the planned route
    directionsRenderer.value.setDirections(result)
    
    // Extract route information
    const route = (result as any).routes[0]
    const leg = route.legs[0]
    
    totalDistance.value = (leg.distance.value / 1000).toFixed(1)
    estimatedDuration.value = leg.duration.text
    
    debugLog('Planned route created successfully', {
      distance: totalDistance.value + 'km',
      duration: estimatedDuration.value
    })

  } catch (error) {
    debugLog('ERROR creating planned route', error)
    console.error('Error creating planned route:', error)
  }
}

const processRouteData = (routeData: any) => {
  if (!routeData || !routeData.features) {
    debugLog('No route data or features found')
    return
  }

  debugLog('Processing route data', { 
    featuresCount: routeData.features.length,
    routeType: routeData.type 
  })

  // Extract coordinates from LineString features (actual traveled path)
  const newCoordinates: Array<{lat: number, lng: number, timestamp: string}> = []

  routeData.features.forEach((feature: any, index: number) => {
    debugLog(`Processing feature ${index}`, { 
      type: feature.geometry.type,
      coordinatesCount: Array.isArray(feature.geometry.coordinates) ? feature.geometry.coordinates.length : 0
    })
    
    if (feature.geometry.type === 'LineString') {
      const coordinates = feature.geometry.coordinates
      const timestamps = feature.properties.timeStamps || []

      debugLog(`LineString found with ${coordinates.length} coordinates`)

      coordinates.forEach((coord: number[], coordIndex: number) => {
        if (Array.isArray(coord) && coord.length >= 2) {
          const coordData = {
            lat: coord[1],
            lng: coord[0],
            timestamp: timestamps[coordIndex] || new Date().toISOString()
          }
          newCoordinates.push(coordData)
        }
      })
    }
  })

  if (newCoordinates.length === 0) {
    debugLog('WARNING: No valid coordinates found in route data')
    return
  }

  // Sort by timestamp
  newCoordinates.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  // Update traveled path
  traveledPath.value = newCoordinates
  allRouteCoordinates.value = newCoordinates

  debugLog(`Traveled path updated with ${traveledPath.value.length} coordinates`)

  // Draw the traveled path
  drawTraveledPath()
  
  // Update driver position
  updateDriverPosition()
}

const drawTraveledPath = () => {
  if (!map.value || traveledPath.value.length === 0) {
    debugLog('Cannot draw traveled path - no map or coordinates')
    return
  }

  debugLog(`Drawing traveled path with ${traveledPath.value.length} coordinates`)

  // Clear existing traveled path
  if (traveledPathPolyline.value) {
    traveledPathPolyline.value.setMap(null)
  }

  if (traveledPath.value.length < 2) {
    debugLog('Need at least 2 coordinates to draw path')
    return
  }

  const path = traveledPath.value.map(coord => ({ lat: coord.lat, lng: coord.lng }))

  // Create traveled path polyline (blue, thicker than planned route)
  traveledPathPolyline.value = new window.google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#1E40AF', // Blue color for traveled path
    strokeWeight: 8,
    strokeOpacity: 0.9,
    zIndex: 20 // Higher than planned route
  })

  traveledPathPolyline.value.setMap(map.value)
  debugLog('Traveled path polyline added to map')
}

const updateDriverPosition = () => {
  if (!map.value) {
    debugLog('Cannot update driver position - no map')
    return
  }

  let driverLatLng: any = null
  let speed = 0
  let heading = 0

  // Use real-time driver position if available
  if (props.driverPosition) {
    driverLatLng = { lat: props.driverPosition.lat, lng: props.driverPosition.lng }
    speed = props.driverPosition.speed || 0
    heading = props.driverPosition.heading || 0
    
    currentDriverPosition.value = props.driverPosition
    debugLog('Using real-time driver position', driverLatLng)
  } 
  // Otherwise use latest coordinate from traveled path
  else if (traveledPath.value.length > 0) {
    const latestCoord = traveledPath.value[traveledPath.value.length - 1]
    driverLatLng = { lat: latestCoord.lat, lng: latestCoord.lng }
    
    // Calculate heading from last two points
    if (traveledPath.value.length > 1) {
      const prevCoord = traveledPath.value[traveledPath.value.length - 2]
      heading = calculateBearing(prevCoord, latestCoord)
      
      // Calculate speed
      const distance = calculateDistance(prevCoord, latestCoord)
      const timeDiff = (new Date(latestCoord.timestamp).getTime() - new Date(prevCoord.timestamp).getTime()) / 1000
      if (timeDiff > 0) {
        speed = Math.round((distance / timeDiff) * 3.6) // Convert m/s to km/h
      }
    }
    
    currentDriverPosition.value = {
      lat: latestCoord.lat,
      lng: latestCoord.lng,
      speed: speed,
      heading: heading,
      timestamp: latestCoord.timestamp
    }
    
    debugLog('Using traveled path for driver position', driverLatLng)
  }

  if (!driverLatLng) {
    debugLog('No driver position available')
    return
  }

  // Update movement status
  if (speed > 5) {
    movementStatus.value = 'moving'
  } else if (speed > 0) {
    movementStatus.value = 'slow'
  } else {
    movementStatus.value = 'stationary'
  }

  currentHeading.value = heading

  // Update or create driver marker
  if (driverMarker.value) {
    // Animate marker movement
    animateMarkerMovement(driverMarker.value, driverLatLng, heading)
  } else {
    // Create new driver marker
    driverMarker.value = new window.google.maps.Marker({
      position: driverLatLng,
      map: map.value,
      title: 'Driver Location',
      icon: createDirectionalCarIcon(heading),
      zIndex: 1000
    })

    const driverInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div class="p-3">
          <h3 class="font-semibold text-blue-600 mb-2">🚗 Driver Location</h3>
          <p class="text-sm mb-1">Speed: ${speed} km/h</p>
          <p class="text-sm mb-1">Heading: ${heading.toFixed(0)}°</p>
          <p class="text-sm mb-1">Status: ${movementStatus.value}</p>
          <p class="text-xs text-gray-500">Last update: ${new Date().toLocaleTimeString()}</p>
        </div>
      `
    })

    driverMarker.value.addListener('click', () => {
      driverInfoWindow.open(map.value, driverMarker.value)
    })

    debugLog('New driver marker created')
  }

  // Create/update current location circle
  if (currentLocationCircle.value) {
    currentLocationCircle.value.setMap(null)
  }

  currentLocationCircle.value = new window.google.maps.Circle({
    strokeColor: '#1E40AF',
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: '#1E40AF',
    fillOpacity: 0.1,
    map: map.value,
    center: driverLatLng,
    radius: Math.max(20, speed * 2) // Radius based on speed
  })

  // Calculate route progress
  calculateRouteProgress(driverLatLng)
}

const calculateBearing = (start: {lat: number, lng: number}, end: {lat: number, lng: number}) => {
  const startLat = start.lat * Math.PI / 180
  const startLng = start.lng * Math.PI / 180
  const endLat = end.lat * Math.PI / 180
  const endLng = end.lng * Math.PI / 180

  const dLng = endLng - startLng

  const y = Math.sin(dLng) * Math.cos(endLat)
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng)

  let bearing = Math.atan2(y, x) * 180 / Math.PI
  return (bearing + 360) % 360
}

const calculateDistance = (point1: {lat: number, lng: number}, point2: {lat: number, lng: number}) => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = point1.lat * Math.PI/180
  const φ2 = point2.lat * Math.PI/180
  const Δφ = (point2.lat-point1.lat) * Math.PI/180
  const Δλ = (point2.lng-point1.lng) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c // Distance in meters
}

const calculateRouteProgress = (currentPosition: {lat: number, lng: number}) => {
  if (!props.trip.passengers || props.trip.passengers.length === 0) return

  const passenger = props.trip.passengers[0]
  const pickup = passenger.origin.geometry.coordinates
  const dropoff = passenger.destination.geometry.coordinates
  
  const totalDistance = calculateDistance(
    { lat: pickup[1], lng: pickup[0] },
    { lat: dropoff[1], lng: dropoff[0] }
  )
  
  const currentDistance = calculateDistance(
    { lat: pickup[1], lng: pickup[0] },
    currentPosition
  )
  
  routeProgress.value = Math.min(Math.round((currentDistance / totalDistance) * 100), 100)
}

const animateMarkerMovement = (marker: any, newPosition: any, newHeading: number = 0) => {
  const currentPosition = marker.getPosition()
  if (!currentPosition) {
    marker.setPosition(newPosition)
    marker.setIcon(createDirectionalCarIcon(newHeading))
    return
  }

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
      
      // Update icon rotation during animation
      if (progress === 1) {
        marker.setIcon(createDirectionalCarIcon(newHeading))
      }
      
      if (progress < 1) {
        setTimeout(animate, timePerStep)
      }
    }
  }

  animate()
}

const clearMarkersAndPolylines = () => {
  debugLog('Clearing all markers and polylines')
  
  // Clear pickup markers
  pickupMarkers.value.forEach(marker => marker.setMap(null))
  pickupMarkers.value = []

  // Clear dropoff markers
  dropoffMarkers.value.forEach(marker => marker.setMap(null))
  dropoffMarkers.value = []

  // Clear driver marker
  if (driverMarker.value) {
    driverMarker.value.setMap(null)
    driverMarker.value = null
  }

  // Clear polylines
  if (traveledPathPolyline.value) {
    traveledPathPolyline.value.setMap(null)
    traveledPathPolyline.value = null
  }

  // Clear location circle
  if (currentLocationCircle.value) {
    currentLocationCircle.value.setMap(null)
    currentLocationCircle.value = null
  }
}

// Watchers
watch(() => props.realTimeRoute, (newRoute) => {
  debugLog('🔄 Real-time route watcher triggered', { 
    hasNewRoute: !!newRoute,
    featuresCount: newRoute?.features?.length || 0
  })
  
  if (newRoute && map.value) {
    processRouteData(newRoute)
  }
}, { deep: true, immediate: true })

watch(() => props.trip?.route, (newRoute) => {
  debugLog('🔄 Trip route watcher triggered', { 
    hasNewRoute: !!newRoute,
    featuresCount: newRoute?.features?.length || 0
  })
  
  if (newRoute && map.value) {
    processRouteData(newRoute)
  }
}, { deep: true, immediate: true })

watch(() => props.driverPosition, (newPosition) => {
  debugLog('🔄 Driver position watcher triggered', { 
    hasNewPosition: !!newPosition,
    position: newPosition
  })
  
  if (newPosition && map.value) {
    updateDriverPosition()
  }
}, { deep: true })

watch(() => props.trip, async (newTrip) => {
  debugLog('🔄 Trip watcher triggered', { 
    hasNewTrip: !!newTrip,
    newTripId: newTrip?._id
  })
  
  if (newTrip && map.value) {
    await nextTick()
    await initializeTripData()
  }
}, { deep: true })

// Load Google Maps API
const loadGoogleMapsAPI = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.google && window.google.maps) {
      debugLog('Google Maps API already loaded')
      resolve()
      return
    }

    debugLog('Loading Google Maps API...')
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=geometry`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      debugLog('Google Maps API loaded successfully')
      resolve()
    }
    script.onerror = () => {
      debugLog('ERROR: Failed to load Google Maps API')
      reject(new Error('Failed to load Google Maps API'))
    }
    
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  console.log('Hellllllllo')
  try {
    debugLog('Component mounted, initializing...')
    await loadGoogleMapsAPI()
    await initializeMap()
  } catch (error) {
    debugLog('ERROR during component initialization', error)
    console.error('Error loading Google Maps:', error)
  }
})

onUnmounted(() => {
  debugLog('Component unmounting, cleaning up...')
  clearMarkersAndPolylines()
})
</script>

<style scoped>
.google-map-container {
  width: 100%;
  height: 100%;
}
</style>
