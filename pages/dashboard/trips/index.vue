<template>
  <div class="min-h-screen animate-fadeIn">
    <!-- {{filteredTrips}} -->
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
        :value="pagination.total" 
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
        <div class="flex items-center">
          <h2 class="text-lg font-medium text-gray-900 mb-2 md:mb-0 mr-4">Trip Management</h2>
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
        </div>
        <div class="relative">
          <input
            v-model="composableFilters.search"
            type="text"
            placeholder="Search trips, passengers, drivers..."
            class="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <IconSearch class="w-5 h-5" />
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        <p class="mt-2 text-gray-600">Loading trips...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="trips.length === 0" class="p-8 text-center">
        <IconInbox class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>

      <!-- Desktop List View -->
      <div v-else-if="viewMode === 'list'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="trip in trips"
              :key="trip._id"
              class="hover:bg-gray-50 transition-colors duration-150 animate-fadeIn"
            >
              <!-- Trip ID -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono text-gray-900">{{ formatTripId(trip._id) }}</div>
                <div class="text-xs text-gray-500">
                  <span v-if="trip.isPrivate" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    <IconLock class="h-3 w-3 mr-1" />
                    Private
                  </span>
                </div>
              </td>

              <!-- Passenger -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <IconUser class="h-5 w-5 text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getFullName(trip.primaryUserId) }}
                    </div>
                    <div class="text-sm text-gray-500">{{ trip.primaryUserId?.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Driver -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <IconUserCheck class="h-5 w-5 text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ getFullName(trip.driverId) }}
                    </div>
                    <div class="text-sm text-gray-500">{{ trip.driverId?.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Route -->
              <td class="px-6 py-4">
                <div class="max-w-xs">
                  <div class="flex items-center text-sm text-gray-900 mb-1">
                    <IconMapPin class="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span class="truncate">{{ getOriginAddress(trip) }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <IconFlag class="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                    <span class="truncate">{{ getDestinationAddress(trip) }}</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ getDistanceInfo(trip) }}
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="getStatusClass(trip.status)"
                >
                  <span class="w-2 h-2 rounded-full mr-1" :class="getStatusDotClass(trip.status)"></span>
                  {{ trip.status }}
                </span>
                <div v-if="trip.passengers.length > 0" class="text-xs text-gray-500 mt-1">
                  Passenger: {{ trip.passengers[0].passengerStatus }}
                </div>
              </td>

              <!-- Type -->
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

              <!-- Fare -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(getTotalFare(trip), getTotalFareCurrency(trip)) }}
                </div>
                <div class="text-xs text-gray-500">
                  CAD ${{ getTotalFareCAD(trip).toFixed(2) }}
                </div>
                <div v-if="hasDiscount(trip)" class="text-xs text-green-600">
                  Discount Applied
                </div>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{{ formatDate(trip.createdAt) }}</div>
                <div class="text-xs text-gray-400">
                  Updated: {{ formatRelativeTime(trip.updatedAt) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" @click.stop>
                <div class="relative inline-block text-left">
                  <button
                    @click.stop="toggleDropdown(trip._id)"
                    class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <IconMoreVertical class="h-5 w-5 text-gray-500" />
                  </button>

                  <div
                    v-if="activeDropdown === trip._id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                  >
                    <button
                      @click.stop="handleTripAction('view', trip)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconEye class="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    <button
                      v-if="canEditTrip(trip)"
                      @click.stop="handleTripAction('edit', trip)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconEdit class="h-4 w-4 mr-2" />
                      Edit Trip
                    </button>
                    <button
                      v-if="canCancelTrip(trip)"
                      @click.stop="handleTripAction('cancel', trip)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <IconX class="h-4 w-4 mr-2" />
                      Cancel Trip
                    </button>
                    <button
                      v-if="canRescheduleTrip(trip)"
                      @click.stop="handleTripAction('reschedule', trip)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconCalendar class="h-4 w-4 mr-2" />
                      Reschedule
                    </button>
                    <button
                      @click.stop="handleTripAction('invoice', trip)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconFileText class="h-4 w-4 mr-2" />
                      Generate Invoice
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grid View -->
      <div v-else class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="trip in trips"
          :key="trip._id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fadeIn relative hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-4">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="text-xs text-gray-500 font-mono mb-1">{{ formatTripId(trip._id) }}</div>
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
                <span
                  v-if="trip.isPrivate"
                  class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  <IconLock class="h-3 w-3 mr-1" />
                  Private
                </span>
              </div>
              <div class="relative">
                <button
                  @click.stop="toggleDropdown(trip._id)"
                  class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <IconMoreVertical class="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <!-- Passenger & Driver -->
            <div class="space-y-3 mb-4">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <IconUser class="h-4 w-4 text-gray-500" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ getFullName(trip.primaryUserId) }}</div>
                  <div class="text-xs text-gray-500">{{ trip.primaryUserId?.email }}</div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <IconUserCheck class="h-4 w-4 text-gray-500" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ getFullName(trip.driverId) }}</div>
                  <div class="text-xs text-gray-500">{{ trip.driverId?.email }}</div>
                </div>
              </div>
            </div>

            <!-- Route -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <IconMapPin class="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span class="text-sm truncate">{{ getOriginAddress(trip) }}</span>
              </div>
              <div class="flex items-center">
                <IconFlag class="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <span class="text-sm truncate">{{ getDestinationAddress(trip) }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
              <div class="flex items-center">
                <IconClock class="h-4 w-4 text-gray-400 mr-1" />
                <span class="text-xs text-gray-500">{{ formatRelativeTime(trip.createdAt) }}</span>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium">
                  {{ formatCurrency(getTotalFare(trip), getTotalFareCurrency(trip)) }}
                </div>
                <div class="text-xs text-gray-500">CAD ${{ getTotalFareCAD(trip).toFixed(2) }}</div>
              </div>
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
    
    <!-- Export Modal -->
    <ModulesTripsExportModal 
      v-if="showExportModal" 
      :show="showExportModal"
      @close="showExportModal = false"
      @export="handleExport"
    />

    <!-- Cancel Trip Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="showCancelModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="showCancelModal = false"
      >
        <div 
          class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-slideIn"
        >
          <div class="p-6">
            <div class="flex items-center justify-center mb-4">
              <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <IconAlertTriangle class="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 class="text-lg font-medium text-center text-gray-900 mb-2">Cancel Trip</h3>
            <p class="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to cancel this trip? This action cannot be undone.
            </p>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
              <textarea 
                v-model="cancellationReason" 
                rows="3" 
                class="w-full rounded-md border-gray-300 border p-2.5 text-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="Please provide a reason for cancellation..."
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button 
                @click="showCancelModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button 
                @click="confirmCancelTrip"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 flex items-center"
                :disabled="isCancelling"
              >
                <span v-if="isCancelling" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </span>
                <span v-else>Proceed to Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Reschedule Trip Modal -->
    <Teleport to="body">
      <div 
        v-if="showRescheduleModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="showRescheduleModal = false"
      >
        <div 
          class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-slideIn"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Reschedule Trip</h3>
              <button 
                @click="showRescheduleModal = false"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <IconX class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Schedule</label>
              <div class="text-sm text-gray-500 p-2 bg-gray-50 rounded-md">
                {{ selectedTrip?.scheduledFor ? formatDate(selectedTrip.scheduledFor) : 'Not scheduled' }}
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">New Date & Time</label>
              <input 
                v-model="newScheduleDate" 
                type="date" 
                class="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 mb-2"
              />
              <input 
                v-model="newScheduleTime" 
                type="time" 
                class="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Rescheduling</label>
              <textarea 
                v-model="rescheduleReason" 
                rows="2" 
                class="w-full rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="Please provide a reason for rescheduling..."
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="showRescheduleModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button 
                @click="confirmRescheduleTrip"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
                :disabled="isRescheduling || !newScheduleDate || !newScheduleTime"
              >
                <span v-if="isRescheduling" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </span>
                <span v-else>Reschedule Trip</span>
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
        <IconCheckCircle class="h-5 w-5 mr-2" />
        <span>{{ toastMessage }}</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGetTrips } from "@/composables/modules/trips/useGetTrips"
