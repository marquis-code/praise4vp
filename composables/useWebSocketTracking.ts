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

  // WebSocket server URL - adjust as needed
  const WEBSOCKET_URL = "https://comiles-admin.onrender.com"

  const connect = () => {
    if (socket.value?.connected) {
      return
    }

    connectionStatus.value = "connecting"

    socket.value = io(WEBSOCKET_URL, {
      transports: ["websocket", "polling"],
      upgrade: true,
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Connection events
    socket.value.on("connect", () => {
      console.log("Connected to WebSocket server")
      connectionStatus.value = "connected"

      // Re-subscribe to current trip if exists
      if (currentTripId.value) {
        subscribeToTrip(currentTripId.value)
      }
    })

    socket.value.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason)
      connectionStatus.value = "disconnected"

      addTripEvent({
        type: "connection",
        message: `Connection lost: ${reason}`,
        timestamp: new Date().toISOString(),
      })
    })

    socket.value.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error)
      connectionStatus.value = "disconnected"

      addTripEvent({
        type: "error",
        message: `Connection error: ${error.message}`,
        timestamp: new Date().toISOString(),
      })
    })

    // Trip-specific events
    socket.value.on("subscribed", (data) => {
      console.log("Subscribed to trip:", data)

      addTripEvent({
        type: "subscription",
        message: `Subscribed to trip ${data.tripId}`,
        timestamp: new Date().toISOString(),
      })
    })

    socket.value.on("routeUpdate", (data) => {
      console.log("Route update received:", data)

      if (data.route) {
        realTimeRoute.value = data.route
        updateLastUpdateTime()

        addTripEvent({
          type: "route_update",
          message: "Route updated",
          timestamp: new Date().toISOString(),
          data: data.route,
        })
      }
    })

    socket.value.on("driverLocationUpdate", (data) => {
      console.log("Driver location update:", data)

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
        message: `Driver location updated`,
        timestamp: new Date().toISOString(),
        data: driverPosition.value,
      })
    })

    socket.value.on("tripStatusUpdate", (data) => {
      console.log("Trip status update:", data)

      addTripEvent({
        type: "status_update",
        message: `Trip status changed to ${data.status}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("passengerPickup", (data) => {
      console.log("Passenger pickup event:", data)

      addTripEvent({
        type: "pickup",
        message: `Passenger picked up at ${data.location}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("passengerDropoff", (data) => {
      console.log("Passenger dropoff event:", data)

      addTripEvent({
        type: "dropoff",
        message: `Passenger dropped off at ${data.location}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("tripCompleted", (data) => {
      console.log("Trip completed:", data)

      addTripEvent({
        type: "completion",
        message: "Trip completed successfully",
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("tripCancelled", (data) => {
      console.log("Trip cancelled:", data)

      addTripEvent({
        type: "cancellation",
        message: `Trip cancelled: ${data.reason || "No reason provided"}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("driverArrived", (data) => {
      console.log("Driver arrived:", data)

      addTripEvent({
        type: "arrival",
        message: "Driver has arrived at pickup location",
        timestamp: new Date().toISOString(),
        data,
      })
    })

    socket.value.on("emergencyAlert", (data) => {
      console.log("Emergency alert:", data)

      addTripEvent({
        type: "emergency",
        message: `Emergency alert: ${data.message}`,
        timestamp: new Date().toISOString(),
        data,
      })
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
    connectionStatus.value = "disconnected"
    currentTripId.value = null
  }

  const subscribeToTrip = (tripId: string) => {
    if (!socket.value?.connected) {
      console.warn("Cannot subscribe to trip: WebSocket not connected")
      return
    }

    currentTripId.value = tripId

    // Unsubscribe from previous trip if any
    if (currentTripId.value && currentTripId.value !== tripId) {
      socket.value.emit("unsubscribe", { tripId: currentTripId.value })
    }

    // Subscribe to new trip
    socket.value.emit("subscribe", { tripId })

    console.log(`Subscribing to trip: ${tripId}`)
  }

  const unsubscribeFromTrip = () => {
    if (socket.value?.connected && currentTripId.value) {
      socket.value.emit("unsubscribe", { tripId: currentTripId.value })
      currentTripId.value = null
    }
  }

  const addTripEvent = (event: TripEvent) => {
    tripEvents.value.push(event)

    // Keep only last 50 events to prevent memory issues
    if (tripEvents.value.length > 50) {
      tripEvents.value = tripEvents.value.slice(-50)
    }
  }

  const updateLastUpdateTime = () => {
    const now = new Date()
    lastUpdateTime.value = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const clearTripData = () => {
    realTimeRoute.value = null
    driverPosition.value = null
    tripEvents.value = []
    lastUpdateTime.value = "Never"
  }

  // Cleanup on unmount
  onUnmounted(() => {
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

    // Methods
    connect,
    disconnect,
    subscribeToTrip,
    unsubscribeFromTrip,
    clearTripData,
  }
}
