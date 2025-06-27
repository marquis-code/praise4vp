<template>
    <div class="min-h-screen">
      <!-- {{deliveries}} -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Deliveries</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
              <!-- <p class="text-xs text-green-600">+8% from last month</p> -->
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
              <!-- <p class="text-xs text-orange-600">+5% from last month</p> -->
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.completed }}</p>
              <!-- <p class="text-xs text-green-600">+12% from last month</p> -->
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(stats.totalRevenue) }}</p>
              <!-- <p class="text-xs text-green-600">+15% from last month</p> -->
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 border">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4 lg:mb-0">Filters</h3>
          <button
            @click="resetFilters"
            class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
  
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
            <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="local">Local</option>
              <option value="interstate">Interstate</option>
              <option value="international">International</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
            <select v-model="filters.vehicleType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Vehicles</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="small truck">Small Truck</option>
              <option value="medium truck">Medium Truck</option>
              <option value="large truck">Large Truck</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select v-model="filters.sortBy" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="totalFare-desc">Fare (High to Low)</option>
              <option value="totalFare-asc">Fare (Low to High)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>
  

      <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 border">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search deliveries..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <div class="flex items-center gap-2">
            <!-- View Toggle -->
            <div class="flex bg-gray-100 rounded-lg p-1">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
  
            <!-- Export Button -->
            <button
              @click="exportToCSV"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
  
      <div class="bg-white rounded-lg shadow-sm border">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-2">Loading deliveries...</p>
        </div>
  

        <div v-else-if="filteredDeliveries.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No deliveries found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
  
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          <div
            v-for="delivery in paginatedDeliveries"
            :key="delivery._id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span :class="getStatusBadgeClass(delivery.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1) }}
                </span>
                <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {{ delivery.type }}
                </span>
              </div>
              <button
                @click="openModal(delivery)"
                class="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
  
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-gray-600 truncate">{{ delivery.pickupLocation.properties.address }}</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-gray-600 truncate">{{ delivery.destination.properties.address }}</span>
              </div>
            </div>
  
            <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div class="text-sm text-gray-600">
                <p class="font-medium">{{ delivery.recipientDetails.name }}</p>
                <p class="text-xs">{{ formatDate(delivery.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">₦{{ formatCurrency(delivery.totalFare) }}</p>
                <p class="text-xs text-gray-500">{{ delivery.vehicleType }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Info</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="delivery in paginatedDeliveries" :key="delivery._id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <p class="font-medium text-gray-900 truncate max-w-xs">
                      {{ delivery.pickupLocation.properties.address }}
                    </p>
                    <p class="text-gray-600 truncate max-w-xs">
                      → {{ delivery.destination.properties.address }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {{ delivery.type }}
                      </span>
                      <span class="text-xs text-gray-500">{{ delivery.vehicleType }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <p class="font-medium text-gray-900">{{ delivery.recipientDetails.name }}</p>
                    <p class="text-gray-600">{{ delivery.recipientDetails.phone }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClass(delivery.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  ₦{{ formatCurrency(delivery.totalFare) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatDate(delivery.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openModal(delivery)"
                    class="text-blue-600 hover:text-blue-900 text-sm font-medium focus:outline-none"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div v-if="filteredDeliveries.length > 0" class="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredDeliveries.length) }} of {{ filteredDeliveries.length }} results
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeModal">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Delivery Details</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
  
          <div v-if="selectedDelivery" class="p-6 space-y-6">
            <!-- Status and Type -->
            <div class="flex items-center gap-4">
              <span :class="getStatusBadgeClass(selectedDelivery.status)" class="px-3 py-1 text-sm font-medium rounded-full">
                {{ selectedDelivery.status.charAt(0).toUpperCase() + selectedDelivery.status.slice(1) }}
              </span>
              <span class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {{ selectedDelivery.type }}
              </span>
              <span class="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {{ selectedDelivery.vehicleType }}
              </span>
            </div>
  
            <!-- Customer Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Customer</h3>
                <div class="text-sm text-gray-600 space-y-1">
                  <p><span class="font-medium">Name:</span> {{ selectedDelivery.userId.firstName }} {{ selectedDelivery.userId.lastName }}</p>
                  <p><span class="font-medium">Email:</span> {{ selectedDelivery.userId.email }}</p>
                </div>
              </div>
  
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Driver</h3>
                <div class="text-sm text-gray-600 space-y-1">
                  <p><span class="font-medium">Name:</span> {{ selectedDelivery.driverId.firstName }} {{ selectedDelivery.driverId.lastName }}</p>
                  <p><span class="font-medium">Email:</span> {{ selectedDelivery.driverId.email }}</p>
                </div>
              </div>
            </div>
  
            <!-- Recipient Information -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-2">Recipient</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">Name:</span> {{ selectedDelivery.recipientDetails.name }}</p>
                <p><span class="font-medium">Phone:</span> {{ selectedDelivery.recipientDetails.phone }}</p>
              </div>
            </div>
  
            <!-- Locations -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Pickup Location
                </h3>
                <p class="text-sm text-gray-600">{{ selectedDelivery.pickupLocation.properties.address }}</p>
              </div>
  
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Destination
                </h3>
                <p class="text-sm text-gray-600">{{ selectedDelivery.destination.properties.address }}</p>
              </div>
            </div>
  
            <!-- Item Details -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-2">Item Details</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p><span class="font-medium">Description:</span> {{ selectedDelivery.itemDescription }}</p>
                <div v-if="selectedDelivery.itemPhotoURL" class="mt-2">
                  <span class="font-medium">Photo:</span>
                  <img 
                    :src="getImageUrl(selectedDelivery.itemPhotoURL)" 
                    alt="Item photo" 
                    class="mt-1 w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              </div>
            </div>
  
            <!-- Pricing -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Pricing Breakdown</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Base Fare:</span>
                  <span class="font-medium">₦{{ formatCurrency(selectedDelivery.fare) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Tax:</span>
                  <span class="font-medium">₦{{ formatCurrency(selectedDelivery.tax) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Discount:</span>
                  <span class="font-medium text-green-600">-₦{{ formatCurrency(selectedDelivery.discount) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-2 flex justify-between">
                  <span class="font-medium text-gray-900">Total:</span>
                  <span class="font-bold text-lg">₦{{ formatCurrency(selectedDelivery.totalFare) }}</span>
                </div>
              </div>
            </div>
  
            <!-- Timestamps -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Created</h3>
                <p class="text-sm text-gray-600">{{ formatDateTime(selectedDelivery.createdAt) }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-2">Last Updated</h3>
                <p class="text-sm text-gray-600">{{ formatDateTime(selectedDelivery.updatedAt) }}</p>
              </div>
            </div>
  
            <div v-if="selectedDelivery.pickupTime">
              <h3 class="text-sm font-medium text-gray-900 mb-2">Scheduled Pickup</h3>
              <p class="text-sm text-gray-600">{{ formatDateTime(selectedDelivery.pickupTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  
  interface Location {
    type: string
    geometry: {
      type: string
      coordinates: [number, number]
    }
    properties: {
      address: string
    }
  }
  
  interface RecipientDetails {
    name: string
    phone: string
  }

  const props = defineProps({
    deliveries: {
        type: Array,
        default: []
    },
    loading: {
        type: Boolean,
        default: false
    }
  })
  
  interface Delivery {
    _id: string
    userId: User
    driverId: User
    type: 'local' | 'interstate' | 'international'
    pickupLocation: Location
    destination: Location
    pickupTime: string
    recipientDetails: RecipientDetails
    itemDescription: string
    itemPhotoURL?: string
    vehicleType: string
    fare: number
    tax: number
    discount: number
    totalFare: number
    status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'cancelled'
    route: {
      type: string
      features: any
    }
    createdAt: string
    updatedAt: string
  }
  
  interface Filters {
    type: string
    status: string
    vehicleType: string
    sortBy: string
  }
  
  interface Stats {
    total: number
    pending: number
    completed: number
    totalRevenue: number
  }
  

  const searchQuery = ref('')
  const viewMode = ref<'grid' | 'list'>('list')
  const showModal = ref(false)
  const selectedDelivery = ref<Delivery | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  
  const filters = ref<Filters>({
    type: '',
    status: '',
    vehicleType: '',
    sortBy: 'createdAt-desc'
  })
  
  
  // Computed properties
  // const stats = computed<Stats>(() => {
  //   const total = props?.deliveries?.length
  //   const pending = props?.deliveries?.filter(d => d.status === 'pending')?.length
  //   const completed = props?.deliveries?.filter(d => d.status === 'delivered')?.length
  //   const totalRevenue = props?.deliveries?.reduce((sum, d) => sum + d.totalFare, 0)
    
  //   return { total, pending, completed, totalRevenue }
  // })

  const stats = computed(() => {
  const deliveries = props?.deliveries || []
  const total = deliveries.length
  const pending = deliveries.filter(d => d.status === 'pending').length
  const completed = deliveries.filter(d => d.status === 'delivered').length
  const totalRevenue = deliveries.reduce((sum, d) => sum + (d.totalFare || 0), 0)
       
  return { total, pending, completed, totalRevenue }
})
  
  const filteredDeliveries = computed(() => {
    let filtered = [...props?.deliveries]
  
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery?.value?.toLowerCase()
      filtered = filtered?.filter(delivery => 
        delivery?.recipientDetails?.name?.toLowerCase()?.includes(query) ||
        delivery?.pickupLocation?.properties?.address?.toLowerCase()?.includes(query) ||
        delivery?.destination?.properties?.address?.toLowerCase()?.includes(query) ||
        delivery?.itemDescription?.toLowerCase()?.includes(query) ||
        delivery?.userId?.firstName?.toLowerCase()?.includes(query) ||
        delivery?.userId?.lastName?.toLowerCase()?.includes(query) ||
        delivery?.userId?.email?.toLowerCase()?.includes(query)
      )
    }
  
    // Apply filters
    if (filters.value.type) {
      filtered = filtered.filter(delivery => delivery?.type === filters?.value?.type)
    }
  
    if (filters.value.status) {
      filtered = filtered.filter(delivery => delivery?.status === filters?.value?.status)
    }
  
    if (filters.value.vehicleType) {
      filtered = filtered.filter(delivery => delivery?.vehicleType === filters?.value?.vehicleType)
    }
  
    // Apply sorting
    const [sortField, sortOrder] = filters.value.sortBy.split('-')
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Delivery]
      let bValue: any = b[sortField as keyof Delivery]
  
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
  
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  
    return filtered
  })
  
  const totalPages = computed(() => Math.ceil(filteredprops?.deliveries?.length / itemsPerPage?.value))
  
  const paginatedDeliveries = computed(() => {
    const start = (currentPage?.value - 1) * itemsPerPage?.value
    const end = start + itemsPerPage?.value
    return filteredprops?.deliveries?.slice(start, end)
  })
  
  
  const openModal = (delivery: Delivery) => {
    selectedDelivery.value = delivery
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedDelivery.value = null
  }
  
  const resetFilters = () => {
    filters.value = {
      type: '',
      status: '',
      vehicleType: '',
      sortBy: 'createdAt-desc'
    }
    searchQuery.value = ''
    currentPage.value = 1
  }
  
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Customer Name',
      'Customer Email',
      'Driver Name',
      'Driver Email',
      'Type',
      'Status',
      'Pickup Location',
      'Destination',
      'Recipient Name',
      'Recipient Phone',
      'Item Description',
      'Vehicle Type',
      'Base Fare',
      'Tax',
      'Discount',
      'Total Fare',
      'Created Date',
      'Updated Date'
    ]
  
    const csvData = filteredprops?.deliveries?.map(delivery => [
      delivery._id,
      `${delivery.userId.firstName} ${delivery.userId.lastName}`,
      delivery.userId.email,
      `${delivery.driverId.firstName} ${delivery.driverId.lastName}`,
      delivery.driverId.email,
      delivery.type,
      delivery.status,
      delivery.pickupLocation.properties.address,
      delivery.destination.properties.address,
      delivery.recipientDetails.name,
      delivery.recipientDetails.phone,
      delivery.itemDescription,
      delivery.vehicleType,
      delivery.fare,
      delivery.tax,
      delivery.discount,
      delivery.totalFare,
      formatDate(delivery.createdAt),
      formatDate(delivery.updatedAt)
    ])
  
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `deliveries-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const getStatusBadgeClass = (status: string) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-transit': 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG').format(amount)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getImageUrl = (imagePath: string) => {
    // Replace with your actual image base URL
    return `https://your-api-base-url.com/${imagePath}`
  }
  
  // Watch for filter changes to reset pagination
  watch([filters, searchQuery], () => {
    currentPage.value = 1
  }, { deep: true })
  
  // Load data on component mount
//   onMounted(() => {
//     loadDeliveries()
//   })

  // Meta and SEO
  useSeoMeta({
    title: 'Deliveries Management',
    description: 'Manage and monitor all delivery service orders'
  })
  </script>
  
  <style scoped>
  /* Add any additional custom styles here if needed */
  </style>