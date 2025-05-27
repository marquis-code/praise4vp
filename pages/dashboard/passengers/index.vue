<template>
  <div class="min-h-screen animate-fadeIn">
    <ModulesPassengersPageHeader 
      title="Passengers" 
      description="Manage and monitor all ride-hailing service passengers"
    />
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn">
      <ModulesPassengersStatsCard 
        title="Total Passengers" 
        :value="passengersList.length" 
        icon="user" 
        color="primary"
      />
      <ModulesPassengersStatsCard 
        title="Verified Passengers" 
        :value="verifiedPassengersCount" 
        icon="users" 
        color="green"
        :change="8"
      />
      <ModulesPassengersStatsCard 
        title="Email Verified" 
        :value="emailVerifiedCount" 
        icon="user" 
        color="blue"
        :change="12"
      />
      <ModulesPassengersStatsCard 
        title="Total Balance" 
        :value="totalBalance" 
        icon="wallet" 
        color="yellow"
        :change="5"
      />
    </div>
    
    <!-- Filters -->
    <ModulesPassengersFilter 
      :auth-providers="uniqueAuthProviders"
      v-model:filters="filters"
    />
    
    <!-- Search and Actions -->
    <div class="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 justify-between mb-6">
      <div class="relative mb-4 md:mb-0 md:w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search passengers..."
          class="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        />
        <span class="absolute left-3 top-2.5 text-gray-400">
          <Search class="w-5 h-5" />
        </span>
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
        
        <button 
          @click="showExportModal = true"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
        >
          <Download class="h-4 w-4 mr-2" />
          Export
        </button>
        
        <!-- <button 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
        >
          <Plus class="h-4 w-4 mr-2" />
          Add Passenger
        </button> -->
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="fetchingPassengers" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredPassengers.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <UserX class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-lg font-medium text-gray-900">No passengers found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
    </div>
    
    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <div 
        v-for="passenger in paginatedPassengers" 
        :key="passenger._id" 
        class="bg-white rounded-lg shadow overflow-hidden relative"
      >
        <!-- Passenger Card Content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  v-if="passenger.photoURL" 
                  :src="passenger.photoURL" 
                  :alt="`${passenger.firstName} ${passenger.lastName}`"
                  class="h-full w-full object-cover"
                />
                <User v-else class="h-full w-full p-2 text-gray-500" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ passenger.firstName }} {{ passenger.lastName }}</h3>
                <div class="flex items-center">
                  <span class="text-sm text-gray-500">{{ formatDate(passenger.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Actions Dropdown -->
            <div class="relative">
              <button 
                @click="toggleDropdown(passenger._id)"
                class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <MoreVertical class="h-5 w-5 text-gray-500" />
              </button>
              
              <div 
                v-if="activeDropdown === passenger._id"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
              >
                <button 
                  @click="viewPassengerDetails(passenger)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Eye class="h-4 w-4 mr-2" />
                  View Details
                </button>
                <button 
                  @click="editPassenger(passenger)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Edit class="h-4 w-4 mr-2" />
                  Edit Passenger
                </button>
                <button 
                  @click="showDisableConfirmation(passenger)"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <Ban class="h-4 w-4 mr-2" />
                  Disable Account
                </button>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">Email</p>
              <p class="text-sm font-medium">{{ passenger.email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Phone</p>
              <p class="text-sm font-medium">{{ passenger.phone || 'Not provided' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Auth Provider</p>
              <p class="text-sm font-medium capitalize">{{ passenger.authProvider }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">Wallet Balance</p>
              <p class="text-sm font-medium">{{ formatCurrency(passenger.walletBalance) }}</p>
            </div>
          </div>
          
          <div class="flex items-center text-sm text-gray-500">
            <span class="inline-flex items-center">
              <span 
                class="w-2 h-2 rounded-full mr-1"
                :class="passenger.isDisabled ? 'bg-red-500' : 'bg-green-500'"
              ></span>
              {{ passenger.isDisabled ? 'Disabled' : 'Active' }}
            </span>
          </div>
        </div>
        
        <div class="px-6 py-3 bg-gray-50 flex justify-end">
          <button 
            @click="viewPassengerDetails(passenger)"
            class="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150"
          >
            View Details
          </button>
        </div>
        
        <!-- Verification Badge -->
        <div 
          v-if="passenger.IDIsVerified" 
          class="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
        >
          <CheckCircle class="h-3 w-3 mr-1" />
          Verified
        </div>
      </div>
    </div>
    
    <!-- List View -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto animate-fadeIn">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Passenger
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Auth Provider
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Wallet
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="passenger in paginatedPassengers" :key="passenger._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm">{{ passenger._id }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    v-if="passenger.photoURL" 
                    :src="passenger.photoURL" 
                    :alt="`${passenger.firstName} ${passenger.lastName}`"
                    class="h-full w-full object-cover"
                  />
                  <User v-else class="h-full w-full p-2 text-gray-500" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ passenger.firstName }} {{ passenger.lastName }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatDate(passenger.createdAt) }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ passenger.email }}</div>
              <div class="text-xs text-gray-500">{{ passenger.phone || 'No phone' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="passenger.IDIsVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ passenger.IDIsVerified ? 'Verified' : 'Unverified' }}
              </span>
              <span 
                v-if="passenger.isDisabled"
                class="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
              >
                Disabled
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
              {{ passenger.authProvider }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatCurrency(passenger.walletBalance) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="relative inline-block text-left">
                <button 
                  @click="toggleDropdown(passenger._id)"
                  class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <MoreVertical class="h-5 w-5 text-gray-500" />
                </button>
                
                <div 
                  v-if="activeDropdown === passenger._id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                >
                  <button 
                    @click="viewPassengerDetails(passenger)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Eye class="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button 
                    @click="editPassenger(passenger)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit class="h-4 w-4 mr-2" />
                    Edit Passenger
                  </button>
                  <button 
                    @click="showDisableConfirmation(passenger)"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <Ban class="h-4 w-4 mr-2" />
                    Disable Account
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
    
    <!-- Disable Confirmation Modal -->
    <Teleport to="body">
      <div 
        v-if="showModal" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-center mb-4">
              <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle class="h-6 w-6 text-red-600" />
              </div>
            </div>
            <h3 class="text-lg font-medium text-center text-gray-900 mb-2">Disable Account</h3>
            <p class="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to disable 
              <span class="font-medium text-gray-900">{{ selectedPassenger?.firstName }} {{ selectedPassenger?.lastName }}</span>'s account? 
              This will prevent them from using the service.
            </p>
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button 
                @click="disableAccount"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                :class="{ 'opacity-50 cursor-not-allowed': isDisabling }"
                :disabled="isDisabling"
              >
                <span v-if="isDisabling" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </span>
                <span v-else>Disable Account</span>
              </button>
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
              <h3 class="text-lg font-medium text-gray-900">Export Passengers Data</h3>
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
                <!-- Personal Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Personal Information</h4>
                  <div v-for="field in personalFields" :key="field.key" class="flex items-center">
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
                
                <!-- Account Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Account Information</h4>
                  <div v-for="field in accountFields" :key="field.key" class="flex items-center">
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
                
                <!-- Verification Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Verification Information</h4>
                  <div v-for="field in verificationFields" :key="field.key" class="flex items-center">
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
                  <span class="ml-2 text-sm text-gray-700">Export Only Filtered Passengers</span>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  Search, Download, Plus, UserX, ChevronLeft, ChevronRight, ChevronDown,
  MoreVertical, Eye, Edit, Ban, User, CheckCircle, Grid, List, AlertTriangle, X
} from 'lucide-vue-next';
import { useGetPassengers } from "@/composables/modules/passengers/useGetPassengers";
import { Passenger } from '@/types/passenger';
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'dashboard'
});

const { loading: fetchingPassengers, passengers: passengersList, pagination, changePage } = useGetPassengers();

// View mode
const viewMode = ref<'grid' | 'list'>('list');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 9;

// Search and filters
const searchQuery = ref('');
const filters = ref({
  authProvider: '',
  verificationStatus: '',
  emailVerified: '',
  sortBy: 'walletBalance'
});

// Dropdown state
const activeDropdown = ref<string | null>(null);

// Modal state
const showModal = ref(false);
const selectedPassenger = ref<Passenger | null>(null);
const isDisabling = ref(false);

// Export modal state
const showExportModal = ref(false);
const exportFormat = ref<'csv' | 'pdf'>('csv');
const isExporting = ref(false);
const selectedFields = ref<string[]>([
  'firstName', 'lastName', 'email', 'phone', 'walletBalance'
]);
const exportOptions = ref({
  includeHeaders: true,
  onlyFiltered: false
});

// Toast state
const showToast = ref(false);
const toastMessage = ref('');

// Export field definitions
const personalFields = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'createdAt', label: 'Registration Date' }
];

const accountFields = [
  { key: 'walletBalance', label: 'Wallet Balance' },
  { key: 'authProvider', label: 'Auth Provider' },
  { key: 'isDisabled', label: 'Account Status' },
  { key: 'currentRegistrationStep', label: 'Registration Step' }
];

const verificationFields = [
  { key: 'IDIsVerified', label: 'ID Verified' },
  { key: 'IDVerificationStatus', label: 'ID Verification Status' },
  { key: 'emailIsVerified', label: 'Email Verified' },
  { key: 'phoneIsVerified', label: 'Phone Verified' }
];

// All available fields
const allFields = computed(() => [
  ...personalFields,
  ...accountFields,
  ...verificationFields
]);

// Check if all fields are selected
const allFieldsSelected = computed(() => {
  return selectedFields.value.length === allFields.value.length;
});

// Computed properties
const filteredPassengers = computed(() => {
  let result = [...passengersList.value];
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(passenger => 
      passenger.firstName.toLowerCase().includes(query) ||
      passenger.lastName.toLowerCase().includes(query) ||
      passenger.email.toLowerCase().includes(query)
    );
  }
  
  // Apply filters
  if (filters.value.authProvider) {
    result = result.filter(passenger => passenger.authProvider === filters.value.authProvider);
  }
  
  if (filters.value.verificationStatus) {
    result = result.filter(passenger => passenger.IDVerificationStatus === filters.value.verificationStatus);
  }
  
  if (filters.value.emailVerified) {
    const isVerified = filters.value.emailVerified === 'true';
    result = result.filter(passenger => passenger.emailIsVerified === isVerified);
  }
  
  // Apply sorting
  switch (filters.value.sortBy) {
    case 'walletBalance':
      result.sort((a, b) => b.walletBalance - a.walletBalance);
      break;
    case 'name':
      result.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
  }
  
  return result;
});

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}

const paginatedPassengers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPassengers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPassengers.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage;
  return end > filteredPassengers.value.length ? filteredPassengers.value.length : end;
});

