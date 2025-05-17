<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    
    <!-- Stats cards -->
    <div v-if="loading" class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Pulse loading skeletons for stats -->
      <div v-for="i in 4" :key="i" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0 animate-pulse">
              <div class="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></dt>
                <dd>
                  <div class="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
    <div v-else-if="!dashboardStats || Object.keys(dashboardStats || {}).length === 0" class="mt-6 bg-white p-6 rounded-lg shadow text-center">
      <p class="text-gray-500">No dashboard statistics available</p>
    </div>
    <div v-else class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(value, key) in dashboardStats" :key="key" class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <!-- {{key}} -->
              <svg v-if="key === 'totalDrivers'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-if="key === 'totalPassengers'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <svg v-if="key === 'totalRides'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <svg v-if="key === 'totalDeliveries'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <svg v-if="key === 'todayRides'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <!-- <component :is="getStatIcon(key)" class="h-10 w-10 p-2 rounded-full bg-primary-light text-primary" /> -->
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">{{ formatKey(key) }}</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ value }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <button @click="handleSelected(key)" class="font-medium text-primary hover:text-primary-dark">
              View all
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts section -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent activity -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <div v-if="loading" class="space-y-4">
            <!-- Pulse loading skeletons for activities -->
            <div v-for="i in 3" :key="i" class="flex space-x-3 animate-pulse">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-200"></div>
              </div>
              <div class="min-w-0 flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                <div class="h-2 bg-gray-200 rounded w-1/4 mt-2"></div>
              </div>
            </div>
          </div>
          <div v-else-if="!recentActivities || recentActivities.length === 0" class="py-8 text-center">
            <p class="text-gray-500">No recent activities</p>
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="(activity, index) in recentActivities" :key="index" class="py-4">
              <div class="flex space-x-3">
                <div class="flex-shrink-0">
                  <span 
                    class="inline-flex items-center justify-center h-10 w-10 rounded-full"
                    :class="getActivityIconClass(activity.type)"
                  >
                    <component :is="getActivityIcon(activity.type)" class="h-5 w-5" />
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-500">{{ activity.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Upcoming rides -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Upcoming Rides</h3>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <div v-if="fetchingTrips" class="space-y-4">
            <!-- Pulse loading skeletons for trips -->
            <div v-for="i in 3" :key="i" class="flex items-center space-x-4 animate-pulse">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-200"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div class="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div>
                <div class="h-5 w-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
          <div v-else-if="!upcomingTrips || upcomingTrips.length === 0" class="py-8 text-center">
            <p class="text-gray-500">No upcoming rides scheduled</p>
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="trip in upcomingTrips" :key="trip._id" class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img 
                    :src="trip.driverId?.firstName ? `/placeholder.svg?height=40&width=40` : '/placeholder.svg?height=40&width=40'" 
                    alt="Driver avatar" 
                    class="h-10 w-10 rounded-full"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ trip.driverId?.firstName || 'Unknown' }} {{ trip.driverId?.lastName || '' }} → {{ (trip.passengers && trip.passengers.length) || 0 }} passenger(s)
                  </p>
                  <p class="text-sm text-gray-500 truncate" v-if="trip.passengers && trip.passengers.length > 0">
                    {{ trip.passengers[0].origin?.properties?.address || 'Unknown' }} to {{ trip.passengers[0].destination?.properties?.address || 'Unknown' }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(trip.scheduledFor) }}</p>
                </div>
                <div>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': trip.status === 'active',
                      'bg-yellow-100 text-yellow-800': trip.status === 'pending',
                      'bg-red-100 text-red-800': trip.status === 'cancelled'
                    }"
                  >
                    {{ trip.status }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDashboardStats } from "@/composables/modules/dashboard/useDashboardStats"
import { useGetTrips } from "@/composables/modules/trips/useGetTrips"
import { Router } from 'lucide-vue-next'

const router = useRouter()

// Initialize with default empty values to prevent null/undefined errors
const { loading, dashboardStats = ref({}) } = useDashboardStats()
const { loading: fetchingTrips, trips = ref([]) } = useGetTrips()

// Format camelCase keys to readable format
const formatKey = (key: string): string => {
  if (!key) return ''
  
  // Convert camelCase to space-separated words and capitalize first letter
  return key
    .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
    .trim() // Remove any leading/trailing spaces
}

// Format date for display
const formatDate = (date: string | null): string => {
  if (!date) return 'Not scheduled'
  
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

// Filter trips to get only scheduled trips
const upcomingTrips = computed(() => {
  if (!trips.value) return []
  return trips.value.filter(trip => trip && trip?.isScheduled === true)
})

// Mock data for recent activities
const recentActivities = ref([
  {
    type: 'driver',
    title: 'New Driver Registration',
    description: 'John Doe has registered as a new driver',
    time: '10 minutes ago'
  },
  {
    type: 'passenger',
    title: 'New Passenger',
    description: 'Jane Smith has created a passenger account',
    time: '25 minutes ago'
  },
  {
    type: 'ride',
    title: 'Ride Completed',
    description: 'Ride #12345 has been completed successfully',
    time: '1 hour ago'
  },
  {
    type: 'package',
    title: 'Package Delivered',
    description: 'Package #54321 has been delivered to the recipient',
    time: '2 hours ago'
  },
  {
    type: 'complaint',
    title: 'New Complaint',
    description: 'A passenger has reported an issue with their ride',
    time: '3 hours ago'
  }
])

// Helper functions for activity icons
const getActivityIcon = (type: string) => {
  if (!type) return 'svg-icon-default'
  
  const icons: Record<string, string> = {
    driver: 'svg-icon-driver',
    passenger: 'svg-icon-passenger',
    ride: 'svg-icon-ride',
    package: 'svg-icon-package',
    complaint: 'svg-icon-complaint'
  }
  
  return icons[type] || 'svg-icon-default'
}

const getActivityIconClass = (type: string) => {
  if (!type) return 'bg-gray-100 text-gray-600'
  
  const classes: Record<string, string> = {
    driver: 'bg-primary-light text-white',
    passenger: 'bg-blue-100 text-blue-600',
    ride: 'bg-green-100 text-green-600',
    package: 'bg-purple-100 text-purple-600',
    complaint: 'bg-red-100 text-red-600'
  }
  
  return classes[type] || 'bg-gray-100 text-gray-600'
}

// Define page meta for Nuxt
if (typeof definePageMeta === 'function') {
  definePageMeta({
    layout: 'dashboard'
  })
}

const handleSelected = (key: string) => {
  if(key === 'totalDrivers'){
    router.push('/dashboard/drivers')
  }
  if(key === 'totalPassengers'){
    router.push('/dashboard/passengers')
  }
  if(key === 'totalRides'){
    router.push('/dashboard/trips')
  }
  if(key === 'todayRides'){
    router.push('/dashboard/trips')
  }

  if(key === 'totalDeliveries'){
    router.push('/dashboard/package-delivery')
  }
}
</script>
