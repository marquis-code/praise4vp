<template>
    <div v-if="showDebug" class="fixed top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-md max-h-96 overflow-auto">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-sm">Route Debug Info</h3>
        <button @click="showDebug = false" class="text-gray-500 hover:text-gray-700">
          <!-- <IconX class="w-4 h-4" /> -->
        </button>
      </div>
      
      <div class="space-y-2 text-xs">
        <div>
          <strong>Connection Status:</strong> 
          <span :class="getStatusColor(connectionStatus)">{{ connectionStatus }}</span>
        </div>
        
        <div>
          <strong>Trip Route Features:</strong> {{ trip?.route?.features?.length || 0 }}
        </div>
        
        <div>
          <strong>Real-time Route Features:</strong> {{ realTimeRoute?.features?.length || 0 }}
        </div>
        
        <div>
          <strong>Last Update:</strong> {{ lastUpdateTime }}
        </div>
        
        <div v-if="trip?.route?.features">
          <strong>Route Features:</strong>
          <div class="ml-2 space-y-1">
            <div v-for="(feature, index) in trip.route.features" :key="index" class="text-xs">
              <div>{{ index + 1 }}. Type: {{ feature.geometry.type }}</div>
              <div v-if="feature.geometry.type === 'LineString'">
                Coordinates: {{ feature.geometry.coordinates?.length || 0 }}
              </div>
              <div v-if="feature.properties?.timeStamps">
                Timestamps: {{ feature.properties.timeStamps.length }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="driverPosition">
          <strong>Driver Position:</strong>
          <div class="ml-2">
            Lat: {{ driverPosition.lat?.toFixed(6) }}<br>
            Lng: {{ driverPosition.lng?.toFixed(6) }}<br>
            Speed: {{ driverPosition.speed || 0 }} km/h
          </div>
        </div>
      </div>
    </div>
    
    <!-- Debug toggle button -->
    <button 
      v-if="!showDebug"
      @click="showDebug = true"
      class="fixed top-4 left-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-40 hover:bg-blue-700"
      title="Show Debug Info"
    >
      <!-- <IconBug class="w-4 h-4" /> -->
    </button>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { 
    // IconX, 
    // IconBug 
} from 'lucide-vue-next'
  
  interface Props {
    trip: any
    realTimeRoute: any
    driverPosition: any
    connectionStatus: string
    lastUpdateTime: string
  }
  
  defineProps<Props>()
  
  const showDebug = ref(false)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600'
      case 'connecting': return 'text-yellow-600'
      case 'disconnected': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  </script>
  