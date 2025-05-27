<!-- <template>
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
    trip: Record<string, any>
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
  </style> -->


  <template>
    <div class="google-map-container h-full w-full relative">
      <div ref="mapContainer" class="h-full w-full"></div>
      
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        <p class="ml-3 text-gray-600">Loading map...</p>
      </div>
  
      <!-- Connection Status -->
      <div class="absolute top-4 right-4 z-20">
        <div class="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-lg border">
          <div 
            :class="[
              'w-3 h-3 rounded-full transition-colors',
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' : 
              connectionStatus === 'connecting' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'
            ]"
          ></div>
          <span class="text-sm font-medium capitalize">
            {{ connectionStatus }}
          </span>
        </div>
      </div>
  
      <!-- Trip Info Panel -->
      <div v-if="currentTrip" class="absolute bottom-4 left-4 right-4 z-20">
        <div class="bg-white rounded-lg p-4 shadow-lg border max-w-md mx-auto">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-lg">Live Trip Tracking</h3>
            <span 
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                currentTrip.status === 'active' ? 'bg-green-100 text-green-800' :
                currentTrip.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              ]"
            >
              {{ currentTrip.status.toUpperCase() }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Route Points:</span>
              <span class="ml-2 font-medium">{{ routeCoordinates.length }}</span>
            </div>
            <div>
              <span class="text-gray-600">Trip Type:</span>
              <span class="ml-2 font-medium">{{ currentTrip.type }}</span>
            </div>
          </div>
          
          <div v-if="vehiclePosition" class="mt-2 text-sm">
            <span class="text-gray-600">Vehicle:</span>
            <span class="ml-2 font-medium text-xs">
              {{ vehiclePosition.lat.toFixed(6) }}, {{ vehiclePosition.lng.toFixed(6) }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Test Controls -->
      <div class="absolute top-4 left-4 z-20">
        <div class="bg-white rounded-lg p-3 shadow-lg border">
          <div class="flex flex-col gap-2">
            <button
              @click="simulateRealTimeMovement"
              :disabled="isSimulating"
              class="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSimulating ? 'Simulating...' : 'Simulate Movement' }}
            </button>
            <button
              @click="loadSampleTrip"
              class="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Load Sample Trip
            </button>
            <button
              @click="clearTracking"
              class="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Clear Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import { useWebSocket } from '@/composables/core/useWebSockets';
  
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
    tripId?: string
    markers?: Marker[]
    apiKey?: string
  }>()
  
  // Map state
  const mapContainer = ref<HTMLElement | null>(null)
  const loading = ref(true)
  const googleMapsLoaded = ref(false)
  const isSimulating = ref(false)
  
  // Map instances
  let map: any = null
  let directionsService: any = null
  let directionsRenderer: any = null
  let originMarker: any = null
  let destinationMarker: any = null
  let vehicleMarker: any = null
  let realtimePolyline: any = null
  let pickupMarker: any = null
  let dropoffMarker: any = null
  
  // WebSocket integration
  const {
    isConnected,
    connectionStatus,
    currentTrip,
    vehiclePosition,
    routeCoordinates,
    pickupPoint,
    dropoffPoint,
    setTripData,
    addRouteCoordinate,
    simulateMovement
  } = useWebSocket(props.tripId)
  
  // Sample trip data for testing
  const sampleTripData = {
    _id: { $oid: "6758bfb79d6e31eef82a9ba2" },
    primaryUserId: { $oid: "66ed3ca5a3291a0db25f5a1f" },
    driverId: { $oid: "66ed3deaa0eaa9a24d610859" },
    type: "local",
    isScheduled: false,
    scheduledFor: { $date: "1970-01-01T00:00:00.000Z" },
    status: "active",
    passengers: [
      {
        passengerId: { $oid: "66ed3ca5a3291a0db25f5a1f" },
        origin: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [props.origin.lng, props.origin.lat]
          },
          properties: {
            address: "Pickup Location"
          }
        },
        destination: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [props.destination.lng, props.destination.lat]
          },
          properties: {
            address: "Dropoff Location"
          }
        },
        fare: { $numberLong: "8440" },
        tax: 0,
        discount: 0,
        totalFare: { $numberLong: "8440" },
        passengerStatus: "active"
      }
    ],
    route: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [props.origin.lng, props.origin.lat],
              [props.destination.lng, props.destination.lat]
            ]
          },
          properties: {}
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [props.origin.lng, props.origin.lat]
          },
          properties: {
            event: "arrived-and-pickup",
            userId: { $oid: "66ed3ca5a3291a0db25f5a1f" },
            timeStamp: { $date: new Date().toISOString() }
          }
        }
      ]
    },
    createdAt: { $date: new Date().toISOString() },
    updatedAt: { $date: new Date().toISOString() },
    isPrivate: true
  }
  
  // Load Google Maps API
  const loadGoogleMapsApi = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) {
        googleMapsLoaded.value = true
        resolve()
        return
      }
  
      const script = document.createElement('script')
      const apiKey = props.apiKey || 'YOUR_API_KEY'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMapsCallback`
      script.async = true
      script.defer = true
  
      window.initGoogleMapsCallback = () => {
        googleMapsLoaded.value = true
        resolve()
      }
  
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        reject(new Error('Failed to load Google Maps API'))
      }
  
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
      console.log('Initializing real-time tracking map')
      
      map = new window.google.maps.Map(mapContainer.value, {
        center: { 
          lat: (props.origin.lat + props.destination.lat) / 2, 
          lng: (props.origin.lng + props.destination.lng) / 2 
        },
        zoom: 13,
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
  
      // Initialize directions service
      directionsService = new window.google.maps.DirectionsService()
      directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#E5E7EB',
          strokeWeight: 3,
          strokeOpacity: 0.6
        }
      })
  
      // Add initial markers
      addInitialMarkers()
      
      // Calculate initial route
      calculateInitialRoute()
  
      loading.value = false
      console.log('Real-time tracking map initialized successfully')
    } catch (error) {
      console.error('Error initializing map:', error)
      loading.value = false
    }
  }
  
  // Add initial origin and destination markers
  const addInitialMarkers = () => {
    if (!map || !window.google) return
  
    try {
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
  
      originMarker = new window.google.maps.Marker({
        position: props.origin,
        map: map,
        title: 'Pickup Location',
        icon: originIcon,
        zIndex: 100
      })
  
      destinationMarker = new window.google.maps.Marker({
        position: props.destination,
        map: map,
        title: 'Dropoff Location',
        icon: destinationIcon,
        zIndex: 100
      })
  
      console.log('Initial markers added')
    } catch (error) {
      console.error('Error adding initial markers:', error)
    }
  }
  
  // Calculate initial route for reference
  const calculateInitialRoute = () => {
    if (!directionsService || !directionsRenderer) return
  
    directionsService.route(
      {
        origin: props.origin,
        destination: props.destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(response)
          if (map && response?.routes[0]?.bounds) {
            map.fitBounds(response.routes[0].bounds)
          }
        }
      }
    )
  }
  
  // Create vehicle marker with custom icon
  const createVehicleMarker = (position: LatLng) => {
    if (!map || !window.google) return
  
    const vehicleIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="#2563eb"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 16)
    }
  
    if (vehicleMarker) {
      vehicleMarker.setMap(null)
    }
  
    vehicleMarker = new window.google.maps.Marker({
      position,
      map,
      title: 'Vehicle Location',
      icon: vehicleIcon,
      zIndex: 200
    })
  }
  
  // Create pickup marker
  const createPickupMarker = (position: LatLng) => {
    if (!map || !window.google) return
  
    const pickupIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z" fill="#10b981"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    }
  
    if (pickupMarker) {
      pickupMarker.setMap(null)
    }
  
    pickupMarker = new window.google.maps.Marker({
      position,
      map,
      title: 'Pickup Point',
      icon: pickupIcon,
      zIndex: 150
    })
  }
  
  // Create dropoff marker
  const createDropoffMarker = (position: LatLng) => {
    if (!map || !window.google) return
  
    const dropoffIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z" fill="#ef4444"/>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    }
  
    if (dropoffMarker) {
      dropoffMarker.setMap(null)
    }
  
    dropoffMarker = new window.google.maps.Marker({
      position,
      map,
      title: 'Dropoff Point',
      icon: dropoffIcon,
      zIndex: 150
    })
  }
  
  // Update real-time polyline
  const updateRealtimePolyline = (coordinates: [number, number][]) => {
    if (!map || !window.google || coordinates.length < 2) return
  
    // Convert coordinates to Google Maps LatLng format
    const path = coordinates.map(coord => ({
      lat: coord[0],
      lng: coord[1]
    }))
  
    // Remove existing polyline
    if (realtimePolyline) {
      realtimePolyline.setMap(null)
    }
  
    // Create new polyline
    realtimePolyline = new window.google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#2563eb',
      strokeOpacity: 1.0,
      strokeWeight: 5,
      zIndex: 50
    })
  
    realtimePolyline.setMap(map)
  
    // Fit bounds to include all points
    const bounds = new window.google.maps.LatLngBounds()
    path.forEach(point => bounds.extend(point))
    map.fitBounds(bounds)
  }
  
  // Test functions
  const loadSampleTrip = () => {
    console.log('Loading sample trip data')
    setTripData(sampleTripData)
  }
  
  const simulateRealTimeMovement = () => {
    if (isSimulating.value) return
    
    isSimulating.value = true
    console.log('Starting real-time movement simulation')
    
    // Load sample trip first
    if (!currentTrip.value) {
      loadSampleTrip()
    }
  
    // Simulate movement from origin to destination
    const steps = 25
    let currentStep = 0
    
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      const lat = props.origin.lat + (props.destination.lat - props.origin.lat) * progress
      const lng = props.origin.lng + (props.destination.lng - props.origin.lng) * progress
      
      // Add some randomness to make it more realistic
      const randomLat = lat + (Math.random() - 0.5) * 0.001
      const randomLng = lng + (Math.random() - 0.5) * 0.001
      
      addRouteCoordinate(randomLat, randomLng)
      
      if (currentStep >= steps) {
        clearInterval(interval)
        isSimulating.value = false
        console.log('Movement simulation completed')
        
        // Add dropoff event
        setTimeout(() => {
          if (currentTrip.value) {
            const updatedTrip = { ...currentTrip.value }
            updatedTrip.route.features.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [props.destination.lng, props.destination.lat]
              },
              properties: {
                event: "completed-and-dropoff",
                userId: { $oid: "66ed3ca5a3291a0db25f5a1f" },
                timeStamp: { $date: new Date().toISOString() }
              }
            })
            updatedTrip.status = "completed"
            setTripData(updatedTrip)
          }
        }, 1000)
      }
    }, 800) // Update every 800ms for smooth animation
  }
  
  const clearTracking = () => {
    console.log('Clearing tracking data')
    
    // Remove real-time elements
    if (realtimePolyline) {
      realtimePolyline.setMap(null)
      realtimePolyline = null
    }
    
    if (vehicleMarker) {
      vehicleMarker.setMap(null)
      vehicleMarker = null
    }
    
    if (pickupMarker) {
      pickupMarker.setMap(null)
      pickupMarker = null
    }
    
    if (dropoffMarker) {
      dropoffMarker.setMap(null)
      dropoffMarker = null
    }
    
    isSimulating.value = false
  }
  
  // Watch for real-time updates
  watch(routeCoordinates, (newCoordinates) => {
    if (newCoordinates.length > 0) {
      console.log('Route coordinates updated:', newCoordinates.length, 'points')
      updateRealtimePolyline(newCoordinates)
    }
  }, { deep: true })
  
  watch(vehiclePosition, (newPosition) => {
    if (newPosition && map) {
      console.log('Vehicle position updated:', newPosition)
      createVehicleMarker({ lat: newPosition.lat, lng: newPosition.lng })
    }
  }, { deep: true })
  
  watch(pickupPoint, (newPickupPoint) => {
    if (newPickupPoint && map) {
      console.log('Pickup point updated:', newPickupPoint)
      createPickupMarker({ lat: newPickupPoint[0], lng: newPickupPoint[1] })
    }
  }, { deep: true })
  
  watch(dropoffPoint, (newDropoffPoint) => {
    if (newDropoffPoint && map) {
      console.log('Dropoff point updated:', newDropoffPoint)
      createDropoffMarker({ lat: newDropoffPoint[0], lng: newDropoffPoint[1] })
    }
  }, { deep: true })
  
  // Clean up resources
  const cleanUp = () => {
    try {
      clearTracking()
      
      if (map && window.google) {
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
    console.log('GoogleMapRealtime component mounted')
    try {
      await loadGoogleMapsApi()
      console.log('Google Maps API loaded')
      await nextTick()
      initMap()
    } catch (error) {
      console.error('Error in GoogleMapRealtime onMounted:', error)
      loading.value = false
    }
  })
  
  onUnmounted(() => {
    console.log('GoogleMapRealtime component unmounted')
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
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  </style>
  