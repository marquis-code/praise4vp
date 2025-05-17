<template>
  <div class="min-h-screen animate-fadeIn">
    <ModulesTripsPageHeader 
      title="Trips" 
      description="Manage and monitor all ride trips"
    />
    
    <!-- Filters Section -->
    <div class="bg-white p-4 rounded-lg shadow mb-6 animate-fadeIn">
      <div class="flex flex-col md:flex-row justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2 md:mb-0">Filters</h3>
        <div class="flex space-x-2">
          <ModulesTripsExportButton @export="exportData" />
          <button 
            @click="resetFilters"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
          <select 
            v-model="filters.type"
            class="w-full rounded-md border-gray-300 border-[0.5px] p-3 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Types</option>
            <option value="local">Local</option>
            <option value="airport">Airport</option>
            <option value="intercity">Intercity</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            v-model="filters.status"
            class="w-full rounded-md border-gray-300 border-[0.5px] p-3 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Scheduling</label>
          <select 
            v-model="filters.scheduled"
            class="w-full rounded-md border-gray-300 border-[0.5px] p-3 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Trips</option>
            <option value="scheduled">Scheduled</option>
            <option value="immediate">Immediate</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <ModulesTripsDateRangePicker v-model:start-date="filters.startDate" v-model:end-date="filters.endDate" />
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ModulesTripsStatsCard 
        title="Total Trips" 
        :value="trips.length" 
        icon="car" 
        color="primary"
      />
      <ModulesTripsStatsCard 
        title="Completed" 
        :value="getCountByStatus('completed')" 
        icon="check-circle" 
        color="success"
      />
      <ModulesTripsStatsCard 
        title="Cancelled" 
        :value="getCountByStatus('cancelled')" 
        icon="x-circle" 
        color="danger"
      />
      <ModulesTripsStatsCard 
        title="Scheduled" 
        :value="scheduledTrips" 
        icon="calendar" 
        color="warning"
      />
    </div>

    <!-- Trips Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden transition-all duration-300">
      <!-- Table Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900 mb-2 md:mb-0">Trip History</h2>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search trips..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <IconSearch class="w-5 h-5" />
          </span>
        </div>
      </div>

      <!-- Mobile View -->
      <div class="md:hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p class="mt-2 text-gray-600">Loading trips...</p>
        </div>
        
        <div v-else-if="filteredTrips.length === 0" class="p-8 text-center">
          <IconInbox class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="trip in filteredTrips" 
            :key="trip._id"
            class="p-4 animate-fadeIn transition-all duration-300 hover:bg-gray-50"
            @click="navigateToTripDetails(trip._id)"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="getStatusClass(trip.status)"
                >
                  {{ trip.status }}
                </span>
                <span 
                  v-if="trip.isScheduled" 
                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  Scheduled
                </span>
              </div>
              <ModulesTripsActions :trip="trip" @action="handleTripAction" />
            </div>
            
            <div class="flex items-center mb-2">
              <IconUser class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm font-medium">{{ trip?.primaryUserId?.firstName }} {{ trip?.primaryUserId?.lastName }}</span>
            </div>
            
            <div class="flex items-center mb-2">
              <IconUserCheck class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm">{{ trip?.driverId?.firstName }} {{ trip?.driverId?.lastName }}</span>
            </div>
            
            <div class="flex items-center mb-2">
              <IconMapPin class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm truncate">{{ getOriginAddress(trip) }}</span>
            </div>
            
            <div class="flex items-center mb-2">
              <IconFlag class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-sm truncate">{{ getDestinationAddress(trip) }}</span>
            </div>
            
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center">
                <IconClock class="h-5 w-5 text-gray-400 mr-2" />
                <span class="text-xs text-gray-500">{{ formatDate(trip.createdAt) }}</span>
              </div>
              <div class="text-sm font-medium">
                {{ formatCurrency(getTotalFare(trip)) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop View -->
      <div class="hidden md:block overflow-x-auto">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p class="mt-2 text-gray-600">Loading trips...</p>
        </div>
        
        <div v-else-if="filteredTrips.length === 0" class="p-8 text-center">
          <IconInbox class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
        
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center">
                  {{ header.label }}
                  <button 
                    v-if="header.sortable" 
                    @click="sortBy(header.key)"
                    class="ml-1 focus:outline-none"
                  >
                    <IconChevronUp 
                      v-if="sortColumn === header.key && sortDirection === 'asc'"
                      class="h-4 w-4 text-gray-500" 
                    />
                    <IconChevronDown 
                      v-else-if="sortColumn === header.key && sortDirection === 'desc'"
                      class="h-4 w-4 text-gray-500" 
                    />
                    <IconChevronsUpDown 
                      v-else
                      class="h-4 w-4 text-gray-300" 
                    />
                  </button>
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="trip in filteredTrips" 
              :key="trip._id"
              class="hover:bg-gray-50 transition-colors duration-150 animate-fadeIn cursor-pointer"
              @click="navigateToTripDetails(trip._id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <IconUser class="h-6 w-6 text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ trip.primaryUserId.firstName }} {{ trip.primaryUserId.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ trip.primaryUserId.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ trip?.driverId?.firstName }} {{ trip?.driverId?.lastName }}</div>
                <div class="text-sm text-gray-500">{{ trip?.driverId?.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="getStatusClass(trip.status)">
                  {{ trip.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 capitalize">{{ trip.type }}</div>
                <div class="text-sm text-gray-500">
                  <span v-if="trip.isScheduled" class="inline-flex items-center text-xs">
                    <IconCalendar class="h-3 w-3 mr-1" />
                    {{ formatDate(trip.scheduledFor || trip.createdAt) }}
                  </span>
                  <span v-else class="text-xs">Immediate</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatCurrency(getTotalFare(trip)) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(trip.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                <ModulesTripsActions :trip="trip" @action="handleTripAction" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Export Modal -->
    <ModulesTripsExportModal 
      v-if="showExportModal" 
      :show="showExportModal"
      @close="showExportModal = false"
      @export="handleExport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetTrips } from "@/composables/modules/trips/useGetTrips"
const { loading, trips } =  useGetTrips()
import { useRouter } from 'vue-router'

// Types
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
}

interface GeoPoint {
  type: string
  geometry: {
    type: string
    coordinates: number[]
  }
  properties: {
    address: string
  }
}

interface Passenger {
  _id: string
  passengerId: User
  origin: GeoPoint
  destination: GeoPoint
  fare: number
  tax: number
  discount: number
  totalFare: number
  passengerStatus: string
  cancellationReason?: string
}

interface Trip {
  _id: string
  primaryUserId: User
  driverId: User
  type: string
  isScheduled: boolean
  scheduledFor: string | null
  status: string
  passengers: Passenger[]
  createdAt: string
  updatedAt: string
  isPrivate: boolean
}

const router = useRouter()

// State
// const loading = ref(true)
// const trips = ref<Trip[]>([])
const searchQuery = ref('')
const filters = ref({
  type: '',
  status: '',
  scheduled: '',
  startDate: null as Date | null,
  endDate: null as Date | null
})
const sortColumn = ref('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')
const showExportModal = ref(false)

// Table headers
const tableHeaders = [
  { key: 'primaryUserId', label: 'Passenger', sortable: false },
  { key: 'driverId', label: 'Driver', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'fare', label: 'Fare', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true }
]

// Computed properties
const filteredTrips = computed(() => {
  let result = [...trips.value]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(trip => 
      trip?.primaryUserId?.firstName.toLowerCase().includes(query) ||
      trip?.primaryUserId?.lastName.toLowerCase().includes(query) ||
      trip?.primaryUserId?.email.toLowerCase().includes(query) ||
      trip?.driverId?.firstName.toLowerCase().includes(query) ||
      trip?.driverId?.lastName.toLowerCase().includes(query) ||
      trip?.status?.toLowerCase().includes(query)
    )
  }
  
  // Apply filters
  if (filters.value.type) {
    result = result.filter(trip => trip.type === filters.value.type)
  }
  
  if (filters.value.status) {
    result = result.filter(trip => trip.status === filters.value.status)
  }
  
  if (filters.value.scheduled) {
    const isScheduled = filters.value.scheduled === 'scheduled'
    result = result.filter(trip => trip.isScheduled === isScheduled)
  }
  
  // Apply date range filter
  if (filters.value.startDate && filters.value.endDate) {
    const startDate = new Date(filters.value.startDate)
    const endDate = new Date(filters.value.endDate)
    endDate.setHours(23, 59, 59, 999) // Set to end of day
    
    result = result.filter(trip => {
      const tripDate = new Date(trip.createdAt)
      return tripDate >= startDate && tripDate <= endDate
    })
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let valueA, valueB
    
    if (sortColumn.value === 'fare') {
      valueA = getTotalFare(a)
      valueB = getTotalFare(b)
    } else if (sortColumn.value === 'createdAt' || sortColumn.value === 'updatedAt') {
      valueA = new Date(a[sortColumn.value]).getTime()
      valueB = new Date(b[sortColumn.value]).getTime()
    } else if (sortColumn.value === 'primaryUserId') {
      valueA = a.primaryUserId.firstName + ' ' + a.primaryUserId.lastName
      valueB = b.primaryUserId.firstName + ' ' + b.primaryUserId.lastName
    } else if (sortColumn.value === 'driverId') {
      valueA = a.driverId.firstName + ' ' + a.driverId.lastName
      valueB = b.driverId.firstName + ' ' + b.driverId.lastName
    } else {
      valueA = a[sortColumn.value]
      valueB = b[sortColumn.value]
    }
    
    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
  
  return result
})

const scheduledTrips = computed(() => {
  return trips.value.filter(trip => trip.isScheduled).length
})

// Methods
// const fetchTrips = async () => {
//   loading.value = true
//   try {
//     // In a real app, this would be an API call
//     // For now, we'll use the sample data
//     trips.value = [
//       {
//         "_id": "6821e383e94709ed7eeebeb7",
//         "primaryUserId": {
//           "_id": "66ed3ca5a3291a0db25f5a1f",
//           "firstName": "Alfred",
//           "lastName": "Onuada",
//           "email": "aonuada5@gmail.com"
//         },
//         "driverId": {
//           "_id": "66ed3deaa0eaa9a24d61085a",
//           "firstName": "Lisa",
//           "lastName": "Wong",
//           "email": "Lisa.Wong@email.com"
//         },
//         "type": "local",
//         "isScheduled": false,
//         "scheduledFor": null,
//         "status": "cancelled",
//         "passengers": [
//           {
//             "origin": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   7.0138649,
//                   4.8358303
//                 ]
//               },
//               "properties": {
//                 "address": "RIVERS STATE ICT DEPARTMENT, Port Harcourt - Aba Expressway, Port Harcourt, Nigeria"
//               }
//             },
//             "destination": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   7.0026117,
//                   4.7901615
//                 ]
//               },
//               "properties": {
//                 "address": "Nigeria Immigration Service Passport Office Mile 1, Port Harcourt, Nigeria"
//               }
//             },
//             "_id": "6827a9aef819e09e52138228",
//             "passengerId": {
//               "_id": "66ed3ca5a3291a0db25f5a1f",
//               "firstName": "Alfred",
//               "lastName": "Onuada",
//               "email": "aonuada5@gmail.com"
//             },
//             "fare": 80256,
//             "tax": 0,
//             "discount": 0,
//             "totalFare": 80256,
//             "passengerStatus": "cancelled",
//             "cancellationReason": "This guy is a joker"
//           }
//         ],
//         "createdAt": "2025-05-12T12:03:15.836Z",
//         "updatedAt": "2025-05-12T12:06:31.418Z",
//         "isPrivate": true
//       },
//       // Add more sample trips for demonstration
//       {
//         "_id": "6821e383e94709ed7eeebeb8",
//         "primaryUserId": {
//           "_id": "66ed3ca5a3291a0db25f5a1f",
//           "firstName": "John",
//           "lastName": "Doe",
//           "email": "john.doe@example.com"
//         },
//         "driverId": {
//           "_id": "66ed3deaa0eaa9a24d61085b",
//           "firstName": "Michael",
//           "lastName": "Johnson",
//           "email": "michael.johnson@example.com"
//         },
//         "type": "airport",
//         "isScheduled": true,
//         "scheduledFor": "2025-05-15T08:30:00.000Z",
//         "status": "pending",
//         "passengers": [
//           {
//             "origin": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   7.0138649,
//                   4.8358303
//                 ]
//               },
//               "properties": {
//                 "address": "Downtown Hotel, Main Street, Port Harcourt, Nigeria"
//               }
//             },
//             "destination": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   7.0026117,
//                   4.7901615
//                 ]
//               },
//               "properties": {
//                 "address": "Port Harcourt International Airport, Nigeria"
//               }
//             },
//             "_id": "6827a9aef819e09e52138229",
//             "passengerId": {
//               "_id": "66ed3ca5a3291a0db25f5a1f",
//               "firstName": "John",
//               "lastName": "Doe",
//               "email": "john.doe@example.com"
//             },
//             "fare": 95000,
//             "tax": 5000,
//             "discount": 0,
//             "totalFare": 100000,
//             "passengerStatus": "pending"
//           }
//         ],
//         "createdAt": "2025-05-13T09:15:22.836Z",
//         "updatedAt": "2025-05-13T09:15:22.836Z",
//         "isPrivate": false
//       },
//       {
//         "_id": "6821e383e94709ed7eeebeb9",
//         "primaryUserId": {
//           "_id": "66ed3ca5a3291a0db25f5a1f",
//           "firstName": "Sarah",
//           "lastName": "Williams",
//           "email": "sarah.williams@example.com"
//         },
//         "driverId": {
//           "_id": "66ed3deaa0eaa9a24d61085c",
//           "firstName": "David",
//           "lastName": "Brown",
//           "email": "david.brown@example.com"
//         },
//         "type": "intercity",
//         "isScheduled": false,
//         "scheduledFor": null,
//         "status": "completed",
//         "passengers": [
//           {
//             "origin": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   7.0138649,
//                   4.8358303
//                 ]
//               },
//               "properties": {
//                 "address": "Port Harcourt City Center, Nigeria"
//               }
//             },
//             "destination": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   7.0026117,
//                   4.7901615
//                 ]
//               },
//               "properties": {
//                 "address": "Aba City Center, Nigeria"
//               }
//             },
//             "_id": "6827a9aef819e09e52138230",
//             "passengerId": {
//               "_id": "66ed3ca5a3291a0db25f5a1f",
//               "firstName": "Sarah",
//               "lastName": "Williams",
//               "email": "sarah.williams@example.com"
//             },
//             "fare": 150000,
//             "tax": 7500,
//             "discount": 10000,
//             "totalFare": 147500,
//             "passengerStatus": "completed"
//           }
//         ],
//         "createdAt": "2025-05-10T14:22:45.836Z",
//         "updatedAt": "2025-05-10T16:05:12.418Z",
//         "isPrivate": false
//       },
//       {
//         "_id": "LANA1234",
//         "primaryUserId": {
//           "_id": "66ed3ca5a3291a0db25f5a1f",
//           "firstName": "Opeyei",
//           "lastName": "Asiwju",
//           "email": "opeyei.asiwju@example.com"
//         },
//         "driverId": {
//           "_id": "66ed3deaa0eaa9a24d61085d",
//           "firstName": "Opeyei",
//           "lastName": "Asiwju",
//           "email": "opeyei.asiwju@example.com"
//         },
//         "type": "local",
//         "isScheduled": false,
//         "scheduledFor": null,
//         "status": "active",
//         "passengers": [
//           {
//             "origin": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   3.3792,
//                   6.5244
//                 ]
//               },
//               "properties": {
//                 "address": "Lekki Phase 1, Lekki, Nigeria"
//               }
//             },
//             "destination": {
//               "type": "Feature",
//               "geometry": {
//                 "type": "Point",
//                 "coordinates": [
//                   3.3886,
//                   6.4281
//                 ]
//               },
//               "properties": {
//                 "address": "Raji Rasaki Estate Road, Lagos, Nigeria"
//               }
//             },
//             "_id": "6827a9aef819e09e52138231",
//             "passengerId": {
//               "_id": "66ed3ca5a3291a0db25f5a1f",
//               "firstName": "Opeyei",
//               "lastName": "Asiwju",
//               "email": "opeyei.asiwju@example.com"
//             },
//             "fare": 120000,
//             "tax": 6000,
//             "discount": 0,
//             "totalFare": 126000,
//             "passengerStatus": "active"
//           }
//         ],
//         "createdAt": "2025-05-16T18:01:00.000Z",
//         "updatedAt": "2025-05-16T18:01:00.000Z",
//         "isPrivate": false
//       }
//     ]
//   } catch (error) {
//     console.error('Error fetching trips:', error)
//   } finally {
//     loading.value = false
//   }
// }

const getCountByStatus = (status: string) => {
  return trips.value.filter(trip => trip.status === status).length
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'active': 'bg-green-100 text-green-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getOriginAddress = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers[0].origin.properties.address
  }
  return 'N/A'
}

const getDestinationAddress = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers[0].destination.properties.address
  }
  return 'N/A'
}

const getTotalFare = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers.reduce((total, passenger) => total + passenger.totalFare, 0)
  }
  return 0
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffInDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const resetFilters = () => {
  filters.value = {
    type: '',
    status: '',
    scheduled: '',
    startDate: null,
    endDate: null
  }
  searchQuery.value = ''
}

