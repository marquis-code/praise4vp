<template>
  <div class="min-h-screen text-sm">
    <!-- Header -->
    <div class="border-b">
      <div class="">
        <div class="flex justify-between items-center pb-6">
          <div>
            <h1 class="text-xl font-bold text-gray-900">Trip Offers</h1>
            <p class="text-gray-600 text-sm mt-1">Manage and monitor all trip offers</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="exportToCSV"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                v-for="view in viewModes"
                :key="view.mode"
                @click="currentView = view.mode"
                :class="[
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  currentView === view.mode
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                <component :is="view.icon" class="w-4 h-4 mr-2" />
                {{ view.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="">
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by driver name or email..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <!-- Status Filter -->
          <select
            v-model="filters.accepted"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="true">Accepted</option>
            <option value="false">Pending</option>
          </select>

          <!-- Privacy Filter -->
          <select
            v-model="filters.isPrivate"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>

          <!-- Currency Filter -->
          <select
            v-model="filters.currency"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Currencies</option>
            <option v-for="currency in uniqueCurrencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-primary hover:text-primary font-medium"
        >
          Clear all filters
        </button>
      </div>

      <!-- Results Summary -->
      <div class="flex justify-between items-center mb-6">
        <p class="text-gray-600">
          Showing {{ filteredOffers?.length }} of {{ tripOffers?.length }} offers
        </p>
        <div class="text-sm text-gray-500">
          Total Value: {{ totalValue?.toLocaleString() }} CAD
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOffers?.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No trip offers found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || hasActiveFilters ? 'Try adjusting your search or filters' : 'No trip offers available at the moment' }}
        </p>
      </div>

      <!-- Table View -->
      <div v-else-if="currentView === 'table'" class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="offer in filteredOffers" :key="offer._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-medium">
                      {{ offer.driverId.firstName[0] }}{{ offer.driverId.lastName[0] }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ offer.driverId.firstName }} {{ offer.driverId.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ offer.driverId.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ offer.fare.priceInCAD }} CAD</div>
                  <div class="text-sm text-gray-500">
                    {{ offer.fare.priceInUserCurrency.toLocaleString() }} {{ offer.fare.currencySymbol }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    offer.accepted
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ offer.accepted ? 'Accepted' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs text-white font-medium rounded-full',
                    offer.isPrivate
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-primary text-primary'
                  ]">
                    {{ offer.isPrivate ? 'Private' : 'Public' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(offer.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewDetails(offer)"
                    class="text-primary hover:text-primary font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="currentView === 'list'" class="space-y-4">
        <div
          v-for="offer in filteredOffers"
          :key="offer._id"
          class="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-medium">
                {{ offer.driverId.firstName[0] }}{{ offer.driverId.lastName[0] }}
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ offer.driverId.firstName }} {{ offer.driverId.lastName }}
                </h3>
                <p class="text-gray-600">{{ offer.driverId.email }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">${{ offer.fare.priceInCAD }} CAD</div>
                <div class="text-sm text-gray-500">
                  {{ offer.fare.priceInUserCurrency.toLocaleString() }} {{ offer.fare.currencySymbol }}
                </div>
              </div>
              <div class="flex flex-col space-y-2">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  offer.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ offer.accepted ? 'Accepted' : 'Pending' }}
                </span>
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  offer.isPrivate ? 'bg-purple-100 text-purple-800' : 'bg-primary text-primary'
                ]">
                  {{ offer.isPrivate ? 'Private' : 'Public' }}
                </span>
              </div>
              <button
                @click="viewDetails(offer)"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            Created: {{ formatDate(offer.createdAt) }}
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="currentView === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="offer in filteredOffers"
          :key="offer._id"
          class="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-medium">
              {{ offer.driverId.firstName[0] }}{{ offer.driverId.lastName[0] }}
            </div>
            <div class="flex space-x-2">
              <span :class="[
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                offer.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ offer.accepted ? 'Accepted' : 'Pending' }}
              </span>
              <span :class="[
                'inline-flex px-2 py-1 text-xs text-white font-medium rounded-full',
                offer.isPrivate ? 'bg-purple-100 text-purple-800' : 'bg-primary text-primary'
              ]">
                {{ offer.isPrivate ? 'Private' : 'Public' }}
              </span>
            </div>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-1">
            {{ offer.driverId.firstName }} {{ offer.driverId.lastName }}
          </h3>
          <p class="text-gray-600 mb-4">{{ offer.driverId.email }}</p>
          
          <div class="mb-4">
            <div class="text-xl font-bold text-gray-900">${{ offer.fare.priceInCAD }} CAD</div>
            <div class="text-sm text-gray-500">
              {{ offer.fare.priceInUserCurrency.toLocaleString() }} {{ offer.fare.currencySymbol }}
            </div>
          </div>
          
          <div class="text-sm text-gray-500 mb-4">
            Created: {{ formatDate(offer.createdAt) }}
          </div>
          
          <button
            @click="viewDetails(offer)"
            class="w-full px-4 py-2.5 bg-primary text-sm text-white rounded-lg hover:bg-primary transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedOffer" class="fixed inset-0 text-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-900">Trip Offer Details</h2>
            <button
              @click="selectedOffer = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Driver Information -->
          <div>
            <h3 class="text-base font-medium text-gray-900 mb-3">Driver Information</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-4 mb-4">
                <div class="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-medium text-xl">
                  {{ selectedOffer.driverId.firstName[0] }}{{ selectedOffer.driverId.lastName[0] }}
                </div>
                <div>
                  <h4 class="text-xl font-medium text-gray-900">
                    {{ selectedOffer.driverId.firstName }} {{ selectedOffer.driverId.lastName }}
                  </h4>
                  <p class="text-gray-600">{{ selectedOffer.driverId.email }}</p>
                  <p class="text-sm text-gray-500">ID: {{ selectedOffer.driverId._id }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Fare Details -->
          <div>
            <h3 class="text-base font-medium text-gray-900 mb-3">Fare Details</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Price (CAD)</p>
                  <p class="text-lg font-medium text-gray-900">${{ selectedOffer.fare.priceInCAD }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Price ({{ selectedOffer.fare.currencyName }})</p>
                  <p class="text-lg font-medium text-gray-900">
                    {{ selectedOffer.fare.priceInUserCurrency.toLocaleString() }} {{ selectedOffer.fare.currencySymbol }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Exchange Rate</p>
                  <p class="text-lg font-medium text-gray-900">{{ selectedOffer.fare.rate.toFixed(6) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Rate Timestamp</p>
                  <p class="text-sm text-gray-900">{{ formatDate(selectedOffer.fare.rateTimestamp) }}</p>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t">
                <p class="text-xs text-gray-500">
                  Exchange rate data from: {{ selectedOffer.fare.attribution }}
                </p>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div>
            <h3 class="text-base font-medium text-gray-900 mb-3">Location Information</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Longitude</p>
                  <p class="text-lg font-medium text-gray-900">{{ selectedOffer.driverCurrentLocation.geometry.coordinates[0] }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Latitude</p>
                  <p class="text-lg font-medium text-gray-900">{{ selectedOffer.driverCurrentLocation.geometry.coordinates[1] }}</p>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-sm text-gray-500">Address</p>
                <p class="text-lg font-medium text-gray-900">
                  {{ selectedOffer.driverCurrentLocation.properties.address || 'Not specified' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Trip Details -->
          <div>
            <h3 class="text-base font-medium text-gray-900 mb-3">Trip Details</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Trip ID</p>
                  <p class="text-lg font-medium text-gray-900">{{ selectedOffer.tripId }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Offer ID</p>
                  <p class="text-lg font-medium text-gray-900">{{ selectedOffer._id }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    selectedOffer.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ selectedOffer.accepted ? 'Accepted' : 'Pending' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Type</p>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs text-white font-medium rounded-full',
                    selectedOffer.isPrivate ? 'bg-purple-100 text-purple-800' : 'bg-primary text-primary'
                  ]">
                    {{ selectedOffer.isPrivate ? 'Private' : 'Public' }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Proposed Pickup Time</p>
                  <p class="text-lg font-medium text-gray-900">
                    {{ selectedOffer.proposedPickupTime ? formatDate(selectedOffer.proposedPickupTime) : 'Not specified' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Created At</p>
                  <p class="text-lg font-medium text-gray-900">{{ formatDate(selectedOffer.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <CorePagination 
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Search, Download, Plus, UserX, ChevronLeft, ChevronRight,
  MoreVertical, Eye, Edit, Ban, User, Star, CheckCircle,
  Grid, List, AlertTriangle, X
} from 'lucide-vue-next';
import { useGetTripOffers } from "@/composables/modules/trips/useFetchTripOffers"
const { tripOffersList: tripOffers, loading, pagination, changePage } = useGetTripOffers()

// Types
interface Driver {
  _id: string
  firstName: string
  lastName: string
  email: string
}

interface Fare {
  priceInCAD: number
  priceInUserCurrency: number
  rate: number
  rateTimestamp: string
  currencySymbol: string
  currencyName: string
  attribution: string
}

interface Location {
  type: string
  geometry: {
    type: string
    coordinates: [number, number]
  }
  properties: {
    address: string
    timeStamps: any[]
  }
}

interface TripOffer {
  _id: string
  tripId: string
  driverId: Driver
  fare: Fare
  driverCurrentLocation: Location
  proposedPickupTime: string | null
  isPrivate: boolean
  accepted: boolean
  createdAt: string
  updatedAt: string
}

// Reactive data
// const loading = ref(true)
// const tripOffers = ref<TripOffer[]>([])
const selectedOffer = ref<TripOffer | null>(null)
const currentView = ref<'table' | 'list' | 'grid'>('table')
const searchQuery = ref('')

const filters = ref({
  accepted: '',
  isPrivate: '',
  currency: ''
})

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}


// View modes configuration
const viewModes = [
  { mode: 'table', label: 'Table', icon: List },
  // { mode: 'list', label: 'List', icon: 'svg' },
  { mode: 'grid', label: 'Grid', icon: Grid }
]

// Mock data - replace with actual API call
// const mockData: TripOffer[] = [
//   {
//     "_id": "685c841620f1708a7a890f18",
//     "tripId": "685c840d20f1708a7a890f16",
//     "driverId": {
//       "_id": "66ed3deaa0eaa9a24d61085a",
//       "firstName": "Lisa",
//       "lastName": "Wong",
//       "email": "Lisa.Wong@email.com"
//     },
//     "fare": {
//       "priceInCAD": 903,
//       "priceInUserCurrency": 1017400,
//       "rate": 1125.442757,
//       "rateTimestamp": "2025-06-25T00:02:31.000Z",
//       "currencySymbol": "NGN",
//       "currencyName": "NGN",
//       "attribution": "https://www.exchangerate-api.com"
//     },
//     "driverCurrentLocation": {
//       "type": "Feature",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [3.29197, 6.54745]
//       },
//       "properties": {
//         "address": "Lagos, Nigeria",
//         "timeStamps": []
//       }
//     },
//     "proposedPickupTime": null,
//     "isPrivate": true,
//     "accepted": true,
//     "createdAt": "2025-06-25T23:19:50.240Z",
//     "updatedAt": "2025-06-25T23:20:02.400Z"
//   },
//   {
//     "_id": "685c841620f1708a7a890f19",
//     "tripId": "685c840d20f1708a7a890f17",
//     "driverId": {
//       "_id": "66ed3deaa0eaa9a24d61085b",
//       "firstName": "John",
//       "lastName": "Smith",
//       "email": "john.smith@email.com"
//     },
//     "fare": {
//       "priceInCAD": 1250,
//       "priceInUserCurrency": 950,
//       "rate": 0.76,
//       "rateTimestamp": "2025-06-25T00:02:31.000Z",
//       "currencySymbol": "USD",
//       "currencyName": "USD",
//       "attribution": "https://www.exchangerate-api.com"
//     },
//     "driverCurrentLocation": {
//       "type": "Feature",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [-79.3832, 43.6532]
//       },
//       "properties": {
//         "address": "Toronto, ON, Canada",
//         "timeStamps": []
//       }
//     },
//     "proposedPickupTime": "2025-06-26T10:00:00.000Z",
//     "isPrivate": false,
//     "accepted": false,
//     "createdAt": "2025-06-25T22:15:30.240Z",
//     "updatedAt": "2025-06-25T22:15:30.240Z"
//   },
//   {
//     "_id": "685c841620f1708a7a890f20",
//     "tripId": "685c840d20f1708a7a890f18",
//     "driverId": {
//       "_id": "66ed3deaa0eaa9a24d61085c",
//       "firstName": "Maria",
//       "lastName": "Garcia",
//       "email": "maria.garcia@email.com"
//     },
//     "fare": {
//       "priceInCAD": 675,
//       "priceInUserCurrency": 13500,
//       "rate": 20.0,
//       "rateTimestamp": "2025-06-25T00:02:31.000Z",
//       "currencySymbol": "MXN",
//       "currencyName": "MXN",
//       "attribution": "https://www.exchangerate-api.com"
//     },
//     "driverCurrentLocation": {
//       "type": "Feature",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [-99.1332, 19.4326]
//       },
//       "properties": {
//         "address": "Mexico City, Mexico",
//         "timeStamps": []
//       }
//     },
//     "proposedPickupTime": "2025-06-26T14:30:00.000Z",
//     "isPrivate": true,
//     "accepted": true,
//     "createdAt": "2025-06-25T21:45:15.240Z",
//     "updatedAt": "2025-06-25T21:50:22.400Z"
//   }
// ]

// Computed properties
const filteredOffers = computed(() => {
  let filtered = tripOffers.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(offer =>
      offer.driverId.firstName.toLowerCase().includes(query) ||
      offer.driverId.lastName.toLowerCase().includes(query) ||
      offer.driverId.email.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filters.value.accepted !== '') {
    filtered = filtered.filter(offer => 
      offer.accepted.toString() === filters.value.accepted
    )
  }

  // Privacy filter
  if (filters.value.isPrivate !== '') {
    filtered = filtered.filter(offer => 
      offer.isPrivate.toString() === filters.value.isPrivate
    )
  }

  // Currency filter
  if (filters.value.currency) {
    filtered = filtered.filter(offer => 
      offer.fare.currencySymbol === filters.value.currency
    )
  }

  return filtered
})

const uniqueCurrencies = computed(() => {
  const currencies = tripOffers && tripOffers?.value?.map(offer => offer.fare.currencySymbol)
  return [...new Set(currencies)].sort()
})

const hasActiveFilters = computed(() => {
  return filters.value.accepted !== '' || 
         filters.value.isPrivate !== '' || 
         filters.value.currency !== '' ||
         searchQuery.value !== ''
})

const totalValue = computed(() => {
  return filteredOffers?.value?.reduce((sum, offer) => sum + offer.fare.priceInCAD, 0)
})


const viewDetails = (offer: TripOffer) => {
  selectedOffer.value = offer
}

const clearFilters = () => {
  filters.value = {
    accepted: '',
    isPrivate: '',
    currency: ''
  }
  searchQuery.value = ''
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const exportToCSV = () => {
  const headers = [
    'Offer ID',
    'Trip ID',
    'Driver Name',
    'Driver Email',
    'Price CAD',
    'Price Local',
    'Currency',
    'Exchange Rate',
    'Status',
    'Type',
    'Location',
    'Created At'
  ]

  const csvData = filteredOffers.value.map(offer => [
    offer._id,
    offer.tripId,
    `${offer.driverId.firstName} ${offer.driverId.lastName}`,
    offer.driverId.email,
    offer.fare.priceInCAD,
    offer.fare.priceInUserCurrency,
    offer.fare.currencySymbol,
    offer.fare.rate,
    offer.accepted ? 'Accepted' : 'Pending',
    offer.isPrivate ? 'Private' : 'Public',
    `${offer.driverCurrentLocation.geometry.coordinates[1]}, ${offer.driverCurrentLocation.geometry.coordinates[0]}`,
    formatDate(offer.createdAt)
  ])

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `trip-offers-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

definePageMeta({
    layout: 'dashboard'
})

</script>

<style scoped>
/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>