import { useCancelTrip } from "@/composables/modules/trips/useCancelTrip"
import { useRescheduleTrip } from "@/composables/modules/trips/useRescheduleTrip"
import { useRouter } from 'vue-router'

const {
  loading,
  trips,
  pagination,
  filters: composableFilters,
  changePage,
  updateFilter,
  clearFilters,
} = useGetTrips()
const { loading: cancelling, cancelTrip } = useCancelTrip()
const { loading: rescheduling, rescheduleTrip } = useRescheduleTrip()

const activeDropdown = ref<string | null>(null)
const scheduledFilter = ref("")
const privacyFilter = ref("")

const sortColumn = ref('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')
const showExportModal = ref(false)
const viewMode = ref<'list' | 'grid'>('list')

// Computed properties
const scheduledTripsCount = computed(() => trips.value.filter((trip) => trip.isScheduled).length)

// Watchers for filter conversions
watch(scheduledFilter, (newValue) => {
  if (newValue === "scheduled") {
    updateFilter("isScheduled", true)
  } else if (newValue === "immediate") {
    updateFilter("isScheduled", false)
  } else {
    updateFilter("isScheduled", undefined)
  }
})

watch(privacyFilter, (newValue) => {
  if (newValue === "private") {
    updateFilter("isPrivate", true)
  } else if (newValue === "public") {
    updateFilter("isPrivate", false)
  } else {
    updateFilter("isPrivate", undefined)
  }
})