const handleTripAction = (action: string, trip: Trip) => {
  console.log(`Action ${action} for trip ${trip._id}`)
  
  // In a real app, these would make API calls
  switch (action) {
    case 'view':
      navigateToTripDetails(trip._id)
      break
    case 'edit':
      // Open edit modal
      break
    case 'cancel':
      // Cancel trip
      break
    case 'reschedule':
      // Open reschedule modal
      break
    case 'invoice':
      // Generate and download invoice
      break
  }
}

const navigateToTripDetails = (tripId: string) => {
  router.push(`/dashboard/trips/${tripId}`)
}

const exportData = () => {
  showExportModal.value = true
}

const handleExport = (format: string, options: any) => {
  console.log(`Exporting data in ${format} format with options:`, options)
  
  if (format === 'csv') {
    exportToCSV(options.columns)
  } else if (format === 'pdf') {
    exportToPDF(options.columns)
  }
  
  showExportModal.value = false
}

const exportToCSV = (selectedColumns: string[]) => {
  // Get the data to export
  const data = filteredTrips.value.map(trip => {
    const row: Record<string, any> = {}
    
    if (selectedColumns.includes('passenger')) {
      row['Passenger'] = `${trip?.primaryUserId?.firstName} ${trip?.primaryUserId?.lastName}`
      row['Passenger Email'] = trip.primaryUserId.email
    }
    
    if (selectedColumns.includes('driver')) {
      row['Driver'] = `${trip?.driverId?.firstName} ${trip?.driverId?.lastName}`
      row['Driver Email'] = trip.driverId.email
    }
    
    if (selectedColumns.includes('status')) {
      row['Status'] = trip?.status
    }
    
    if (selectedColumns.includes('type')) {
      row['Type'] = trip.type
      row['Scheduled'] = trip?.isScheduled ? 'Yes' : 'No'
    }
    
    if (selectedColumns.includes('fare')) {
      row['Fare'] = getTotalFare(trip)
    }
    
    if (selectedColumns.includes('date')) {
      row['Date'] = new Date(trip?.createdAt).toLocaleString()
    }
    
    if (selectedColumns.includes('origin')) {
      row['Origin'] = getOriginAddress(trip)
    }
    
    if (selectedColumns.includes('destination')) {
      row['Destination'] = getDestinationAddress(trip)
    }
    
    return row
  })
  
  // Convert to CSV
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')
  
  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `trips_export_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const exportToPDF = (selectedColumns: string[]) => {
  // In a real app, you would use a library like jsPDF or pdfmake
  // For this example, we'll just log a message
  console.log('PDF export would be implemented with a PDF generation library')
  alert('PDF export functionality would be implemented with a PDF generation library')
}

// Lifecycle hooks
// onMounted(() => {
//   fetchTrips()
// })

import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'dashboard'
})
</script>