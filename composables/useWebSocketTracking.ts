import { ref, onUnmounted } from "vue"
import { io, type Socket } from "socket.io-client"

interface DriverPosition {
  lat: number
  lng: number
  speed?: number
  heading?: number
  timestamp: string
}

interface TripEvent {
  type: string
  message: string
  timestamp: string
  data?: any
}

interface RouteFeature {
  type: "Feature"
  geometry: {
    type: "LineString" | "Point"
    coordinates: number[] | number[][]
  }
  properties: {
    event?: string
    userId?: string
    timeStamp?: string
    timeStamps?: string[]
    [key: string]: any
  }
}

interface RouteCollection {
  type: "FeatureCollection"
  features: RouteFeature[]
}

export const useWebSocketTracking = () => {
  // Connection state
  const socket = ref<Socket | null>(null)
  const connectionStatus = ref<"disconnected" | "connecting" | "connected">("disconnected")
  const currentTripId = ref<string | null>(null)

  // Real-time data
  const realTimeRoute = ref<RouteCollection | null>(null)
  const driverPosition = ref<DriverPosition | null>(null)
  const tripEvents = ref<TripEvent[]>([])
  const lastUpdateTime = ref<string>("Never")

  // Debug state
  const debugLogs = ref<string[]>([])
  const connectionAttempts = ref(0)
  const lastHeartbeat = ref<string>("Never")

  // WebSocket server URL - adjust as needed
  const WEBSOCKET_URL = "https://comiles-admin.onrender.com"

  // Debug logging function
  const debugLog = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`

    console.log(`🔌 WEBSOCKET: ${logMessage}`, data || "")

    // Store debug logs
    debugLogs.value.push(logMessage)
    if (debugLogs.value.length > 50) {
      debugLogs.value = debugLogs.value.slice(-50)
    }
  }

  const connect = () => {
    if (socket.value?.connected) {
      debugLog("Already connected to WebSocket")
      return
    }

    connectionAttempts.value++
    debugLog(`Connection attempt #${connectionAttempts.value}`)
    connectionStatus.value = "connecting"

    socket.value = io(WEBSOCKET_URL, {
      transports: ["websocket", "polling"],
      upgrade: true,
      timeout: 20000, // Increased timeout
      reconnection: true,
      reconnectionAttempts: 10, // More attempts
      reconnectionDelay: 2000, // Longer delay
      reconnectionDelayMax: 10000,
      maxReconnectionAttempts: 10,
      forceNew: true,
    })

    // Connection events
    socket.value.on("connect", () => {
      debugLog("✅ Connected to WebSocket server", {
        socketId: socket.value?.id,
        transport: socket.value?.io.engine.transport.name,
      })
      connectionStatus.value = "connected"
      connectionAttempts.value = 0

      // Re-subscribe to current trip if exists
      if (currentTripId.value) {
        debugLog(`Re-subscribing to trip: ${currentTripId.value}`)
        subscribeToTrip(currentTripId.value)
      }

      // Send heartbeat
      sendHeartbeat()
    })

    socket.value.on("disconnect", (reason) => {
      debugLog("❌ Disconnected from WebSocket server", { reason })
      connectionStatus.value = "disconnected"

      addTripEvent({
        type: "connection",
        message: `Connection lost: ${reason}`,
        timestamp: new Date().toISOString(),
      })
    })

    socket.value.on("connect_error", (error) => {
      debugLog("🚨 WebSocket connection error", {
        error: error.message,
        type: error.type,
        description: error.description,
      })
      connectionStatus.value = "disconnected"

      addTripEvent({
        type: "error",
        message: `Connection error: ${error.message}`,
        timestamp: new Date().toISOString(),
      })
    })

    socket.value.on("reconnect", (attemptNumber) => {
      debugLog("🔄 Reconnected to WebSocket", { attemptNumber })
    })

    socket.value.on("reconnect_attempt", (attemptNumber) => {
      debugLog("🔄 Reconnection attempt", { attemptNumber })
    })

    socket.value.on("reconnect_error", (error) => {
      debugLog("🚨 Reconnection error", { error: error.message })
    })

    socket.value.on("reconnect_failed", () => {
      debugLog("💀 Reconnection failed - all attempts exhausted")
    })

    // Trip-specific events
    socket.value.on("subscribed", (data) => {
      debugLog("📡 Subscribed to trip", data)

      addTripEvent({
        type: "subscription",
        message: `Subscribed to trip ${data.tripId}`,
        timestamp: new Date().toISOString(),
      })
    })

    socket.value.on("routeUpdate", (data) => {
      debugLog("🗺️ Route update received", {
        hasRoute: !!data.route,
        featuresCount: data.route?.features?.length || 0,
        tripId: data.tripId,
      })

      if (data.route) {
        realTimeRoute.value = data.route
        updateLastUpdateTime()

        addTripEvent({
          type: "route_update",
          message: `Route updated with ${data.route.features?.length || 0} features`,
          timestamp: new Date().toISOString(),
          data: data.route,
        })

        // Log route features for debugging
        if (data.route.features) {
          data.route.features.forEach((feature: any, index: number) => {
            if (feature.geometry.type === "LineString") {
              debugLog(`Route feature ${index}: LineString with ${feature.geometry.coordinates.length} coordinates`)
            } else if (feature.geometry.type === "Point") {
              debugLog(`Route feature ${index}: Point at [${feature.geometry.coordinates.join(", ")}]`)
            }
          })
        }
      }
    })

    socket.value.on("driverLocationUpdate", (data) => {
      debugLog("📍 Driver location update", {
        lat: data.latitude,
        lng: data.longitude,
        speed: data.speed,
        heading: data.heading,
      })

      driverPosition.value = {
        lat: data.latitude,
        lng: data.longitude,
        speed: data.speed,
        heading: data.heading,
        timestamp: data.timestamp || new Date().toISOString(),
      }

      updateLastUpdateTime()

      addTripEvent({
        type: "location_update",
        message: `Driver location: ${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`,
        timestamp: new Date().toISOString(),
        data: driverPosition.value,
      })
    })

    socket.value.on("tripStatusUpdate", (data) => {
      debugLog("📊 Trip status update", data)

      addTripEvent({
        type: "status_update",
        message: `Trip status changed to ${data.status}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("passengerPickup", (data) => {
      debugLog("🚶‍♂️ Passenger pickup event", data)

      addTripEvent({
        type: "pickup",
        message: `Passenger picked up at ${data.location}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("passengerDropoff", (data) => {
      debugLog("🚶‍♀️ Passenger dropoff event", data)

      addTripEvent({
        type: "dropoff",
        message: `Passenger dropped off at ${data.location}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("tripCompleted", (data) => {
      debugLog("✅ Trip completed", data)

      addTripEvent({
        type: "completion",
        message: "Trip completed successfully",
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("tripCancelled", (data) => {
      debugLog("❌ Trip cancelled", data)

      addTripEvent({
        type: "cancellation",
        message: `Trip cancelled: ${data.reason || "No reason provided"}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("driverArrived", (data) => {
      debugLog("🎯 Driver arrived", data)

      addTripEvent({
        type: "arrival",
        message: "Driver has arrived at pickup location",
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("emergencyAlert", (data) => {
      debugLog("🚨 Emergency alert", data)

      addTripEvent({
        type: "emergency",
        message: `Emergency alert: ${data.message}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    // Heartbeat events
    socket.value.on("pong", (data) => {
      lastHeartbeat.value = new Date().toLocaleTimeString()
      debugLog("💓 Heartbeat received", { latency: data })
    })

    // Generic event listener for debugging
    socket.value.onAny((eventName, ...args) => {
      if (!["pong", "connect", "disconnect"].includes(eventName)) {
        debugLog(`📨 Received event: ${eventName}`, args)
      }
    })

    // Start heartbeat interval
    startHeartbeat()
  }

  const disconnect = () => {
    debugLog("Disconnecting from WebSocket")

    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
    connectionStatus.value = "disconnected"
    currentTripId.value = null

    stopHeartbeat()
  }

  const subscribeToTrip = (tripId: string) => {
    if (!socket.value?.connected) {
      debugLog("Cannot subscribe to trip: WebSocket not connected", { tripId })
      return
    }

    // Unsubscribe from previous trip if any
    if (currentTripId.value && currentTripId.value !== tripId) {
      debugLog(`Unsubscribing from previous trip: ${currentTripId.value}`)
      socket.value.emit("unsubscribe", { tripId: currentTripId.value })
    }

    currentTripId.value = tripId

    // Subscribe to new trip
    socket.value.emit("subscribe", { tripId })

    debugLog(`📡 Subscribing to trip: ${tripId}`)

    // Request initial data
    socket.value.emit("requestTripData", { tripId })
    debugLog(`📊 Requesting initial trip data for: ${tripId}`)
  }

  const unsubscribeFromTrip = () => {
    if (socket.value?.connected && currentTripId.value) {
      debugLog(`Unsubscribing from trip: ${currentTripId.value}`)
      socket.value.emit("unsubscribe", { tripId: currentTripId.value })
      currentTripId.value = null
    }
  }

  // Heartbeat functionality
  let heartbeatInterval: NodeJS.Timeout | null = null

  const startHeartbeat = () => {
    stopHeartbeat() // Clear any existing interval

    heartbeatInterval = setInterval(() => {
      if (socket.value?.connected) {
        socket.value.emit("ping", Date.now())
      }
    }, 30000) // Send heartbeat every 30 seconds
  }

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  const sendHeartbeat = () => {
    if (socket.value?.connected) {
      socket.value.emit("ping", Date.now())
    }
  }

  const addTripEvent = (event: TripEvent) => {
    tripEvents.value.push(event)

    // Keep only last 100 events to prevent memory issues
    if (tripEvents.value.length > 100) {
      tripEvents.value = tripEvents.value.slice(-100)
    }
  }

  const updateLastUpdateTime = () => {
    lastUpdateTime.value = new Date().toISOString()
  }

  const clearTripData = () => {
    debugLog("Clearing all trip data")
    realTimeRoute.value = null
    driverPosition.value = null
    tripEvents.value = []
    lastUpdateTime.value = "Never"
  }

  const getConnectionInfo = () => {
    return {
      status: connectionStatus.value,
      socketId: socket.value?.id || null,
      transport: socket.value?.io?.engine?.transport?.name || null,
      attempts: connectionAttempts.value,
      lastHeartbeat: lastHeartbeat.value,
      currentTripId: currentTripId.value,
    }
  }

  // Force reconnection
  const forceReconnect = () => {
    debugLog("Forcing reconnection...")
    disconnect()
    setTimeout(() => {
      connect()
    }, 1000)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    debugLog("Composable unmounting, cleaning up...")
    stopHeartbeat()
    disconnect()
  })

  return {
    // State
    connectionStatus,
    realTimeRoute,
    driverPosition,
    tripEvents,
    lastUpdateTime,
    currentTripId,
    debugLogs,

    // Methods
    connect,
    disconnect,
    subscribeToTrip,
    unsubscribeFromTrip,
    clearTripData,
    getConnectionInfo,
    forceReconnect,
  }
}