import { 
  Search as IconSearch, 
  MoreVertical as IconMoreVertical,
  Eye as IconEye,
  Edit as IconEdit,
  X as IconX,
  Calendar as IconCalendar,
  FileText as IconFileText,
  User as IconUser,
  UserCheck as IconUserCheck,
  MapPin as IconMapPin,
  Flag as IconFlag,
  Clock as IconClock,
  ChevronUp as IconChevronUp,
  ChevronDown as IconChevronDown,
  ChevronsUpDown as IconChevronsUpDown,
  Inbox as IconInbox,
  Grid as IconGrid,
  List as IconList,
  AlertTriangle as IconAlertTriangle,
  CheckCircle as IconCheckCircle,
  ChevronLeft, 
  ChevronRight, 
  User
} from 'lucide-vue-next'

// Types
interface I_User {
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
  passengerId: I_User
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
  primaryUserId: I_User
  driverId: I_User
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
const searchQuery = ref('')
const filters = ref({
  type: '',
  status: '',
  scheduled: '',
  startDate: null as Date | null,
  endDate: null as Date | null
})


// Cancel Trip Modal State
const showCancelModal = ref(false)
const selectedTrip = ref<Trip | null>(null)
const cancellationReason = ref('')
const isCancelling = computed(() => cancelling.value)

// Reschedule Trip Modal State
const showRescheduleModal = ref(false)
const newScheduleDate = ref('')
const newScheduleTime = ref('')
const rescheduleReason = ref('')
const isRescheduling = computed(() => rescheduling.value)

// Toast State
const showToast = ref(false)
const toastMessage = ref('')

// Table headers - Updated to include Trip ID
const tableHeaders = [
  { key: '_id', label: 'Trip ID', sortable: true },
  { key: 'primaryUserId', label: 'Passenger', sortable: false },
  { key: 'driverId', label: 'Driver', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'fare', label: 'Fare', sortable: true },
  { key: 'createdAt', label: 'Date', sortable: true }
]

// Computed properties
const scheduledTrips = computed(() => {
  return trips.value.filter(trip => trip.isScheduled).length
})

const formatTripId = (id: string): string => {
  return id.slice(-8).toUpperCase()
}

// Trip action permissions
const canEditTrip = (trip: Trip): boolean => {
  return !["completed", "cancelled"].includes(trip.status)
}

const canCancelTrip = (trip: Trip): boolean => {
  return !["completed", "cancelled"].includes(trip.status)
}

const canRescheduleTrip = (trip: Trip): boolean => {
  return trip.isScheduled && !["completed", "cancelled"].includes(trip.status)
}


// Mobile detection
const $isMobile = computed(() => {
  return window.innerWidth < 768
})

// Helper methods
const getFullName = (user: I_User | null | undefined) => {
  if (!user || !user.firstName || !user.lastName) return null
  return `${user.firstName} ${user.lastName}`
}

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

const getDistanceInfo = (trip: Trip): string => {
  const passenger = trip.passengers?.[0]
  if (!passenger?.origin?.geometry?.coordinates || !passenger?.destination?.geometry?.coordinates) {
    return "Distance: N/A"
  }

  // Calculate approximate distance (this is a simplified calculation)
  const [lon1, lat1] = passenger.origin.geometry.coordinates
  const [lon2, lat2] = passenger.destination.geometry.coordinates
  const distance = Math.sqrt(Math.pow(lon2 - lon1, 2) + Math.pow(lat2 - lat1, 2)) * 111 // Rough km conversion
  return `~${distance.toFixed(1)} km`
}


const getOriginAddress = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers[0].origin.properties.address || 'Nil'
  }
  return 'Nil'
}

