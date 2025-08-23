<template>
    <div class="space-y-4">
      <div 
        v-for="(passenger, index) in currentLocationPassengers" 
        :key="passenger.passengerId || `passenger-${index}`"
        class="group relative bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <!-- Header Card -->
        <div class="bg-primary p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <input 
                  type="checkbox" 
                  v-model="selectedPassengers" 
                  :value="passenger.passengerId || 'nil'"
                  class="form-checkbox h-5 w-5 text-white bg-transparent border-2 border-white rounded focus:ring-white focus:ring-2"
                />
              </div>
              
              <div class="relative">
                <div class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/30">
                  {{ getPassengerInitials(passenger.passengerId) }}
                </div>
                <div class="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white" 
                     :class="getOnlineStatusClass(passenger.passengerStatus)">
                </div>
              </div>
              
              <div>
                <h2 class="text-xl font-bold">
                  Passenger #{{ formatPassengerId(passenger.passengerId) }}
                </h2>
                <p class="text-indigo-100 text-sm">
                  ID: {{ passenger.passengerId || 'Nil' }}
                </p>
                <div class="flex items-center mt-2 space-x-4">
                  <span 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="getStatusClass(passenger.passengerStatus || 'nil')"
                  >
                    <div class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(passenger.passengerStatus || 'nil')"></div>
                    {{ passenger.passengerStatus || 'Nil' }}
                  </span>
                  <div class="text-indigo-100 text-sm">
                    Trip Duration: {{ calculateTripDuration(passenger) }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button 
                @click="$emit('notify-passenger', passenger.passengerId)"
                class="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Notify Passenger"
              >
                <Bell class="h-5 w-5" />
              </button>
              <button 
                @click="$emit('message-passenger', passenger.passengerId)"
                class="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="Message Passenger"
              >
                <MessageSquare class="h-5 w-5" />
              </button>
              <button 
                @click="$emit('show-passenger-menu', passenger.passengerId)"
                class="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                title="More Options"
              >
                <MoreVertical class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
  
        <!-- Main Content -->
        <div class="p-6">
          <!-- Route Information with Map Preview -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Route class="h-5 w-5 mr-2 text-indigo-600" />
              Trip Route Details
            </h3>
            
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Origin Details -->
              <div class="bg-green-50 rounded-xl p-4 border border-green-200">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-4 w-4 rounded-full bg-green-500 mt-1"></div>
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm font-bold text-green-700 uppercase tracking-wide mb-2">
                      <MapPin class="inline h-4 w-4 mr-1" />
                      Pickup Location
                    </p>
                    <p class="text-gray-900 font-semibold mb-2">
                      {{ passenger.origin?.properties?.address || 'Nil' }}
                    </p>
                    <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span class="font-medium">Coordinates:</span><br>
                        {{ formatCoordinates(passenger.origin?.geometry?.coordinates) }}
                      </div>
                      <div>
                        <span class="font-medium">Timestamps:</span><br>
                        {{ formatTimestamps(passenger.origin?.properties?.timeStamps) }}
                      </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      <span class="font-medium">Geometry Type:</span> {{ passenger.origin?.geometry?.type || 'Nil' }}
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Destination Details -->
              <div class="bg-red-50 rounded-xl p-4 border border-red-200">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="h-4 w-4 rounded-full bg-red-500 mt-1"></div>
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm font-bold text-red-700 uppercase tracking-wide mb-2">
                      <Flag class="inline h-4 w-4 mr-1" />
                      Drop-off Location
                    </p>
                    <p class="text-gray-900 font-semibold mb-2">
                      {{ passenger.destination?.properties?.address || 'Nil' }}
                    </p>
                    <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span class="font-medium">Coordinates:</span><br>
                        {{ formatCoordinates(passenger.destination?.geometry?.coordinates) }}
                      </div>
                      <div>
                        <span class="font-medium">Timestamps:</span><br>
                        {{ formatTimestamps(passenger.destination?.properties?.timeStamps) }}
                      </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                      <span class="font-medium">Geometry Type:</span> {{ passenger.destination?.geometry?.type || 'Nil' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Route Stats -->
            <div class="mt-4 bg-gray-50 rounded-xl p-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-indigo-600">{{ calculateDistance(passenger) }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide">Est. Distance</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-indigo-600">{{ calculateTravelTime(passenger) }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide">Est. Travel Time</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-indigo-600">{{ getRouteType(passenger) }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide">Route Type</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-indigo-600">{{ getLocationZone(passenger.origin) }}</div>
                  <div class="text-xs text-gray-500 uppercase tracking-wide">Origin Zone</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Comprehensive Fare Breakdown -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard class="h-5 w-5 mr-2 text-indigo-600" />
              Financial Details
            </h3>
            
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Fare Components -->
              <div class="space-y-4">
                <!-- Base Fare -->
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-semibold text-blue-900">Base Fare</h4>
                      <p class="text-xs text-blue-700">Primary trip cost</p>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-blue-900">
                        {{ formatCurrency(passenger.fare?.priceInUserCurrency, passenger.fare?.currencySymbol) }}
                      </div>
                      <div class="text-xs text-blue-700">
                        CAD: {{ formatCurrency(passenger.fare?.priceInCAD, 'CAD') }}
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Tax -->
                <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-semibold text-yellow-900">Tax & Fees</h4>
                      <p class="text-xs text-yellow-700">Government taxes</p>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-yellow-900">
                        {{ formatCurrency(passenger.tax?.priceInUserCurrency, passenger.tax?.currencySymbol) }}
                      </div>
                      <div class="text-xs text-yellow-700">
                        CAD: {{ formatCurrency(passenger.tax?.priceInCAD, 'CAD') }}
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Discount -->
                <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-semibold text-green-900">Discount</h4>
                      <p class="text-xs text-green-700">Applied savings</p>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-green-900">
                        {{ passenger.discount?.priceInUserCurrency > 0 ? '-' : '' }}{{ formatCurrency(passenger.discount?.priceInUserCurrency, passenger.discount?.currencySymbol) }}
                      </div>
                      <div class="text-xs text-green-700">
                        CAD: {{ formatCurrency(passenger.discount?.priceInCAD, 'CAD') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Total & Exchange Info -->
              <div class="space-y-4">
                <!-- Total Fare -->
                <div class="bg-primary rounded-lg p-6 text-white">
                  <div class="text-center">
                    <h4 class="text-sm font-medium text-indigo-100 uppercase tracking-wide mb-2">Total Amount</h4>
                    <div class="text-4xl font-bold mb-2">
                      {{ formatCurrency(passenger.totalFare?.priceInUserCurrency, passenger.totalFare?.currencySymbol) }}
                    </div>
                    <div class="text-indigo-200">
                      CAD Equivalent: {{ formatCurrency(passenger.totalFare?.priceInCAD, 'CAD') }}
                    </div>
                  </div>
                </div>
  
                <!-- Exchange Rate Info -->
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 class="font-semibold text-gray-900">Exchange Rate Details</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Currency:</span>
                      <span class="font-medium">{{ passenger.totalFare?.currencyName || 'Nil' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Exchange Rate:</span>
                      <span class="font-medium">{{ formatRate(passenger.totalFare?.rate) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Rate Updated:</span>
                      <span class="font-medium">{{ formatDateTime(passenger.totalFare?.rateTimestamp) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Data Source:</span>
                      <span class="font-medium text-xs">{{ getAttributionSource(passenger.totalFare?.attribution) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Trip Metadata & System Information -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Info class="h-5 w-5 mr-2 text-indigo-600" />
              Trip Metadata
            </h3>
            
            <div class="grid md:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <Clock class="h-4 w-4 text-gray-500 mr-2" />
                  <span class="text-sm font-medium text-gray-700">Timing Information</span>
                </div>
                <div class="space-y-1 text-xs text-gray-600">
                  <div>Rate Timestamp: {{ formatDateTime(passenger.totalFare?.rateTimestamp) }}</div>
                  <div>Trip Created: {{ formatDateTime(passenger.totalFare?.rateTimestamp) }}</div>
                  <div>Last Updated: {{ formatRelativeTime(passenger.totalFare?.rateTimestamp) }}</div>
                </div>
              </div>
  
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <Database class="h-4 w-4 text-gray-500 mr-2" />
                  <span class="text-sm font-medium text-gray-700">System Data</span>
                </div>
                <div class="space-y-1 text-xs text-gray-600">
                  <div>Passenger ID: {{ passenger.passengerId || 'Nil' }}</div>
                  <div>Status: {{ passenger.passengerStatus || 'Nil' }}</div>
                  <div>Feature Type: {{ passenger.origin?.type || 'Nil' }}</div>
                </div>
              </div>
  
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <Shield class="h-4 w-4 text-gray-500 mr-2" />
                  <span class="text-sm font-medium text-gray-700">Data Integrity</span>
                </div>
                <div class="space-y-1 text-xs text-gray-600">
                  <div>Origin Valid: {{ validateLocationData(passenger.origin) ? '✓' : '✗' }}</div>
                  <div>Destination Valid: {{ validateLocationData(passenger.destination) ? '✓' : '✗' }}</div>
                  <div>Fare Valid: {{ validateFareData(passenger.totalFare) ? '✓' : '✗' }}</div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <!-- <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button 
              @click="$emit('view-route', passenger)"
              class="flex-1 min-w-0 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <Map class="h-4 w-4 mr-2" />
              View Route
            </button>
            <button 
              @click="$emit('contact-passenger', passenger.passengerId)"
              class="flex-1 min-w-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Phone class="h-4 w-4 mr-2" />
              Contact
            </button>
            <button 
              @click="$emit('update-status', passenger.passengerId)"
              class="flex-1 min-w-0 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
            >
              <Edit class="h-4 w-4 mr-2" />
              Update
            </button>
            <button 
              @click="$emit('export-data', passenger)"
              class="flex-1 min-w-0 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <Download class="h-4 w-4 mr-2" />
              Export
            </button>
          </div> -->
        </div>
      </div>
      
      <!-- Enhanced Empty State -->
      <div v-if="!currentLocationPassengers?.length" class="text-center py-16">
        <div class="relative inline-block">
          <div class="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-inner">
            <Users class="h-16 w-16 text-gray-400" />
          </div>
          <div class="absolute -top-2 -right-2">
            <div class="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center border-4 border-white shadow-lg">
              <Search class="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">No passengers at this location</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-8">
          When passengers request rides from this location, they'll appear here with detailed trip information and fare breakdowns.
        </p>
        <div class="flex justify-center space-x-4">
          <button 
            @click="$emit('refresh-passengers')"
            class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button 
            @click="$emit('change-location')"
            class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <MapPin class="h-4 w-4 mr-2" />
            Change Location
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
import {
  Bell, MessageSquare, MoreVertical, Route, MapPin, Flag, CreditCard,
  Info, Clock, Database, Shield, Users, Search, RefreshCw,
  Map, Phone, Edit, Download
} from 'lucide-vue-next'
  
  // Props
  const props = defineProps({
    currentLocationPassengers: {
      type: Array,
      default: () => []
    }
  })
  
  // Emits
  const emit = defineEmits([
    'notify-passenger',
    'message-passenger', 
    'show-passenger-menu',
    'selection-changed',
    'view-route',
    'contact-passenger',
    'update-status',
    'export-data',
    'refresh-passengers',
    'change-location'
  ])
  
  // Reactive data
  const selectedPassengers = ref([])
  
  // Watch for selection changes
  watch(selectedPassengers, (newSelection) => {
    emit('selection-changed', newSelection)
  }, { deep: true })
  
  // Helper methods
  const getPassengerInitials = (passengerId) => {
    if (!passengerId) return 'N/A'
    const id = passengerId.toString()
    return id.slice(0, 2).toUpperCase()
  }
  
  const formatPassengerId = (passengerId) => {
    if (!passengerId) return 'Nil'
    return passengerId.slice(-6).toUpperCase()
  }
  
  const formatCoordinates = (coordinates) => {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) return 'Nil'
    return `${coordinates[1].toFixed(6)}, ${coordinates[0].toFixed(6)}`
  }
  
  const formatTimestamps = (timestamps) => {
    if (!timestamps || !Array.isArray(timestamps) || timestamps.length === 0) return 'None'
    return `${timestamps.length} entries`
  }
  
  const formatCurrency = (amount, currencySymbol) => {
    if (amount === undefined || amount === null) return 'Nil'
    const symbol = currencySymbol || 'NGN'
    
    try {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: symbol,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    } catch (error) {
      return `${symbol} ${new Intl.NumberFormat().format(amount)}`
    }
  }
  
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Nil'
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Nil'
    }
  }
  
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Nil'
    try {
      const now = new Date()
      const past = new Date(timestamp)
      const diffMs = now - past
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffDays > 0) return `${diffDays} days ago`
      if (diffHours > 0) return `${diffHours} hours ago`
      if (diffMins > 0) return `${diffMins} minutes ago`
      return 'Just now'
    } catch (error) {
      return 'Nil'
    }
  }
  
  const formatRate = (rate) => {
    if (!rate) return 'Nil'
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(rate)
  }
  
  const calculateDistance = (passenger) => {
    if (!passenger.origin?.geometry?.coordinates || !passenger.destination?.geometry?.coordinates) return 'Nil'
    
    const origin = passenger.origin.geometry.coordinates
    const destination = passenger.destination.geometry.coordinates
    
    // Haversine formula for great circle distance
    const R = 6371 // Earth's radius in kilometers
    const dLat = (destination[1] - origin[1]) * Math.PI / 180
    const dLon = (destination[0] - origin[0]) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin[1] * Math.PI / 180) * Math.cos(destination[1] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    return `${distance.toFixed(2)} km`
  }
  
  const calculateTravelTime = (passenger) => {
    if (!passenger.origin?.geometry?.coordinates || !passenger.destination?.geometry?.coordinates) return 'Nil'
    
    const distance = parseFloat(calculateDistance(passenger).replace(' km', ''))
    const avgSpeed = 30 // Average city speed in km/h
    const timeInHours = distance / avgSpeed
    const timeInMinutes = Math.round(timeInHours * 60)
    
    if (timeInMinutes < 60) return `${timeInMinutes} mins`
    const hours = Math.floor(timeInMinutes / 60)
    const mins = timeInMinutes % 60
    return `${hours}h ${mins}m`
  }
  
  const calculateTripDuration = (passenger) => {
    // Since we don't have actual trip duration, estimate based on distance
    return calculateTravelTime(passenger)
  }
  
  const getRouteType = (passenger) => {
    const distance = parseFloat(calculateDistance(passenger).replace(' km', ''))
    if (isNaN(distance)) return 'Nil'
    
    if (distance < 5) return 'Short'
    if (distance < 20) return 'Medium'
    return 'Long'
  }
  
  const getLocationZone = (location) => {
    if (!location?.properties?.address) return 'Nil'
    const address = location.properties.address
    
    if (address.includes('Lagos')) return 'Lagos'
    if (address.includes('Ejigbo')) return 'Ejigbo'
    return 'Urban'
  }
  
  const getAttributionSource = (attribution) => {
    if (!attribution) return 'Nil'
    if (attribution.includes('exchangerate-api.com')) return 'Exchange Rate API'
    return 'External Source'
  }
  
  const validateLocationData = (location) => {
    return location && 
           location.geometry && 
           location.geometry.coordinates && 
           Array.isArray(location.geometry.coordinates) && 
           location.geometry.coordinates.length === 2 &&
           location.properties &&
           location.properties.address
  }
  
  const validateFareData = (fare) => {
    return fare && 
           typeof fare.priceInUserCurrency === 'number' && 
           fare.currencySymbol && 
           fare.rate
  }
  
  const getStatusClass = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'confirmed': 'bg-green-100 text-green-800 border border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border border-red-200',
      'completed': 'bg-blue-100 text-blue-800 border border-blue-200',
      'in-progress': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'nil': 'bg-gray-100 text-gray-600 border border-gray-200'
    }
    return statusClasses[status?.toLowerCase()] || statusClasses['nil']
  }
  
  const getStatusDotClass = (status) => {
    const dotClasses = {
      'pending': 'bg-yellow-400',
      'confirmed': 'bg-green-400',
      'cancelled': 'bg-red-400',
      'completed': 'bg-blue-400',
      'in-progress': 'bg-indigo-400 animate-pulse',
      'nil': 'bg-gray-400'
    }
    return dotClasses[status?.toLowerCase()] || dotClasses['nil']
  }
  
  const getOnlineStatusClass = (status) => {
    const onlineClasses = {
      'pending': 'bg-yellow-400',
      'confirmed': 'bg-green-400',
      'in-progress': 'bg-green-400 animate-pulse',
      'nil': 'bg-gray-300'
    }
    return onlineClasses[status?.toLowerCase()] || onlineClasses['nil']
  }
  
  // Expose selectedPassengers for parent component access
  defineExpose({
    selectedPassengers
  })
  </script>