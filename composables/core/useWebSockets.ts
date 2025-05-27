import { ref, onMounted, onUnmounted, watch, readonly, computed } from "vue"
import { io, type Socket } from "socket.io-client"

// Types
interface TripData {
  _id: { $oid: string }
  primaryUserId: { $oid: string }
  driverId: { $oid: string }
  type: string
  isScheduled: boolean
  scheduledFor: { $date: string }
  status: "active" | "completed" | "pending"
  passengers: Passenger[]
  route: RouteFeatureCollection
  createdAt: { $date: string }
  updatedAt: { $date: string }
  isPrivate: boolean
}

interface Passenger {
  passengerId: { $oid: string }
  origin: LocationFeature
  destination: LocationFeature
  fare: { $numberLong: string }
  tax: number
  discount: number
  totalFare: { $numberLong: string }
  passengerStatus: string
}

interface LocationFeature {
  type: "Feature"
  geometry: {
    type: "Point"
    coordinates: [number, number]
  }
  properties: {
    address: string
  }
}

interface RouteFeatureCollection {
  type: "FeatureCollection"
  features: RouteFeature[]
}

interface RouteFeature {
  type: "Feature"
  geometry: {
    type: "LineString" | "Point"
    coordinates: number[][] | [number, number]
  }
  properties: {
    event?: "arrived-and-pickup" | "completed-and-dropoff"
    userId?: { $oid: string }
    timeStamp?: { $date: string }
  }
}

interface SocketMessage {
  type: "trip_update" | "location_update" | "trip_event" | "connection_ack" | "error" | "heartbeat"
  tripId?: string
  data?: Partial<TripData>
  payload?: any
  timestamp: string
  message?: string
}

interface VehiclePosition {
  lat: number
  lng: number
  bearing?: number
  speed?: number
  timestamp?: string
}

interface SocketConfig {
  url?: string
  reconnectionAttempts?: number
  reconnectionDelay?: number
  timeout?: number
  debug?: boolean
  auth?: Record<string, any>
}