const getDestinationAddress = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers[0].destination.properties.address || 'Nil'
  }
  return 'Nil'
}


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

const getTotalFare = (trip: Trip): number => {
  return trip.passengers?.[0]?.totalFare?.priceInUserCurrency || 0
}

const getTotalFareCAD = (trip: Trip): number => {
  return trip.passengers?.[0]?.totalFare?.priceInCAD || 0
}

const getTotalFareCurrency = (trip: Trip): string => {
  return trip.passengers?.[0]?.totalFare?.currencySymbol || "NGN"
}

const hasDiscount = (trip: Trip): boolean => {
  return (trip.passengers?.[0]?.discount?.priceInUserCurrency || 0) > 0
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

const formatDate = (dateString: string) => {
  if (!dateString) return 'Nil'
  
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

const getStatusDotClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    pending: "bg-yellow-400",
    active: "bg-blue-400",
    completed: "bg-green-400",
    cancelled: "bg-red-400",
    "in-progress": "bg-indigo-400",
  }
  return statusClasses[status] || "bg-gray-400"
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

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}

// Toggle dropdown and ensure only one is open at a time
const toggleDropdown = (tripId: string) => {
  event?.stopPropagation()
  
  if (activeDropdown.value === tripId) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = tripId
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (activeDropdown.value) {
    activeDropdown.value = null
  }
}

const handleTripAction = (action: string, trip: Trip) => {
  console.log(`Action ${action} for trip ${trip._id}`)
  
  activeDropdown.value = null
  
  switch (action) {
    case 'view':
      navigateToTripDetails(trip._id)
      break
    case 'edit':
      // Open edit modal
      break
    case 'cancel':
      openCancelModal(trip)
      break
    case 'reschedule':
      openRescheduleModal(trip)
      break
    case 'invoice':
      // Generate and download invoice
      break
  }
}

const filteredTrips = computed(() => {
  let filtered = [...trips.value]

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(trip => {
      // Search in trip ID
      if (trip._id?.toLowerCase().includes(query)) return true
      
      // Search in passenger details
      if (trip.primaryUserId) {
        const passengerName = getFullName(trip.primaryUserId)?.toLowerCase()
        const passengerEmail = trip.primaryUserId.email?.toLowerCase()
        if (passengerName?.includes(query) || passengerEmail?.includes(query)) return true
      }
      
      // Search in driver details
      if (trip.driverId) {
        const driverName = getFullName(trip.driverId)?.toLowerCase()
        const driverEmail = trip.driverId.email?.toLowerCase()
        if (driverName?.includes(query) || driverEmail?.includes(query)) return true
      }
      
      // Search in addresses
      const origin = getOriginAddress(trip)?.toLowerCase()
      const destination = getDestinationAddress(trip)?.toLowerCase()
      if (origin?.includes(query) || destination?.includes(query)) return true
      
      // Search in status and type
      if (trip.status?.toLowerCase().includes(query) || trip.type?.toLowerCase().includes(query)) return true
      
      return false
    })
  }

  // Filter by trip type
  if (filters.value.type) {
    filtered = filtered.filter(trip => trip.type === filters.value.type)
  }

  // Filter by status
  if (filters.value.status) {
    filtered = filtered.filter(trip => trip.status === filters.value.status)
  }

  // Filter by scheduling
  if (filters.value.scheduled) {
    if (filters.value.scheduled === 'scheduled') {
      filtered = filtered.filter(trip => trip.isScheduled === true)
    } else if (filters.value.scheduled === 'immediate') {
      filtered = filtered.filter(trip => trip.isScheduled === false)
    }
  }

  // Filter by date range
  if (filters.value.startDate || filters.value.endDate) {
    filtered = filtered.filter(trip => {
      const tripDate = new Date(trip.createdAt)
      
      if (filters.value.startDate && filters.value.endDate) {
        const startDate = new Date(filters.value.startDate)
        const endDate = new Date(filters.value.endDate)
        endDate.setHours(23, 59, 59, 999) // Include the entire end date
        return tripDate >= startDate && tripDate <= endDate
      } else if (filters.value.startDate) {
        const startDate = new Date(filters.value.startDate)
        return tripDate >= startDate
      } else if (filters.value.endDate) {
        const endDate = new Date(filters.value.endDate)
        endDate.setHours(23, 59, 59, 999)
        return tripDate <= endDate
      }
      
      return true
    })
  }

  // Apply sorting
  if (sortColumn.value) {
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortColumn.value) {
        case '_id':
          aValue = a._id || ''
          bValue = b._id || ''
          break
        case 'status':
          aValue = a.status || ''
          bValue = b.status || ''
          break
        case 'type':
          aValue = a.type || ''
          bValue = b.type || ''
          break
        case 'fare':
          aValue = getTotalFare(a)
          bValue = getTotalFare(b)
          break
        case 'createdAt':
          aValue = new Date(a.createdAt || 0)
          bValue = new Date(b.createdAt || 0)
          break
        default:
          return 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return sortDirection.value === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection.value === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  return filtered
})