const uniqueAuthProviders = computed(() => {
  const providers = new Set<string>();
  passengersList.value.forEach(passenger => {
    if (passenger.authProvider) {
      providers.add(passenger.authProvider);
    }
  });
  return Array.from(providers);
});

const verifiedPassengersCount = computed(() => {
  return passengersList.value.filter(passenger => passenger.IDIsVerified).length;
});

const emailVerifiedCount = computed(() => {
  return passengersList.value.filter(passenger => passenger.emailIsVerified).length;
});

const totalBalance = computed(() => {
  const total = passengersList.value.reduce((sum, passenger) => sum + passenger.walletBalance, 0);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(total);
});

// Reset pagination when filters change
watch([filters, searchQuery], () => {
  currentPage.value = 1;
}, { deep: true });

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (activeDropdown.value) {
    activeDropdown.value = null;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const toggleDropdown = (passengerId: string) => {
  // Stop event propagation to prevent immediate closing
  event?.stopPropagation();
  
  if (activeDropdown.value === passengerId) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = passengerId;
  }
};

const viewPassengerDetails = (passenger: Passenger) => {
  activeDropdown.value = null;
  // Navigate to passenger details page
  console.log('View passenger details:', passenger._id);
  navigateTo(`/dashboard/passengers/${passenger._id}`);
};

