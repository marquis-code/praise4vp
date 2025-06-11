<template>
  <div class="min-h-screen animate-fadeIn">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Delivery Management</h1>
        <p class="text-gray-600">Manage and monitor all package deliveries</p>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Package class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Deliveries</p>
            <p class="text-2xl font-semibold text-gray-900">{{ deliveries.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Completed</p>
            <p class="text-2xl font-semibold text-gray-900">{{ completedDeliveries }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <Clock class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">In Transit</p>
            <p class="text-2xl font-semibold text-gray-900">{{ inTransitDeliveries }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <DollarSign class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Revenue</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalRevenue }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <DollarSign class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Revenue in CAD</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalRevenueInCAD }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Filters</h3>
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleAdvancedFilters"
            class="text-sm text-primary hover:text-primary-dark focus:outline-none flex items-center"
          >
            <Filter class="h-4 w-4 mr-1" />
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
      
      <!-- Basic Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            v-model="filters.status"
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
            v-model="filters.type"
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
            v-model="filters.vehicleType"
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Quick Date Range</label>
          <select 
            v-model="filters.quickDateRange"
            @change="handleQuickDateRange"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Custom Range</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisweek">This Week</option>
            <option value="lastweek">Last Week</option>
            <option value="thismonth">This Month</option>
            <option value="lastmonth">Last Month</option>
            <option value="thisquarter">This Quarter</option>
            <option value="thisyear">This Year</option>
          </select>
        </div>
      </div>
      
      <!-- Date Range Picker -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            v-model="filters.startDate"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            v-model="filters.endDate"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <!-- Advanced Filters -->
      <div v-if="showAdvancedFilters" class="border-t pt-4 animate-fadeIn">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Driver</label>
            <select 
              v-model="filters.driverId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Drivers</option>
              <option v-for="driver in uniqueDrivers" :key="driver._id" :value="driver._id">
                {{ driver.firstName }} {{ driver.lastName }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sender</label>
            <select 
              v-model="filters.senderId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Senders</option>
              <option v-for="sender in uniqueSenders" :key="sender._id" :value="sender._id">
                {{ sender.firstName }} {{ sender.lastName }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
            <select 
              v-model="filters.pickupLocation"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Locations</option>
              <option v-for="location in uniquePickupLocations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Min Fare (₦)</label>
            <input
              type="number"
              v-model.number="filters.minFare"
              placeholder="0"
              min="0"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Fare (₦)</label>
            <input
              type="number"
              v-model.number="filters.maxFare"
              placeholder="No limit"
              min="0"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Code</label>
            <input
              type="text"
              v-model="filters.deliveryCode"
              placeholder="Enter code"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
            <input
              type="text"
              v-model="filters.recipientPhone"
              placeholder="Enter phone"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <!-- Multi-select filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Multiple Statuses</label>
            <div class="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              <div v-for="status in availableStatuses" :key="status" class="flex items-center mb-1">
                <input
                  type="checkbox"
                  :id="`status-${status}`"
                  v-model="filters.multipleStatuses"
                  :value="status"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label :for="`status-${status}`" class="ml-2 text-sm text-gray-700 capitalize">
                  {{ status }}
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Multiple Vehicle Types</label>
            <div class="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              <div v-for="vehicle in availableVehicleTypes" :key="vehicle" class="flex items-center mb-1">
                <input
                  type="checkbox"
                  :id="`vehicle-${vehicle}`"
                  v-model="filters.multipleVehicleTypes"
                  :value="vehicle"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label :for="`vehicle-${vehicle}`" class="ml-2 text-sm text-gray-700 capitalize">
                  {{ vehicle }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Filter Summary -->
      <div v-if="activeFiltersCount > 0" class="mt-4 pt-4 border-t">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Active filters:</span>
            <span class="px-2 py-1 bg-primary text-white text-xs rounded-full">
              {{ activeFiltersCount }}
            </span>
          </div>
          <div class="text-sm text-gray-500">
            {{ filteredDeliveries.length }} of {{ deliveries.length }} deliveries match your criteria
          </div>
        </div>
        
        <!-- Active Filter Tags -->
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-if="filters.status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Status: {{ filters.status }}
            <button @click="filters.status = ''" class="ml-1 text-blue-600 hover:text-blue-800">
              <X class="h-3 w-3" />
            </button>
          </span>
          
          <span v-if="filters.type" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Type: {{ filters.type }}
            <button @click="filters.type = ''" class="ml-1 text-green-600 hover:text-green-800">
              <X class="h-3 w-3" />
            </button>
          </span>
          
          <span v-if="filters.vehicleType" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Vehicle: {{ filters.vehicleType }}
            <button @click="filters.vehicleType = ''" class="ml-1 text-purple-600 hover:text-purple-800">
              <X class="h-3 w-3" />
            </button>
          </span>
          
          <span v-if="filters.startDate || filters.endDate" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Date: {{ formatDateRange() }}
            <button @click="clearDateRange" class="ml-1 text-yellow-600 hover:text-yellow-800">
              <X class="h-3 w-3" />
            </button>
          </span>
          
          <span v-if="filters.minFare || filters.maxFare" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Fare: {{ formatFareRange() }}
            <button @click="clearFareRange" class="ml-1 text-indigo-600 hover:text-indigo-800">
              <X class="h-3 w-3" />
            </button>
          </span>
          
          <span v-if="filters.multipleStatuses.length > 0" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Multiple Statuses ({{ filters.multipleStatuses.length }})
            <button @click="filters.multipleStatuses = []" class="ml-1 text-red-600 hover:text-red-800">
              <X class="h-3 w-3" />
            </button>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Search and Actions -->
    <div class="flex flex-col md:flex-row md:items-center lg:space-x-6 justify-between mb-6">
      <div class="relative mb-4 md:mb-0 md:w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by code, recipient, item description, or location..."
          class="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
        <span class="absolute left-3 top-2.5 text-gray-400">
          <Search class="w-5 h-5" />
        </span>
        <button 
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex space-x-3">
        <!-- View Toggle -->
        <div class="flex border border-gray-300 rounded-md overflow-hidden">
          <button 
            @click="viewMode = 'grid'"
            class="px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center"
            :class="viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            <Grid class="h-4 w-4" />
          </button>
          <button 
            @click="viewMode = 'list'"
            class="px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center"
            :class="viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
          >
            <List class="h-4 w-4" />
          </button>
        </div>
        
        <!-- Sort Dropdown -->
        <div class="relative">
          <button 
            @click="showSortDropdown = !showSortDropdown"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
          >
            <ArrowUpDown class="h-4 w-4 mr-2" />
            Sort
          </button>
          
          <div 
            v-if="showSortDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
          >
            <button 
              v-for="option in sortOptions"
              :key="option.value"
              @click="setSortOption(option)"
              class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              :class="{ 'bg-gray-100': sortBy === option.value }"
            >
              <span>{{ option.label }}</span>
              <CheckCircle v-if="sortBy === option.value" class="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>
        
        <button 
          @click="showExportModal = true"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
        >
          <Download class="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="fetchingDeliveries" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredDeliveries.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <Package class="mx-auto h-12 w-12 text-gray-400" />
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
    
    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <div v-for="delivery in paginatedDeliveries" :key="delivery._id" class="bg-white rounded-lg shadow overflow-hidden relative">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <Package class="h-5 w-5 text-blue-600" />
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
          
          <!-- Delivery Details -->
          <div class="space-y-3">
            <div>
              <p class="text-xs text-gray-500">Item</p>
              <p class="text-sm font-medium text-gray-900 truncate">{{ delivery.itemDescription }}</p>
            </div>
            
            <div>
              <p class="text-xs text-gray-500">Recipient</p>
              <p class="text-sm font-medium text-gray-900">{{ delivery.recipientDetails.name }}</p>
              <p class="text-xs text-gray-500">{{ delivery.recipientDetails.phone }}</p>
            </div>
            
            <div>
              <p class="text-xs text-gray-500">Pickup → Destination</p>
              <p class="text-sm text-gray-900 truncate">{{ delivery.pickupLocation.properties.address }}</p>
              <p class="text-sm text-gray-900 truncate">→ {{ delivery.destination.properties.address }}</p>
            </div>
            
            <div class="flex justify-between items-center">
              <div>
                <p class="text-xs text-gray-500">Fare</p>
                <p class="text-sm font-semibold text-gray-900">
                  {{ formatCurrency(delivery?.fare?.priceInUserCurrency) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Vehicle</p>
                <p class="text-sm text-gray-900 capitalize">{{ delivery.vehicleType }}</p>
              </div>
            </div>
            
            <div v-if="delivery.driverId">
              <p class="text-xs text-gray-500">Driver</p>
              <p class="text-sm font-medium text-gray-900">{{ delivery.driverId.firstName }} {{ delivery.driverId.lastName }}</p>
            </div>
          </div>
        </div>
        
        <!-- Actions Dropdown for Grid View -->
        <div class="absolute top-3 right-3">
          <div class="relative inline-block text-left">
            <button 
              @click="toggleDropdown(delivery._id)"
              class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <MoreVertical class="h-5 w-5 text-gray-500" />
            </button>
            
            <div 
              v-if="activeDropdown === delivery._id"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
            >
              <button 
                @click="viewDeliveryDetails(delivery)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Eye class="h-4 w-4 mr-2" />
                View Details
              </button>
              <button 
                v-if="delivery.driverId"
                @click="viewCourierDetails(delivery.driverId)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <User class="h-4 w-4 mr-2" />
                View Courier
              </button>
              <button 
                @click="trackDelivery(delivery)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <MapPin class="h-4 w-4 mr-2" />
                Track Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- List View -->
    <div v-else class="bg-white rounded-lg overflow-x-auto shadow overflow-hidden animate-fadeIn">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item & Recipient
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Route
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driver
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fare
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="delivery in paginatedDeliveries" :key="delivery._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <Package class="h-4 w-4 text-blue-600" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ delivery.code }}</div>
                  <div class="text-xs text-gray-500">{{ delivery.type }}</div>
                </div>
              </div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 truncate max-w-xs">{{ delivery.itemDescription }}</div>
              <div class="text-xs text-gray-500">{{ delivery.recipientDetails.name }}</div>
              <div class="text-xs text-gray-500">{{ delivery.recipientDetails.phone }}</div>
            </td>
            
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 truncate max-w-xs">
                <div class="flex items-center">
                  <MapPin class="h-3 w-3 text-green-500 mr-1" />
                  {{ delivery.pickupLocation.properties.address }}
                </div>
                <div class="flex items-center mt-1">
                  <MapPin class="h-3 w-3 text-red-500 mr-1" />
                  {{ delivery.destination.properties.address }}
                </div>
              </div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <div v-if="delivery.driverId" class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                  <User class="h-full w-full p-1 text-gray-500" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">
                    {{ delivery.driverId.firstName }} {{ delivery.driverId.lastName }}
                  </div>
                  <div class="text-xs text-gray-500">{{ delivery.driverId.email }}</div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">Not assigned</div>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(delivery.status)"
              >
                {{ delivery.status }}
              </span>
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <!-- {{ formatCurrency() }} -->
              {{ formatCurrency(delivery?.fare?.priceInUserCurrency) }}
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(delivery.createdAt) }}
            </td>
            
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="relative inline-block text-left">
                <button 
                  @click="toggleDropdown(delivery._id)"
                  class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <MoreVertical class="h-5 w-5 text-gray-500" />
                </button>
                
                <div 
                  v-if="activeDropdown === delivery._id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                >
                  <button 
                    @click="viewDeliveryDetails(delivery)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Eye class="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button 
                    v-if="delivery.driverId"
                    @click="viewCourierDetails(delivery.driverId)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User class="h-4 w-4 mr-2" />
                    View Courier
                  </button>
                  <button 
                    @click="trackDelivery(delivery)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <MapPin class="h-4 w-4 mr-2" />
                    Track Delivery
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <!-- <div class="mt-6">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ filteredDeliveries.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                :class="[
                  page === currentPage
                    ? 'z-10 bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div> -->

    <div class="mt-6">
      <CorePagination 
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        @page-change="handlePageChange"
      />
    </div>
    
    <!-- Delivery Details Modal -->
    <Teleport to="body">
      <div 
        v-if="showDeliveryModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="closeDeliveryModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Delivery Details</h3>
              <button 
                @click="closeDeliveryModal"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div v-if="selectedDelivery" class="space-y-6">
              <!-- Header Info -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="p-3 bg-blue-100 rounded-lg">
                      <Package class="h-6 w-6 text-blue-600" />
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-900">{{ selectedDelivery.code }}</h4>
                      <p class="text-sm text-gray-500">{{ selectedDelivery.type }} delivery</p>
                    </div>
                  </div>
                  <span 
                    class="px-3 py-1 text-sm font-medium rounded-full"
                    :class="getStatusClass(selectedDelivery.status)"
                  >
                    {{ selectedDelivery.status }}
                  </span>
                </div>
              </div>
              
              <!-- Main Details Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-6">
                  <!-- Item Information -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Item Information</h5>
                    <div class="space-y-3">
                      <div>
                        <p class="text-xs text-gray-500">Description</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.itemDescription }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Vehicle Type</p>
                        <p class="text-sm text-gray-900 capitalize">{{ selectedDelivery.vehicleType }}</p>
                      </div>
                      <div v-if="selectedDelivery.itemPhotoURL">
                        <p class="text-xs text-gray-500">Item Photo</p>
                        <img 
                          :src="`/placeholder.svg?height=100&width=150`" 
                          :alt="selectedDelivery.itemDescription"
                          class="mt-1 h-20 w-30 object-cover rounded border"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <!-- Sender Information -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Sender Information</h5>
                    <div class="space-y-3">
                      <div>
                        <p class="text-xs text-gray-500">Name</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.userId.firstName }} {{ selectedDelivery.userId.lastName }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Email</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.userId.email }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Recipient Information -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Recipient Information</h5>
                    <div class="space-y-3">
                      <div>
                        <p class="text-xs text-gray-500">Name</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.recipientDetails.name }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Phone</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.recipientDetails.phone }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div class="space-y-6">
                  <!-- Route Information -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Route Information</h5>
                    <div class="space-y-4">
                      <div class="flex items-start">
                        <div class="p-1 bg-green-100 rounded-full mr-3 mt-1">
                          <MapPin class="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Pickup Location</p>
                          <p class="text-sm text-gray-900">{{ selectedDelivery.pickupLocation.properties.address }}</p>
                        </div>
                      </div>
                      <div class="flex items-start">
                        <div class="p-1 bg-red-100 rounded-full mr-3 mt-1">
                          <MapPin class="h-3 w-3 text-red-600" />
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Destination</p>
                          <p class="text-sm text-gray-900">{{ selectedDelivery.destination.properties.address }}</p>
                        </div>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Pickup Time</p>
                        <p class="text-sm text-gray-900">{{ formatDate(selectedDelivery.pickupTime) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Driver Information -->
                  <div v-if="selectedDelivery.driverId" class="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Driver Information</h5>
                    <div class="flex items-center">
                      <div class="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                        <User class="h-full w-full p-2 text-gray-500" />
                      </div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">
                          {{ selectedDelivery.driverId.firstName }} {{ selectedDelivery.driverId.lastName }}
                        </p>
                        <p class="text-xs text-gray-500">{{ selectedDelivery.driverId.email }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Fare Breakdown -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Fare Breakdown</h5>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Base Fare</span>
                        <span class="text-sm text-gray-900">{{ formatCurrency(selectedDelivery.fare.priceInUserCurrency) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Base Fare in CAD</span>
                        <span class="text-sm text-gray-900">{{ formatCurrency(selectedDelivery.fare.priceInUserCurrency) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Tax</span>
                        <span class="text-sm text-gray-900">{{ formatCurrency(selectedDelivery.tax.priceInUserCurrency) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Discount</span>
                        <span class="text-sm text-gray-900">-{{ formatCurrency(selectedDelivery.discount.priceInUserCurrency) }}</span>
                      </div>
                      <div class="border-t pt-2">
                        <div class="flex justify-between">
                          <span class="text-sm font-medium text-gray-900">Total</span>
                          <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(selectedDelivery.totalFare.priceInUserCurrency) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Timeline -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h5 class="text-sm font-medium text-gray-900 mb-3">Delivery Timeline</h5>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <div class="p-1 bg-blue-100 rounded-full mr-3">
                      <Clock class="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-900">Order Created</p>
                      <p class="text-xs text-gray-500">{{ formatDate(selectedDelivery.createdAt) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="p-1 bg-green-100 rounded-full mr-3">
                      <CheckCircle class="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-900">Last Updated</p>
                      <p class="text-xs text-gray-500">{{ formatDate(selectedDelivery.updatedAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Courier Details Modal -->
    <Teleport to="body">
      <div 
        v-if="showCourierModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="closeCourierModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Courier Details</h3>
              <button 
                @click="closeCourierModal"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div v-if="selectedCourier" class="space-y-6">
              <!-- Courier Profile Header -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center">
                  <div class="h-16 w-16 rounded-full bg-gray-200 overflow-hidden">
                    <User class="h-full w-full p-3 text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-900">
                      {{ selectedCourier.firstName }} {{ selectedCourier.lastName }}
                    </h4>
                    <p class="text-sm text-gray-500">{{ selectedCourier.email }}</p>
                    <div class="flex items-center mt-1">
                      <Star class="h-4 w-4 text-yellow-400 mr-1" />
                      <span class="text-sm text-gray-600">4.8 rating</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Courier Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-500">Email</p>
                      <p class="text-sm text-gray-900">{{ selectedCourier.email }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Phone</p>
                      <p class="text-sm text-gray-900">+234 XXX XXX XXXX</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Status</p>
                      <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-gray-900 mb-3">Performance Stats</h5>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-500">Total Deliveries</p>
                      <p class="text-sm text-gray-900">156</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Success Rate</p>
                      <p class="text-sm text-gray-900">98.5%</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Average Rating</p>
                      <p class="text-sm text-gray-900">4.8/5.0</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Recent Deliveries -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h5 class="text-sm font-medium text-gray-900 mb-3">Recent Deliveries</h5>
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p class="text-sm font-medium text-gray-900">QUBG</p>
                      <p class="text-xs text-gray-500">Lamine Yamals shirt FC Barcelona</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p class="text-sm font-medium text-gray-900">ELEC</p>
                      <p class="text-xs text-gray-500">Electronics Package</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      In Transit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Track Delivery Modal -->
    <Teleport to="body">
      <div 
        v-if="showTrackingModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="closeTrackingModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Track Delivery</h3>
              <button 
                @click="closeTrackingModal"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div v-if="selectedDelivery" class="space-y-6">
              <!-- Delivery Header -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900">{{ selectedDelivery.code }}</h4>
                    <p class="text-sm text-gray-500">{{ selectedDelivery.itemDescription }}</p>
                  </div>
                  <span 
                    class="px-3 py-1 text-sm font-medium rounded-full"
                    :class="getStatusClass(selectedDelivery.status)"
                  >
                    {{ selectedDelivery.status }}
                  </span>
                </div>
              </div>
              
              <!-- Map Placeholder -->
              <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div class="text-center">
                  <MapPin class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p class="text-gray-500">Interactive Map View</p>
                  <p class="text-xs text-gray-400">Real-time tracking would be displayed here</p>
                </div>
              </div>
              
              <!-- Route Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-gray-900 mb-3">Route Details</h5>
                  <div class="space-y-4">
                    <div class="flex items-start">
                      <div class="p-1 bg-green-100 rounded-full mr-3 mt-1">
                        <MapPin class="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">From</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.pickupLocation.properties.address }}</p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <div class="p-1 bg-red-100 rounded-full mr-3 mt-1">
                        <MapPin class="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">To</p>
                        <p class="text-sm text-gray-900">{{ selectedDelivery.destination.properties.address }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 class="text-sm font-medium text-gray-900 mb-3">Delivery Info</h5>
                  <div class="space-y-3">
                    <div>
                      <p class="text-xs text-gray-500">Estimated Delivery</p>
                      <p class="text-sm text-gray-900">{{ formatDate(selectedDelivery.pickupTime) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Vehicle Type</p>
                      <p class="text-sm text-gray-900 capitalize">{{ selectedDelivery.vehicleType }}</p>
                    </div>
                    <div v-if="selectedDelivery.driverId">
                      <p class="text-xs text-gray-500">Driver</p>
                      <p class="text-sm text-gray-900">{{ selectedDelivery.driverId.firstName }} {{ selectedDelivery.driverId.lastName }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Tracking Timeline -->
              <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h5 class="text-sm font-medium text-gray-900 mb-4">Tracking Timeline</h5>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <div class="p-2 bg-green-100 rounded-full mr-4">
                      <CheckCircle class="h-4 w-4 text-green-600" />
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">Order Created</p>
                          <p class="text-xs text-gray-500">Package details confirmed</p>
                        </div>
                        <p class="text-xs text-gray-500">{{ formatDate(selectedDelivery.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="p-2 bg-blue-100 rounded-full mr-4">
                      <Package class="h-4 w-4 text-blue-600" />
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">Package Picked Up</p>
                          <p class="text-xs text-gray-500">Driver collected the package</p>
                        </div>
                        <p class="text-xs text-gray-500">{{ formatDate(selectedDelivery.updatedAt) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 rounded-full mr-4">
                      <Clock class="h-4 w-4 text-yellow-600" />
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">In Transit</p>
                          <p class="text-xs text-gray-500">Package is on the way</p>
                        </div>
                        <p class="text-xs text-gray-500">Current Status</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Export Modal -->
    <Teleport to="body">
      <div 
        v-if="showExportModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="closeExportModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Export Deliveries Data</h3>
              <button 
                @click="closeExportModal"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <!-- Export Format Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <div class="flex space-x-4">
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="exportFormat" 
                    value="csv" 
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">CSV</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    type="radio" 
                    v-model="exportFormat" 
                    value="pdf" 
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">PDF</span>
                </label>
              </div>
            </div>
            
            <!-- Field Selection -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">Select Fields to Export</label>
                <button 
                  @click="toggleAllFields"
                  class="text-xs text-primary hover:text-primary-dark focus:outline-none"
                >
                  {{ allFieldsSelected ? 'Deselect All' : 'Select All' }}
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                <div v-for="field in exportFields" :key="field.key" class="flex items-center">
                  <input 
                    type="checkbox" 
                    :id="field.key" 
                    v-model="selectedFields" 
                    :value="field.key" 
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label :for="field.key" class="ml-2 text-sm text-gray-700">{{ field.label }}</label>
                </div>
              </div>
              
              <p class="mt-2 text-xs text-gray-500">
                {{ selectedFields.length }} fields selected
              </p>
            </div>
            
            <!-- Export Options -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
              <div class="space-y-2">
                <label class="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="exportOptions.includeHeaders" 
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Include Headers</span>
                </label>
                <label class="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="exportOptions.onlyFiltered" 
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">Export Only Filtered Deliveries</span>
                </label>
              </div>
            </div>
            
            <div class="mt-8 flex justify-end space-x-3">
              <button 
                @click="closeExportModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button 
                @click="exportData"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
                :disabled="isExporting || selectedFields.length === 0"
                :class="{ 'opacity-50 cursor-not-allowed': isExporting || selectedFields.length === 0 }"
              >
                <span v-if="isExporting" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Exporting...
                </span>
                <span v-else class="flex items-center">
                  <Download class="h-4 w-4 mr-2" />
                  Export {{ exportFormat.toUpperCase() }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Success Toast -->
    <Teleport to="body">
      <div 
        v-if="showToast" 
        class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fadeIn"
      >
        <CheckCircle class="h-5 w-5 mr-2" />
        <span>{{ toastMessage }}</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  Search, Download, Package, CheckCircle, Clock, DollarSign, 
  MoreVertical, Eye, User, MapPin, Grid, List, X, ChevronLeft, ChevronRight, 
  Star, Filter, ArrowUpDown
} from 'lucide-vue-next'
import { useGetDeliveries } from "@/composables/modules/deliveries/useFetchDeliveries"
// import { definePageMeta } from '#app'

// Use the composable
const { deliveries, loading: fetchingDeliveries, changePage, pagination } = useGetDeliveries()

// View mode
const viewMode = ref<'grid' | 'list'>('list')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Search and filters
const searchQuery = ref('')
const showAdvancedFilters = ref(false)
const showSortDropdown = ref(false)

// Enhanced filters
const filters = ref({
  status: '',
  type: '',
  vehicleType: '',
  quickDateRange: '',
  startDate: '',
  endDate: '',
  driverId: '',
  senderId: '',
  pickupLocation: '',
  minFare: null as number | null,
  maxFare: null as number | null,
  deliveryCode: '',
  recipientPhone: '',
  multipleStatuses: [] as string[],
  multipleVehicleTypes: [] as string[]
})

// Sort options
const sortBy = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

const sortOptions = [
  { value: 'createdAt', label: 'Date Created', order: 'desc' },
  { value: 'updatedAt', label: 'Last Updated', order: 'desc' },
  { value: 'totalFare', label: 'Fare (High to Low)', order: 'desc' },
  { value: 'totalFare', label: 'Fare (Low to High)', order: 'asc' },
  { value: 'code', label: 'Delivery Code', order: 'asc' },
  { value: 'status', label: 'Status', order: 'asc' },
  { value: 'recipientDetails.name', label: 'Recipient Name', order: 'asc' }
]

// Available filter options
const availableStatuses = [
  'pending', 'confirmed', 'picked up', 'in transit', 'out for delivery', 
  'delivered', 'cancelled', 'awaiting delivery confirmation'
]

const availableVehicleTypes = [
  'compact car', 'sedan', 'suv', 'van', 'truck', 'motorcycle'
]

// Dropdown state
const activeDropdown = ref<string | null>(null)

// Modal states
const showDeliveryModal = ref(false)
const showCourierModal = ref(false)
const showTrackingModal = ref(false)
const showExportModal = ref(false)
const selectedDelivery = ref<any>(null)
const selectedCourier = ref<any>(null)

// Export modal state
const exportFormat = ref<'csv' | 'pdf'>('csv')
const isExporting = ref(false)
const selectedFields = ref<string[]>([
  'code', 'itemDescription', 'recipientDetails.name', 'status', 'totalFare'
])
const exportOptions = ref({
  includeHeaders: true,
  onlyFiltered: false
})

// Toast state
const showToast = ref(false)
const toastMessage = ref('')

// Export field definitions
const exportFields = [
  { key: 'code', label: 'Delivery Code' },
  { key: 'type', label: 'Delivery Type' },
  { key: 'itemDescription', label: 'Item Description' },
  { key: 'recipientDetails.name', label: 'Recipient Name' },
  { key: 'recipientDetails.phone', label: 'Recipient Phone' },
  { key: 'pickupLocation.properties.address', label: 'Pickup Address' },
  { key: 'destination.properties.address', label: 'Destination Address' },
  { key: 'vehicleType', label: 'Vehicle Type' },
  { key: 'fare', label: 'Base Fare' },
  { key: 'tax', label: 'Tax' },
  { key: 'discount', label: 'Discount' },
  { key: 'totalFare', label: 'Total Fare' },
  { key: 'status', label: 'Status' },
  { key: 'userId.firstName', label: 'Sender First Name' },
  { key: 'userId.lastName', label: 'Sender Last Name' },
  { key: 'userId.email', label: 'Sender Email' },
  { key: 'driverId.firstName', label: 'Driver First Name' },
  { key: 'driverId.lastName', label: 'Driver Last Name' },
  { key: 'driverId.email', label: 'Driver Email' },
  { key: 'createdAt', label: 'Created Date' },
  { key: 'updatedAt', label: 'Updated Date' }
]

// Check if all fields are selected
const allFieldsSelected = computed(() => {
  return selectedFields.value.length === exportFields.length
})

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (activeDropdown.value) {
    activeDropdown.value = null
  }
  if (showSortDropdown.value) {
    showSortDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Computed properties for unique filter options
const uniqueDrivers = computed(() => {
  const drivers = deliveries.value
    .filter(d => d.driverId)
    .map(d => d.driverId)
  
  return drivers.filter((driver, index, self) => 
    index === self.findIndex(d => d._id === driver._id)
  )
})

const uniqueSenders = computed(() => {
  const senders = deliveries.value.map(d => d.userId)
  
  return senders.filter((sender, index, self) => 
    index === self.findIndex(s => s._id === sender._id)
  )
})

const uniquePickupLocations = computed(() => {
  const locations = deliveries.value.map(d => d.pickupLocation.properties.address)
  
  return [...new Set(locations)].sort()
})

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0
  
  if (filters.value.status) count++
  if (filters.value.type) count++
  if (filters.value.vehicleType) count++
  if (filters.value.startDate || filters.value.endDate) count++
  if (filters.value.driverId) count++
  if (filters.value.senderId) count++
  if (filters.value.pickupLocation) count++
  if (filters.value.minFare !== null) count++
  if (filters.value.maxFare !== null) count++
  if (filters.value.deliveryCode) count++
  if (filters.value.recipientPhone) count++
  if (filters.value.multipleStatuses.length > 0) count++
  if (filters.value.multipleVehicleTypes.length > 0) count++
  
  return count
})

// Enhanced filtered deliveries with all filters
const filteredDeliveries = computed(() => {
  let result = [...deliveries.value]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(delivery => 
      delivery.code.toLowerCase().includes(query) ||
      delivery.itemDescription.toLowerCase().includes(query) ||
      delivery.recipientDetails.name.toLowerCase().includes(query) ||
      delivery.recipientDetails.phone.toLowerCase().includes(query) ||
      delivery.pickupLocation.properties.address.toLowerCase().includes(query) ||
      delivery.destination.properties.address.toLowerCase().includes(query) ||
      (delivery.driverId && 
        `${delivery.driverId.firstName} ${delivery.driverId.lastName}`.toLowerCase().includes(query))
    )
  }
  
  // Apply basic filters
  if (filters.value.status) {
    result = result.filter(delivery => delivery.status === filters.value.status)
  }
  
  if (filters.value.type) {
    result = result.filter(delivery => delivery.type === filters.value.type)
  }
  
  if (filters.value.vehicleType) {
    result = result.filter(delivery => delivery.vehicleType === filters.value.vehicleType)
  }
  
  // Apply date range filter
  if (filters.value.startDate || filters.value.endDate) {
    result = result.filter(delivery => {
      const deliveryDate = new Date(delivery.createdAt)
      const startDate = filters.value.startDate ? new Date(filters.value.startDate) : null
      const endDate = filters.value.endDate ? new Date(filters.value.endDate + 'T23:59:59') : null
      
      if (startDate && deliveryDate < startDate) return false
      if (endDate && deliveryDate > endDate) return false
      
      return true
    })
  }
  
  // Apply advanced filters
  if (filters.value.driverId) {
    result = result.filter(delivery => 
      delivery.driverId && delivery.driverId._id === filters.value.driverId
    )
  }
  
  if (filters.value.senderId) {
    result = result.filter(delivery => delivery.userId._id === filters.value.senderId)
  }
  
  if (filters.value.pickupLocation) {
    result = result.filter(delivery => 
      delivery.pickupLocation.properties.address === filters.value.pickupLocation
    )
  }
  
  if (filters.value.minFare !== null) {
    result = result.filter(delivery => delivery.totalFare >= filters.value.minFare!)
  }
  
  if (filters.value.maxFare !== null) {
    result = result.filter(delivery => delivery.totalFare <= filters.value.maxFare!)
  }
  
  if (filters.value.deliveryCode) {
    result = result.filter(delivery => 
      delivery.code.toLowerCase().includes(filters.value.deliveryCode.toLowerCase())
    )
  }
  
  if (filters.value.recipientPhone) {
    result = result.filter(delivery => 
      delivery.recipientDetails.phone.includes(filters.value.recipientPhone)
    )
  }
  
  // Apply multiple status filter
  if (filters.value.multipleStatuses.length > 0) {
    result = result.filter(delivery => 
      filters.value.multipleStatuses.includes(delivery.status)
    )
  }
  
  // Apply multiple vehicle type filter
  if (filters.value.multipleVehicleTypes.length > 0) {
    result = result.filter(delivery => 
      filters.value.multipleVehicleTypes.includes(delivery.vehicleType)
    )
  }
  
  // Apply sorting
  result.sort((a, b) => {
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => prev?.[curr], obj)
    }
    
    const aValue = getValue(a, sortBy.value)
    const bValue = getValue(b, sortBy.value)
    
    if (aValue === bValue) return 0
    
    const comparison = aValue < bValue ? -1 : 1
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return result
})

const paginatedDeliveries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDeliveries.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredDeliveries.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage
  return end > filteredDeliveries.value.length ? filteredDeliveries.value.length : end
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Stats computed properties
const completedDeliveries = computed(() => {
  return deliveries.value.filter(d => d.status === 'delivered').length
})

const inTransitDeliveries = computed(() => {
  return deliveries.value.filter(d => ['in transit', 'out for delivery', 'picked up'].includes(d.status)).length
})

const totalRevenue = computed(() => {
  const total = deliveries.value.reduce((sum, delivery) => sum + delivery?.fare?.priceInUserCurrency, 0)
  return formatCurrency(total)
})

const totalRevenueInCAD = computed(() => {
  const totalinCAD = deliveries.value.reduce((sum, delivery) => sum + delivery?.fare?.priceInCAD, 0)
    return formatCADCurrency(totalinCAD)
})

// const totalRevenueInCAD = computed(() => {
//   const totalAmount = deliveries.value.reduce((sum, delivery) => sum + delivery?.fare?.priceInCAD, 0)
//   return totalRevenueInCAD.value(total)
// })

// const totalRevenueInCAD = computed(() => {
//   const total = deliveries.value.reduce((sum, delivery) => sum + delivery?.fare?.priceInCAD, 0)
//   return totalRevenueInCAD(total)
// })

// Reset pagination when filters change
watch([filters, searchQuery, sortBy, sortOrder], () => {
  currentPage.value = 1
}, { deep: true })

// Methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const toggleDropdown = (deliveryId: string) => {
  event?.stopPropagation()
  
  if (activeDropdown.value === deliveryId) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = deliveryId
  }
}

const viewDeliveryDetails = (delivery: any) => {
  activeDropdown.value = null
  selectedDelivery.value = delivery
  showDeliveryModal.value = true
}

const viewCourierDetails = (driver: any) => {
  activeDropdown.value = null
  selectedCourier.value = driver
  showCourierModal.value = true
}

const trackDelivery = (delivery: any) => {
  activeDropdown.value = null
  selectedDelivery.value = delivery
  showTrackingModal.value = true
}

const closeDeliveryModal = () => {
  showDeliveryModal.value = false
  setTimeout(() => {
    selectedDelivery.value = null
  }, 300)
}

const closeCourierModal = () => {
  showCourierModal.value = false
  setTimeout(() => {
    selectedCourier.value = null
  }, 300)
}

const closeTrackingModal = () => {
  showTrackingModal.value = false
  setTimeout(() => {
    selectedDelivery.value = null
  }, 300)
}

// Filter methods
const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const clearAllFilters = () => {
  filters.value = {
    status: '',
    type: '',
    vehicleType: '',
    quickDateRange: '',
    startDate: '',
    endDate: '',
    driverId: '',
    senderId: '',
    pickupLocation: '',
    minFare: null,
    maxFare: null,
    deliveryCode: '',
    recipientPhone: '',
    multipleStatuses: [],
    multipleVehicleTypes: []
  }
  searchQuery.value = ''
}

const clearDateRange = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  filters.value.quickDateRange = ''
}

const clearFareRange = () => {
  filters.value.minFare = null
  filters.value.maxFare = null
}

const formatDateRange = () => {
  if (filters.value.startDate && filters.value.endDate) {
    return `${filters.value.startDate} to ${filters.value.endDate}`
  } else if (filters.value.startDate) {
    return `From ${filters.value.startDate}`
  } else if (filters.value.endDate) {
    return `Until ${filters.value.endDate}`
  }
  return ''
}

const formatFareRange = () => {
  if (filters.value.minFare !== null && filters.value.maxFare !== null) {
    return `₦${filters.value.minFare} - ₦${filters.value.maxFare}`
  } else if (filters.value.minFare !== null) {
    return `Min ₦${filters.value.minFare}`
  } else if (filters.value.maxFare !== null) {
    return `Max ₦${filters.value.maxFare}`
  }
  return ''
}

// Quick date range handler
const handleQuickDateRange = () => {
  const today = new Date()
  const range = filters.value.quickDateRange
  
  switch (range) {
    case 'today':
      filters.value.startDate = today.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      filters.value.startDate = yesterday.toISOString().split('T')[0]
      filters.value.endDate = yesterday.toISOString().split('T')[0]
      break
    case 'last7days':
      const last7Days = new Date(today)
      last7Days.setDate(today.getDate() - 7)
      filters.value.startDate = last7Days.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    case 'last30days':
      const last30Days = new Date(today)
      last30Days.setDate(today.getDate() - 30)
      filters.value.startDate = last30Days.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    case 'thisweek':
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      filters.value.startDate = startOfWeek.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    case 'lastweek':
      const lastWeekStart = new Date(today)
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7)
      const lastWeekEnd = new Date(lastWeekStart)
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
      filters.value.startDate = lastWeekStart.toISOString().split('T')[0]
      filters.value.endDate = lastWeekEnd.toISOString().split('T')[0]
      break
    case 'thismonth':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      filters.value.startDate = startOfMonth.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    case 'lastmonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
      filters.value.startDate = lastMonthStart.toISOString().split('T')[0]
      filters.value.endDate = lastMonthEnd.toISOString().split('T')[0]
      break
    case 'thisquarter':
      const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
      filters.value.startDate = quarterStart.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    case 'thisyear':
      const yearStart = new Date(today.getFullYear(), 0, 1)
      filters.value.startDate = yearStart.toISOString().split('T')[0]
      filters.value.endDate = today.toISOString().split('T')[0]
      break
    default:
      // Custom range - don't change dates
      break
  }
}

// Sort methods
const setSortOption = (option: any) => {
  sortBy.value = option.value
  sortOrder.value = option.order
  showSortDropdown.value = false
}

// Export functionality
const closeExportModal = () => {
  showExportModal.value = false
}

const toggleAllFields = () => {
  if (allFieldsSelected.value) {
    selectedFields.value = []
  } else {
    selectedFields.value = exportFields.map(field => field.key)
  }
}

// Get nested property value from object using dot notation
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null
  }, obj)
}

// Format value for export
const formatValueForExport = (value: any, key: string) => {
  if (value === null || value === undefined) return ''
  
  // Format dates
  if (key === 'createdAt' || key === 'updatedAt') {
    return formatDate(value)
  }
  
  // Format currency
  if (key === 'fare' || key === 'tax' || key === 'discount' || key === 'totalFare') {
    return value.toString()
  }
  
  return value.toString()
}

// Export data as CSV
const exportAsCSV = (data: any[], fields: string[], includeHeaders: boolean) => {
  let csv = ''
  
  if (includeHeaders) {
    const headers = fields.map(field => {
      const fieldDef = exportFields.find(f => f.key === field)
      return fieldDef ? fieldDef.label : field
    })
    csv += headers.join(',') + '\n'
  }
  
  data.forEach(item => {
    const row = fields.map(field => {
      const value = getNestedValue(item, field)
      const formattedValue = formatValueForExport(value, field)
      
      if (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')) {
        return `"${formattedValue.replace(/"/g, '""')}"`
      }
      return formattedValue
    })
    csv += row.join(',') + '\n'
  })
  
  return csv
}

// Create and download a file
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export data
const exportData = async () => {
  if (selectedFields.value.length === 0) {
    toastMessage.value = 'Please select at least one field to export.'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    return
  }
  
  isExporting.value = true
  
  try {
    const dataToExport = exportOptions.value.onlyFiltered ? filteredDeliveries.value : deliveries.value
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    if (exportFormat.value === 'csv') {
      const csvContent = exportAsCSV(
        dataToExport, 
        selectedFields.value, 
        exportOptions.value.includeHeaders
      )
      
      downloadFile(csvContent, `deliveries-export-${timestamp}.csv`, 'text/csv')
      toastMessage.value = `Successfully exported ${dataToExport.length} deliveries to CSV.`
    } else {
      // For PDF, create HTML content (in real app, use proper PDF library)
      let html = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .title { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1 class="title">Deliveries Report</h1>
          <table>
      `
      
      if (exportOptions.value.includeHeaders) {
        html += '<tr>'
        selectedFields.value.forEach(field => {
          const fieldDef = exportFields.find(f => f.key === field)
          html += `<th>${fieldDef ? fieldDef.label : field}</th>`
        })
        html += '</tr>'
      }
      
      dataToExport.forEach(item => {
        html += '<tr>'
        selectedFields.value.forEach(field => {
          const value = getNestedValue(item, field)
          const formattedValue = formatValueForExport(value, field)
          html += `<td>${formattedValue}</td>`
        })
        html += '</tr>'
      })
      
      html += `
          </table>
          <p style="text-align: right; margin-top: 20px;">Generated on ${new Date().toLocaleString()}</p>
        </body>
        </html>
      `
      
      downloadFile(html, `deliveries-export-${timestamp}.html`, 'text/html')
      toastMessage.value = `Successfully exported ${dataToExport.length} deliveries to PDF.`
    }
    
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
    closeExportModal()
    
  } catch (error) {
    console.error('Error exporting data:', error)
    toastMessage.value = 'Failed to export data. Please try again.'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  } finally {
    isExporting.value = false
  }
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-NG', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}



const formatCADCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status: string) => {
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


const handlePageChange = async (page: number) => {
  await changePage(page)
}

definePageMeta({
  layout: 'dashboard'
})
</script>

<style>
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