const navigateToTripDetails = (tripId: string) => {
  router.push(`/dashboard/trips/${tripId}`)
}

// Cancel Trip Functions
const openCancelModal = (trip: Trip) => {
  selectedTrip.value = trip
  cancellationReason.value = ''
  showCancelModal.value = true
}

const confirmCancelTrip = async () => {
  if (!selectedTrip.value) return
  
  try {
    await cancelTrip(selectedTrip.value._id, cancellationReason.value)
    
    toastMessage.value = 'Trip cancelled successfully'
    showToast.value = true
    showCancelModal.value = false
    
    setTimeout(() => {
      showToast.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Error cancelling trip:', error)
    
    toastMessage.value = 'Failed to cancel trip. Please try again.'
    showToast.value = true
    
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

// Reschedule Trip Functions
const openRescheduleModal = (trip: Trip) => {
  selectedTrip.value = trip
  
  if (trip.scheduledFor) {
    const scheduledDate = new Date(trip.scheduledFor)
    newScheduleDate.value = scheduledDate.toISOString().split('T')[0]
    
    const hours = scheduledDate.getHours().toString().padStart(2, '0')
    const minutes = scheduledDate.getMinutes().toString().padStart(2, '0')
    newScheduleTime.value = `${hours}:${minutes}`
  } else {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    newScheduleDate.value = tomorrow.toISOString().split('T')[0]
    newScheduleTime.value = '09:00'
  }
  
  rescheduleReason.value = ''
  showRescheduleModal.value = true
}

const confirmRescheduleTrip = async () => {
  if (!selectedTrip.value || !newScheduleDate.value || !newScheduleTime.value) return
  
  try {
    const newScheduleDateTime = new Date(`${newScheduleDate.value}T${newScheduleTime.value}:00`)
    
    await rescheduleTrip(
      selectedTrip.value._id, 
      newScheduleDateTime.toISOString(), 
      rescheduleReason.value
    )
    
    toastMessage.value = 'Trip rescheduled successfully'
    showToast.value = true
    showRescheduleModal.value = false
    
    setTimeout(() => {
      showToast.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Error rescheduling trip:', error)
    
    toastMessage.value = 'Failed to reschedule trip. Please try again.'
    showToast.value = true
    
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
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
  const data = trips.value.map(trip => {
    const row: Record<string, any> = {}
    
    if (selectedColumns.includes('id')) {
      row['Trip ID'] = trip._id || 'Nil'
    }
    
    if (selectedColumns.includes('passenger')) {
      row['Passenger'] = getFullName(trip?.primaryUserId) || 'Nil'
      row['Passenger Email'] = trip?.primaryUserId?.email || 'Nil'
    }
    
    if (selectedColumns.includes('driver')) {
      row['Driver'] = getFullName(trip?.driverId) || 'Nil'
      row['Driver Email'] = trip.driverId?.email || 'Nil'
    }
    
    if (selectedColumns.includes('status')) {
      row['Status'] = trip?.status || 'Nil'
    }
    
    if (selectedColumns.includes('type')) {
      row['Type'] = trip.type || 'Nil'
      row['Scheduled'] = trip?.isScheduled ? 'Yes' : 'No'
    }
    
    if (selectedColumns.includes('fare')) {
      row['Fare'] = getTotalFare(trip)
    }
    
    if (selectedColumns.includes('date')) {
      row['Date'] = trip?.createdAt ? new Date(trip.createdAt).toLocaleString() : 'Nil'
    }
    
    if (selectedColumns.includes('origin')) {
      row['Origin'] = getOriginAddress(trip)
    }
    
    if (selectedColumns.includes('destination')) {
      row['Destination'] = getDestinationAddress(trip)
    }
    
    return row
  })
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')
  
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
  console.log('PDF export would be implemented with a PDF generation library')
  alert('PDF export functionality would be implemented with a PDF generation library')
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

import { definePageMeta } from '#imports'

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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-slideIn {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