const editPassenger = (passenger: Passenger) => {
  activeDropdown.value = null;
  // Navigate to edit passenger page
  console.log('Edit passenger:', passenger._id);
  // navigateTo(`/passengers/${passenger._id}/edit`);
};

const showDisableConfirmation = (passenger: Passenger) => {
  activeDropdown.value = null;
  selectedPassenger.value = passenger;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    selectedPassenger.value = null;
  }, 300);
};

const disableAccount = async () => {
  if (!selectedPassenger.value) return;
  
  isDisabling.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Make actual API call here
    // const response = await fetch(`/api/passengers/${selectedPassenger.value._id}/disable`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to disable passenger account');
    // }
    
    // Show success toast
    toastMessage.value = `${selectedPassenger.value.firstName} ${selectedPassenger.value.lastName}'s account has been disabled.`;
    showToast.value = true;
    
    // Close modal
    closeModal();
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
    
    // Update local state (in a real app, you'd refetch the data)
    const index = passengersList.value.findIndex(p => p._id === selectedPassenger.value?._id);
    if (index !== -1) {
      passengersList.value[index].isDisabled = true;
    }
    
  } catch (error) {
    console.error('Error disabling passenger account:', error);
    toastMessage.value = 'Failed to disable account. Please try again.';
    showToast.value = true;
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  } finally {
    isDisabling.value = false;
  }
};

