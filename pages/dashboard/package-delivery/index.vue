<template>
  <div class="min-h-screen animate-fadeIn">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Delivery Management</h1>
        <p class="text-gray-600">Manage and monitor all package deliveries</p>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 animate-fadeIn">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <IconPackage class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Deliveries</p>
            <p class="text-2xl font-semibold text-gray-900">{{ pagination.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <IconCheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Delivered</p>
            <p class="text-2xl font-semibold text-gray-900">{{ getCountByStatus('delivered') }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <IconClock class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">In Transit</p>
            <p class="text-2xl font-semibold text-gray-900">{{ inTransitCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <IconDollarSign class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Revenue (NGN)</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalRevenueNGN }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-indigo-100 rounded-lg">
            <IconDollarSign class="h-6 w-6 text-indigo-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Revenue (CAD)</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalRevenueCAD }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Filters</h3>
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleAdvancedFilters"
            class="text-sm text-primary hover:text-primary-dark focus:outline-none flex items-center"
          >
            <IconFilter class="h-4 w-4 mr-1" />
            {{ showAdvancedFilters ? 'Hide Advanced' : 'Show Advanced' }}
          </button>
          <button 
            @click="clearAllFilters"
            class="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <!-- Basic Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            v-model="composableFilters.status"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="picked up">Picked Up</option>
            <option value="in transit">In Transit</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="awaiting delivery confirmation">Awaiting Confirmation</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
          <select 
            v-model="composableFilters.type"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="local">Local</option>
            <option value="interstate">Interstate</option>
            <option value="international">International</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select 
            v-model="composableFilters.vehicleType"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
          >
            <option value="">All Vehicles</option>
            <option value="compact car">Compact Car</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div class="flex space-x-2">
            <input
              v-model="composableFilters.startDate"
              type="date"
              class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-primary focus:border-primary"
            />
            <input
              v-model="composableFilters.endDate"
              type="date"
              class="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
      
      <!-- Advanced Filters -->
      <div v-if="showAdvancedFilters" class="border-t pt-4 animate-fadeIn">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <select 
              v-model="composableFilters.driverId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Drivers</option>
              <option v-for="driver in uniqueDrivers" :key="driver._id" :value="driver._id">
                {{ driver.firstName }} {{ driver.lastName }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Min Fare (NGN)</label>
            <input
              type="number"
              v-model.number="composableFilters.minFare"
              placeholder="0"
              min="0"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Fare (NGN)</label>
            <input
              type="number"
              v-model.number="composableFilters.maxFare"
              placeholder="No limit"
              min="0"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Search and Actions -->
    <div class="flex flex-col md:flex-row md:items-center lg:space-x-6 justify-between mb-6">
      <div class="relative mb-4 md:mb-0 md:w-full">
        <input
          v-model="composableFilters.search"
          type="text"
          placeholder="Search by code, recipient, item description, or location..."
          class="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
        <span class="absolute left-3 top-2.5 text-gray-400">
          <IconSearch class="w-5 h-5" />
        </span>
      </div>
      
      <div class="flex space-x-3">
        <!-- View Toggle -->
        <div class="flex border border-gray-300 rounded-md overflow-hidden">
          <button 
            @click="viewMode = 'list'"
            class="px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center"
            :class="viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            <IconList class="h-4 w-4" />
          </button>
          <button 
            @click="viewMode = 'grid'"
            class="px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center"
            :class="viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            <IconGrid class="h-4 w-4" />
          </button>
        </div>
        
        <button 
          @click="exportData"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
        >
          <IconDownload class="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="deliveries.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <IconPackage class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-lg font-medium text-gray-900">No deliveries found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
      <button 
        @click="clearAllFilters"
        class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-150"
      >
        Clear All Filters
      </button>
    </div>
    
    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg overflow-x-auto shadow overflow-hidden animate-fadeIn">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code & Item</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender & Recipient</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="delivery in deliveries" :key="delivery._id" class="hover:bg-gray-50 transition-colors duration-150">
            <!-- Code & Item -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <IconPackage class="h-4 w-4 text-blue-600" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ delivery.code }}</div>
                  <div class="text-xs text-gray-500 max-w-xs truncate">{{ delivery.itemDescription }}</div>
                  <div class="text-xs text-gray-500 capitalize">{{ delivery.type }} • {{ delivery.vehicleType }}</div>
                </div>
              </div>
            </td>
            
            <!-- Sender & Recipient -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="space-y-1">
                <div class="flex items-center text-sm">
                  <IconUser class="h-3 w-3 text-gray-400 mr-1" />
                  <span class="font-medium text-gray-900">{{ getFullName(delivery.userId) }}</span>
                </div>
                <div class="flex items-center text-sm">
                  <IconUserCheck class="h-3 w-3 text-gray-400 mr-1" />
                  <span class="text-gray-600">{{ delivery.recipientDetails.name }}</span>
                </div>
                <div class="text-xs text-gray-500">{{ delivery.recipientDetails.phone }}</div>
              </div>
            </td>
            
            <!-- Route -->
            <td class="px-6 py-4">
              <div class="max-w-xs space-y-1">
                <div class="flex items-center text-sm">
                  <IconMapPin class="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                  <span class="truncate text-gray-900">{{ delivery.pickupLocation.properties.address }}</span>
                </div>
                <div class="flex items-center text-sm">
                  <IconFlag class="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                  <span class="truncate text-gray-600">{{ delivery.destination.properties.address }}</span>
                </div>
                <div class="text-xs text-gray-500">
                  Pickup: {{ formatDate(delivery.pickupTime) }}
                </div>
              </div>
            </td>
            
            <!-- Driver -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="delivery.driverId" class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <IconUser class="h-full w-full p-1 text-gray-500" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">
                    {{ getFullName(delivery.driverId) }}
                  </div>
                  <div class="text-xs text-gray-500">{{ delivery.driverId.email }}</div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">Not assigned</div>
            </td>
            
            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(delivery.status)"
              >
                {{ delivery.status }}
              </span>
            </td>
            
            <!-- Fare -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ formatCurrency(delivery.totalFare.priceInUserCurrency, delivery.totalFare.currencySymbol) }}
              </div>
              <div class="text-xs text-gray-500">
                CAD ${{ delivery.totalFare.priceInCAD.toFixed(2) }}
              </div>
              <div v-if="hasDiscount(delivery)" class="text-xs text-green-600">
                Discount Applied
              </div>
            </td>
            
            <!-- Date -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div>{{ formatDate(delivery.createdAt) }}</div>
              <div class="text-xs text-gray-400">
                Updated: {{ formatRelativeTime(delivery.updatedAt) }}
              </div>
            </td>
            
            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="relative inline-block text-left">
                <button 
                  @click="toggleDropdown(delivery._id)"
                  class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <IconMoreVertical class="h-5 w-5 text-gray-500" />
                </button>
                
                <div 
                  v-if="activeDropdown === delivery._id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                >
                  <button 
                    @click="viewDeliveryDetails(delivery)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <IconEye class="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button 
                    v-if="delivery.driverId"
                    @click="viewCourierDetails(delivery.driverId)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <IconUser class="h-4 w-4 mr-2" />
                    View Courier
                  </button>
                  <button 
                    @click="trackDelivery(delivery)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <IconMapPin class="h-4 w-4 mr-2" />
                    Track Delivery
                  </button>
                  <button 
                    v-if="canUpdateStatus(delivery)"
                    @click="updateDeliveryStatus(delivery)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <IconEdit class="h-4 w-4 mr-2" />
                    Update Status
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <div v-for="delivery in deliveries" :key="delivery._id" class="bg-white rounded-lg shadow overflow-hidden relative hover:shadow-md transition-shadow duration-200">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <IconPackage class="h-5 w-5 text-blue-600" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ delivery.code }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(delivery.createdAt) }}</p>
              </div>
            </div>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(delivery.status)"
            >
              {{ delivery.status }}
            </span>
          </div>
          
          <!-- Item & Recipient -->
          <div class="space-y-3 mb-4">
            <div>
              <p class="text-xs text-gray-500">Item</p>
              <p class="text-sm font-medium text-gray-900 truncate">{{ delivery.itemDescription }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ delivery.type }} • {{ delivery.vehicleType }}</p>
            </div>
            
            <div>
              <p class="text-xs text-gray-500">Recipient</p>
              <p class="text-sm font-medium text-gray-900">{{ delivery.recipientDetails.name }}</p>
              <p class="text-xs text-gray-500">{{ delivery.recipientDetails.phone }}</p>
            </div>
          </div>
          
          <!-- Route -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center">
              <IconMapPin class="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span class="text-sm truncate">{{ delivery.pickupLocation.properties.address }}</span>
            </div>
            <div class="flex items-center">
              <IconFlag class="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span class="text-sm truncate">{{ delivery.destination.properties.address }}</span>
            </div>
          </div>
          
          <!-- Driver & Fare -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
            <div v-if="delivery.driverId" class="flex items-center">
              <div class="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                <IconUser class="h-full w-full p-1 text-gray-500" />
              </div>
              <div class="ml-2">
                <p class="text-xs font-medium text-gray-900">{{ getFullName(delivery.driverId) }}</p>
              </div>
            </div>
            <div v-else class="text-xs text-gray-500">No driver assigned</div>
            
            <div class="text-right">
              <div class="text-sm font-medium">
                {{ formatCurrency(delivery.totalFare.priceInUserCurrency, delivery.totalFare.currencySymbol) }}
              </div>
              <div class="text-xs text-gray-500">CAD ${{ delivery.totalFare.priceInCAD.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Actions Dropdown -->
        <div class="absolute top-3 right-3">
          <div class="relative inline-block text-left">
            <button 
              @click="toggleDropdown(delivery._id)"
              class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <IconMoreVertical class="h-5 w-5 text-gray-500" />
            </button>
            
            <div 
              v-if="activeDropdown === delivery._id"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
            >
              <button 
                @click="viewDeliveryDetails(delivery)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <IconEye class="h-4 w-4 mr-2" />
                View Details
              </button>
              <button 
                v-if="delivery.driverId"
                @click="viewCourierDetails(delivery.driverId)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <IconUser class="h-4 w-4 mr-2" />
                View Courier
              </button>
              <button 
                @click="trackDelivery(delivery)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <IconMapPin class="h-4 w-4 mr-2" />
                Track Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6">
      <CorePagination 
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        @page-change="handlePageChange"
      />
    </div>
    
    <!-- Modals would go here - similar structure to the trips implementation -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useGetDeliveries } from "@/composables/modules/deliveries/useFetchDeliveries"
import type { Delivery, User } from "@/types/delivery"
import { definePageMeta } from "#imports"

// Icons
import {
  Search as IconSearch,
  MoreVertical as IconMoreVertical,
  Eye as IconEye,
  Edit as IconEdit,
  User as IconUser,
  UserCheck as IconUserCheck,
  MapPin as IconMapPin,
  Flag as IconFlag,
  Clock as IconClock,
  Package as IconPackage,
  Grid as IconGrid,
  List as IconList,
  Download as IconDownload,
  CheckCircle as IconCheckCircle,
  DollarSign as IconDollarSign,
  Filter as IconFilter,
} from "lucide-vue-next"

// Composables
const {
  loading,
  deliveries,
  pagination,
  filters: composableFilters,
  changePage,
  clearFilters,
} = useGetDeliveries()

// State
const viewMode = ref<"list" | "grid">("list")
const activeDropdown = ref<string | null>(null)
const showAdvancedFilters = ref(false)

// Computed properties
const uniqueDrivers = computed(() => {
  const drivers = deliveries.value
    .filter(d => d.driverId)
    .map(d => d.driverId)
  
  return drivers.filter((driver, index, self) => 
    index === self.findIndex(d => d._id === driver._id)
  )
})

const getCountByStatus = (status: string): number => {
  return deliveries.value.filter(d => d.status === status).length
}

const inTransitCount = computed(() => {
  return deliveries.value.filter(d => 
    ['in transit', 'out for delivery', 'picked up'].includes(d.status)
  ).length
})

const totalRevenueNGN = computed(() => {
  const total = deliveries.value.reduce((sum, delivery) => 
    sum + (delivery.totalFare?.priceInUserCurrency || 0), 0
  )
  return formatCurrency(total, 'NGN')
})

const totalRevenueCAD = computed(() => {
  const total = deliveries.value.reduce((sum, delivery) => 
    sum + (delivery.totalFare?.priceInCAD || 0), 0
  )
  return formatCurrency(total, 'CAD')
})

// Helper functions
const getFullName = (user: User | null | undefined): string => {
  if (!user?.firstName || !user?.lastName) return "N/A"
  return `${user.firstName} ${user.lastName}`
}

const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'picked up': 'bg-purple-100 text-purple-800',
    'in transit': 'bg-indigo-100 text-indigo-800',
    'out for delivery': 'bg-orange-100 text-orange-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'awaiting delivery confirmation': 'bg-amber-100 text-amber-800'
  }
  
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const hasDiscount = (delivery: Delivery): boolean => {
  return (delivery.discount?.priceInUserCurrency || 0) > 0
}