export const useWebSocket = (tripId?: string, config: SocketConfig = {}) => {
  // Configuration with defaults
  const socketConfig = {
    url: config.url || "http://localhost:3001",
    reconnectionAttempts: config.reconnectionAttempts || 10,
    reconnectionDelay: config.reconnectionDelay || 1000,
    timeout: config.timeout || 20000,
    debug: config.debug || false,
    auth: config.auth || {},
  }

  // Socket instance
  const socket = ref<Socket | null>(null)

  // Connection state
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const isReconnecting = ref(false)
  const connectionError = ref<string | null>(null)
  const lastMessage = ref<SocketMessage | null>(null)
  const connectionAttempts = ref(0)
  const lastHeartbeat = ref<Date | null>(null)

  // Trip data
  const currentTrip = ref<TripData | null>(null)
  const vehiclePosition = ref<VehiclePosition | null>(null)
  const routeCoordinates = ref<[number, number][]>([])
  const pickupPoint = ref<[number, number] | null>(null)
  const dropoffPoint = ref<[number, number] | null>(null)
  const tripEvents = ref<RouteFeature[]>([])

  // Internal state
  let heartbeatInterval: NodeJS.Timeout | null = null

  const log = (message: string, data?: any) => {
    if (socketConfig.debug) {
      console.log(`[Socket.IO] ${message}`, data || "")
    }
  }

  const error = (message: string, data?: any) => {
    console.error(`[Socket.IO Error] ${message}`, data || "")
  }

  // Connection management
  const connect = () => {
    if (isConnecting.value || isConnected.value) {
      log("Already connecting or connected")
      return
    }

    isConnecting.value = true
    connectionError.value = null

    try {
      log("Connecting to Socket.IO server", socketConfig.url)

      socket.value = io(socketConfig.url, {
        reconnection: true,
        reconnectionAttempts: socketConfig.reconnectionAttempts,
        reconnectionDelay: socketConfig.reconnectionDelay,
        timeout: socketConfig.timeout,
        auth: {
          ...socketConfig.auth,
          tripId: tripId || null,
        },
        transports: ["websocket", "polling"],
      })

      setupEventListeners()
    } catch (err) {
      error("Failed to create Socket.IO connection", err)
      connectionError.value = "Failed to create connection"
      isConnecting.value = false
    }
  }

  const disconnect = () => {
    log("Disconnecting Socket.IO")

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }

    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }

    isConnected.value = false
    isConnecting.value = false
    isReconnecting.value = false
  }

  // Event listeners setup
  const setupEventListeners = () => {
    if (!socket.value) return

    // Connection events
    socket.value.on("connect", handleConnect)
    socket.value.on("disconnect", handleDisconnect)
    socket.value.on("connect_error", handleConnectError)
    socket.value.on("reconnect", handleReconnect)
    socket.value.on("reconnect_attempt", handleReconnectAttempt)
    socket.value.on("reconnect_error", handleReconnectError)
    socket.value.on("reconnect_failed", handleReconnectFailed)

    // Trip tracking events
    socket.value.on("trip_update", handleTripUpdate)
    socket.value.on("location_update", handleLocationUpdate)
    socket.value.on("trip_event", handleTripEvent)
    socket.value.on("route_update", handleRouteUpdate)
    socket.value.on("vehicle_position", handleVehiclePosition)

    // System events
    socket.value.on("error", handleError)
    socket.value.on("pong", handlePong)
  }

  // Connection event handlers
  const handleConnect = () => {
    log("Socket.IO connected successfully")

    isConnected.value = true
    isConnecting.value = false
    isReconnecting.value = false
    connectionError.value = null
    connectionAttempts.value = 0
    lastHeartbeat.value = new Date()

    // Start heartbeat
    startHeartbeat()

    // Join trip room if tripId provided
    if (tripId) {
      joinTripRoom(tripId)
    }

    // Emit connection acknowledgment
    emit("client_connected", {
      clientId: generateClientId(),
      tripId: tripId || null,
      timestamp: new Date().toISOString(),
    })
  }

  const handleDisconnect = (reason: string) => {
    log("Socket.IO disconnected", reason)

    isConnected.value = false
    isConnecting.value = false

    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }

    if (reason === "io server disconnect") {
      // Server initiated disconnect, reconnect manually
      setTimeout(connect, 1000)
    }
  }

  const handleConnectError = (err: Error) => {
    error("Connection error", err.message)
    connectionError.value = err.message
    isConnecting.value = false
  }

  const handleReconnect = (attemptNumber: number) => {
    log(`Reconnected after ${attemptNumber} attempts`)
    isReconnecting.value = false
    connectionAttempts.value = 0
  }

  const handleReconnectAttempt = (attemptNumber: number) => {
    log(`Reconnection attempt ${attemptNumber}`)
    isReconnecting.value = true
    connectionAttempts.value = attemptNumber
  }

  const handleReconnectError = (err: Error) => {
    error("Reconnection error", err.message)
    connectionError.value = err.message
  }

  const handleReconnectFailed = () => {
    error("Reconnection failed - max attempts reached")
    connectionError.value = "Reconnection failed - max attempts reached"
    isReconnecting.value = false
  }

  // Trip event handlers
  const handleTripUpdate = (data: Partial<TripData>) => {
    log("Received trip update", data)

    if (currentTrip.value) {
      currentTrip.value = { ...currentTrip.value, ...data } as TripData
    } else {
      currentTrip.value = data as TripData
    }

    updateRouteData(currentTrip.value)
  }

  const handleLocationUpdate = (data: { route?: RouteFeatureCollection; coordinates?: [number, number] }) => {
    log("Received location update", data)

    if (data.route) {
      updateRouteFromFeatures(data.route.features || [])
    }

    if (data.coordinates) {
      addRouteCoordinate(data.coordinates[1], data.coordinates[0])
    }
  }

  const handleTripEvent = (data: RouteFeature) => {
    log("Received trip event", data)
    tripEvents.value.push(data)

    // Update pickup/dropoff points based on event
    if (data.properties.event === "arrived-and-pickup" && Array.isArray(data.geometry.coordinates)) {
      const coords = data.geometry.coordinates as [number, number]
      pickupPoint.value = [coords[1], coords[0]]
    } else if (data.properties.event === "completed-and-dropoff" && Array.isArray(data.geometry.coordinates)) {
      const coords = data.geometry.coordinates as [number, number]
      dropoffPoint.value = [coords[1], coords[0]]
    }
  }

  const handleRouteUpdate = (data: { coordinates: number[][] }) => {
    log("Received route update", data)

    if (data.coordinates && Array.isArray(data.coordinates)) {
      routeCoordinates.value = data.coordinates.map((coord) => [coord[1], coord[0]])

      // Update vehicle position to latest coordinate
      if (data.coordinates.length > 0) {
        const latestCoord = data.coordinates[data.coordinates.length - 1]
        vehiclePosition.value = {
          lat: latestCoord[1],
          lng: latestCoord[0],
          timestamp: new Date().toISOString(),
        }
      }
    }
  }

  const handleVehiclePosition = (data: VehiclePosition) => {
    log("Received vehicle position", data)
    vehiclePosition.value = data
  }

  const handleError = (err: any) => {
    error("Socket error", err)
    connectionError.value = err.message || "Socket error occurred"
  }

  const handlePong = () => {
    lastHeartbeat.value = new Date()
  }

  // Utility methods
  const emit = (event: string, data?: any) => {
    if (!socket.value || !isConnected.value) {
      error("Cannot emit: Socket not connected")
      return false
    }

    try {
      socket.value.emit(event, data)
      log(`Emitted event: ${event}`, data)
      return true
    } catch (err) {
      error(`Failed to emit event: ${event}`, err)
      return false
    }
  }

  const joinTripRoom = (tripId: string) => {
    return emit("join_trip", { tripId })
  }

  const leaveTripRoom = (tripId: string) => {
    return emit("leave_trip", { tripId })
  }

  const subscribeToTrip = (tripId: string) => {
    return emit("subscribe_trip", { tripId })
  }

  const unsubscribeFromTrip = (tripId: string) => {
    return emit("unsubscribe_trip", { tripId })
  }

  // Heartbeat mechanism
  const startHeartbeat = () => {
    heartbeatInterval = setInterval(() => {
      if (isConnected.value && socket.value) {
        socket.value.emit("ping")
      }
    }, 30000) // 30 seconds
  }

  // Route data processing
  const updateRouteData = (trip: TripData) => {
    if (!trip?.route?.features) return

    const features = trip.route.features
    log("Updating route data", features)

    // Extract route coordinates (LineString)
    const lineStringFeature = features.find((f) => f.geometry.type === "LineString")
    if (lineStringFeature && Array.isArray(lineStringFeature.geometry.coordinates)) {
      const coords = lineStringFeature.geometry.coordinates as number[][]
      routeCoordinates.value = coords.map((coord) => [coord[1], coord[0]]) // Convert to [lat, lng]

      // Update vehicle position to latest coordinate
      if (coords.length > 0) {
        const latestCoord = coords[coords.length - 1]
        vehiclePosition.value = {
          lat: latestCoord[1],
          lng: latestCoord[0],
          timestamp: new Date().toISOString(),
        }
      }
    }

    // Extract pickup and dropoff points
    const pickupFeature = features.find(
      (f) => f.geometry.type === "Point" && f.properties.event === "arrived-and-pickup",
    )
    const dropoffFeature = features.find(
      (f) => f.geometry.type === "Point" && f.properties.event === "completed-and-dropoff",
    )

    if (pickupFeature && Array.isArray(pickupFeature.geometry.coordinates)) {
      const coords = pickupFeature.geometry.coordinates as [number, number]
      pickupPoint.value = [coords[1], coords[0]] // [lat, lng]
    }

    if (dropoffFeature && Array.isArray(dropoffFeature.geometry.coordinates)) {
      const coords = dropoffFeature.geometry.coordinates as [number, number]
      dropoffPoint.value = [coords[1], coords[0]] // [lat, lng]
    }
  }

  const updateRouteFromFeatures = (features: RouteFeature[]) => {
    const lineStringFeature = features.find((f) => f.geometry.type === "LineString")
    if (lineStringFeature && Array.isArray(lineStringFeature.geometry.coordinates)) {
      const coords = lineStringFeature.geometry.coordinates as number[][]
      routeCoordinates.value = coords.map((coord) => [coord[1], coord[0]])

      // Update vehicle position
      if (coords.length > 0) {
        const latestCoord = coords[coords.length - 1]
        vehiclePosition.value = {
          lat: latestCoord[1],
          lng: latestCoord[0],
          timestamp: new Date().toISOString(),
        }
      }
    }
  }

  // Utility functions
  const generateClientId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  const getConnectionStatus = () => {
    if (isConnected.value) return "connected"
    if (isReconnecting.value) return "reconnecting"
    if (isConnecting.value) return "connecting"
    return "disconnected"
  }

  const forceReconnect = () => {
    log("Forcing reconnection")
    disconnect()
    setTimeout(connect, 1000)
  }

  // Manual data setters for testing
  const setTripData = (trip: TripData) => {
    currentTrip.value = trip
    updateRouteData(trip)
  }

  const addRouteCoordinate = (lat: number, lng: number) => {
    routeCoordinates.value.push([lat, lng])
    vehiclePosition.value = { lat, lng, timestamp: new Date().toISOString() }
  }

  const simulateMovement = (startCoords: [number, number], endCoords: [number, number], steps = 20) => {
    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress
      const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress

      addRouteCoordinate(lat, lng)

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, 1000)
  }

  // Lifecycle management
  onMounted(() => {
    log("Socket.IO composable mounted")
    connect()
  })

  onUnmounted(() => {
    log("Socket.IO composable unmounted")
    disconnect()
  })

  // Watch for tripId changes
  watch(
    () => tripId,
    (newTripId, oldTripId) => {
      if (oldTripId && isConnected.value) {
        leaveTripRoom(oldTripId)
        unsubscribeFromTrip(oldTripId)
      }
      if (newTripId && isConnected.value) {
        joinTripRoom(newTripId)
        subscribeToTrip(newTripId)
      }
    },
  )

  return {
    // Connection state (readonly)
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    isReconnecting: readonly(isReconnecting),
    connectionError: readonly(connectionError),
    connectionStatus: computed(() => getConnectionStatus()),
    connectionAttempts: readonly(connectionAttempts),
    lastMessage: readonly(lastMessage),
    lastHeartbeat: readonly(lastHeartbeat),

    // Trip data (readonly)
    currentTrip: readonly(currentTrip),
    vehiclePosition: readonly(vehiclePosition),
    routeCoordinates: readonly(routeCoordinates),
    pickupPoint: readonly(pickupPoint),
    dropoffPoint: readonly(dropoffPoint),
    tripEvents: readonly(tripEvents),

    // Socket instance (readonly)
    socket: readonly(socket),

    // Methods
    connect,
    disconnect,
    forceReconnect,
    emit,
    joinTripRoom,
    leaveTripRoom,
    subscribeToTrip,
    unsubscribeFromTrip,

    // Manual data setters for testing
    setTripData,
    addRouteCoordinate,
    simulateMovement,
  }
}