// Export functionality
const closeExportModal = () => {
  showExportModal.value = false;
};

const toggleAllFields = () => {
  if (allFieldsSelected.value) {
    selectedFields.value = [];
  } else {
    selectedFields.value = allFields.value.map(field => field.key);
  }
};

// Get nested property value from object using dot notation
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj);
};

// Format value for export
const formatValueForExport = (value: any, key: string) => {
  if (value === null || value === undefined) return '';
  
  // Format dates
  if (key === 'createdAt' || key === 'updatedAt' || key === 'dob') {
    return formatDate(value);
  }
  
  // Format currency
  if (key === 'walletBalance') {
    return value.toString();
  }
  
  // Format booleans
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return value.toString();
};

// Export data as CSV
const exportAsCSV = (data: any[], fields: string[], includeHeaders: boolean) => {
  // Create headers row if needed
  let csv = '';
  
  if (includeHeaders) {
    const headers = fields.map(field => {
      // Find the field label
      const fieldDef = allFields.value.find(f => f.key === field);
      return fieldDef ? fieldDef.label : field;
    });
    csv += headers.join(',') + '\n';
  }
  
  // Add data rows
  data.forEach(item => {
    const row = fields.map(field => {
      const value = getNestedValue(item, field);
      const formattedValue = formatValueForExport(value, field);
      
      // Escape commas and quotes
      if (formattedValue.includes(',') || formattedValue.includes('"') || formattedValue.includes('\n')) {
        return `"${formattedValue.replace(/"/g, '""')}"`;
      }
      return formattedValue;
    });
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

// Create and download a file
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate PDF content
const generatePDFContent = async (data: any[], fields: string[], includeHeaders: boolean) => {
  // This is a placeholder for PDF generation
  // In a real implementation, you would use a library like jspdf or pdfmake
  
  // For demonstration purposes, we'll create a simple HTML structure
  // that could be converted to PDF with a proper library
  
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
      <h1 class="title">Passengers Report</h1>
      <table>
  `;
  
  // Add headers if needed
  if (includeHeaders) {
    html += '<tr>';
    fields.forEach(field => {
      const fieldDef = allFields.value.find(f => f.key === field);
      html += `<th>${fieldDef ? fieldDef.label : field}</th>`;
    });
    html += '</tr>';
  }
  
  // Add data rows
  data.forEach(item => {
    html += '<tr>';
    fields.forEach(field => {
      const value = getNestedValue(item, field);
      const formattedValue = formatValueForExport(value, field);
      html += `<td>${formattedValue}</td>`;
    });
    html += '</tr>';
  });
  
  html += `
      </table>
      <p style="text-align: right; margin-top: 20px;">Generated on ${new Date().toLocaleString()}</p>
    </body>
    </html>
  `;
  
  return html;
};

// Export data
const exportData = async () => {
  if (selectedFields.value.length === 0) {
    toastMessage.value = 'Please select at least one field to export.';
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
    return;
  }
  
  isExporting.value = true;
  
  try {
    // Determine which data to export
    const dataToExport = exportOptions.value.onlyFiltered ? filteredPassengers.value : passengersList.value;
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (exportFormat.value === 'csv') {
      // Export as CSV
      const csvContent = exportAsCSV(
        dataToExport, 
        selectedFields.value, 
        exportOptions.value.includeHeaders
      );
      
      downloadFile(csvContent, `passengers-export-${timestamp}.csv`, 'text/csv');
      
      toastMessage.value = `Successfully exported ${dataToExport.length} passengers to CSV.`;
    } else {
      // Export as PDF
      // In a real implementation, you would use a PDF library
      // For this example, we'll generate HTML that could be converted to PDF
      const pdfContent = await generatePDFContent(
        dataToExport,
        selectedFields.value,
        exportOptions.value.includeHeaders
      );
      
      // For demonstration, we'll download this as an HTML file
      // In a real app, you would convert this to PDF using a library
      downloadFile(pdfContent, `passengers-export-${timestamp}.html`, 'text/html');
      
      toastMessage.value = `Successfully exported ${dataToExport.length} passengers to PDF.`;
    }
    
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
    closeExportModal();
    
  } catch (error) {
    console.error('Error exporting data:', error);
    toastMessage.value = 'Failed to export data. Please try again.';
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
  } finally {
    isExporting.value = false;
  }
};

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
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