const canUpdateStatus = (delivery: Delivery): boolean => {
  return !['delivered', 'cancelled'].includes(delivery.status)
}

const formatCurrency = (amount: number, currency: string = "NGN"): string => {
  const locale = currency === "CAD" ? "en-CA" : "en-NG"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  return formatDate(dateString)
}

// Event handlers
const toggleDropdown = (deliveryId: string) => {
  activeDropdown.value = activeDropdown.value === deliveryId ? null : deliveryId
}

const handleClickOutside = () => {
  activeDropdown.value = null
}

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const clearAllFilters = () => {
  clearFilters()
}

const viewDeliveryDetails = (delivery: Delivery) => {
  activeDropdown.value = null
  console.log("View delivery details:", delivery._id)
}

const viewCourierDetails = (driver: User) => {
  activeDropdown.value = null
  console.log("View courier details:", driver._id)
}

const trackDelivery = (delivery: Delivery) => {
  activeDropdown.value = null
  console.log("Track delivery:", delivery._id)
}

const updateDeliveryStatus = (delivery: Delivery) => {
  activeDropdown.value = null
  console.log("Update delivery status:", delivery._id)
}

const exportData = () => {
  console.log("Export functionality to be implemented")
}

const handlePageChange = async (page: number) => {
  await changePage(page)
}

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})

// Page meta
definePageMeta({
  layout: "dashboard",
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
