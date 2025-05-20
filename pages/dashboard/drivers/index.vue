<template>
  <div class="min-h-screen animate-fadeIn">
    <ModulesDriversPageHeader 
      title="Drivers" 
      description="Manage and monitor all ride-hailing service drivers"
    />
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn">
      <ModulesDriversStatsCard 
        title="Total Drivers" 
        :value="driversList.length" 
        icon="car" 
        color="primary"
      />
      <ModulesDriversStatsCard 
        title="Average Rating" 
        :value="averageRating" 
        icon="star" 
        color="yellow"
      />
      <ModulesDriversStatsCard 
        title="Verified Drivers" 
        :value="verifiedDriversCount" 
        icon="users" 
        color="green"
        :change="12"
      />
      <ModulesDriversStatsCard 
        title="Total Earnings" 
        :value="totalEarnings" 
        icon="wallet" 
        color="blue"
        :change="8"
      />
    </div>
    
    <!-- Filters -->
    <ModulesDriversFilter 
      :car-brands="uniqueCarBrands"
      :car-colors="uniqueCarColors"
      :verification-statuses="verificationStatuses"
      v-model:filters="filters"
    />
    
    <!-- Search and Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div class="relative mb-4 md:mb-0 md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search drivers..."
          class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
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
          Add Driver
        </button> -->
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="fetchingDrivers" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredDrivers.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <UserX class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-lg font-medium text-gray-900">No drivers found</h3>
      <p class="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria to find what you're looking for.
      </p>
    </div>
    
    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <ModulesDriversCard 
        v-for="driver in paginatedDrivers" 
        :key="driver._id" 
        :driver="driver"
      />
    </div>
    
    <!-- List View -->
    <div v-else class="bg-white rounded-lg overflow-x-auto shadow overflow-hidden animate-fadeIn">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driver
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Car Details
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
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
          <tr v-for="driver in paginatedDrivers" :key="driver._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <!-- <img 
                    v-if="driver.photoURL" 
                    :src="driver.photoURL" 
                    :alt="`${driver.firstName} ${driver.lastName}`"
                    class="h-full w-full object-cover"
                  /> -->
                  <img 
                    v-if="driver.photoURL" 
                    src="@/assets/img/avatar-male.svg" 
                    :alt="`${driver.firstName} ${driver.lastName}`"
                    class="h-full w-full object-cover"
                  />
                  <User v-else class="h-full w-full p-2 text-gray-500" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ driver.firstName }} {{ driver.lastName }}
                  </div>
                  <div class="flex items-center">
                    <Star class="h-3 w-3 text-yellow-400 mr-1" :fill="true" />
                    <span class="text-xs text-gray-500">{{ driver.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ driver.driverData.carBrand }} {{ driver.driverData.carModel }}</div>
              <div class="text-xs text-gray-500">
                {{ driver.driverData.carColor }} {{ driver.driverData.carYear }} • {{ driver.driverData.plateNumber }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ driver.phone }}</div>
              <div class="text-xs text-gray-500">{{ driver.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="driver.IDIsVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ driver.IDIsVerified ? 'Verified' : 'Pending' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatCurrency(driver.driverData.walletBalance) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="relative inline-block text-left">
                <button 
                  @click="toggleDropdown(driver._id)"
                  class="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <MoreVertical class="h-5 w-5 text-gray-500" />
                </button>
                
                <div 
                  v-if="activeDropdown === driver._id"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
                >
                  <button 
                    @click="viewDriverDetails(driver)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Eye class="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button 
                    @click="editDriver(driver)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit class="h-4 w-4 mr-2" />
                    Edit Driver
                  </button>
                  <button 
                    @click="showBanConfirmation(driver)"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <Ban class="h-4 w-4 mr-2" />
                    Ban Driver
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredDrivers.length }}</span> drivers
      </div>
      <div class="flex space-x-2">
        <button 
          @click="prevPage"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          :disabled="currentPage === 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          <ChevronLeft class="mr-2 h-4 w-4" />
          Previous
        </button>
        <button 
          @click="nextPage"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          :disabled="currentPage >= totalPages"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
        >
          Next
          <ChevronRight class="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
    
    <!-- Ban Confirmation Modal -->
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
            <h3 class="text-lg font-medium text-center text-gray-900 mb-2">Ban Driver</h3>
            <p class="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to ban 
              <span class="font-medium text-gray-900">{{ selectedDriver?.firstName }} {{ selectedDriver?.lastName }}</span>? 
              This action cannot be undone.
            </p>
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button 
                @click="banDriver"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                :class="{ 'opacity-50 cursor-not-allowed': isBanning }"
                :disabled="isBanning"
              >
                <span v-if="isBanning" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Processing...
                </span>
                <span v-else>Ban Driver</span>
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
              <h3 class="text-lg font-medium text-gray-900">Export Drivers Data</h3>
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
                
                <!-- Vehicle Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Vehicle Information</h4>
                  <div v-for="field in vehicleFields" :key="field.key" class="flex items-center">
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
                  <span class="ml-2 text-sm text-gray-700">Export Only Filtered Drivers</span>
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
  Search, Download, Plus, UserX, ChevronLeft, ChevronRight, 
  MoreVertical, Eye, Edit, Ban, User, Star, CheckCircle, 
  Grid, List, AlertTriangle, X
} from 'lucide-vue-next';
import { useGetDrivers } from "@/composables/modules/drivers/useGetDrivers";
import { useEnableDriverAccount } from "@/composables/modules/drivers/useActivateAccount"
import { useDisableDriverAccount } from "@/composables/modules/drivers/useDeactivateAccount"
import { Driver } from '@/types/drivers';
import { definePageMeta } from '#imports'

const { loading: fetchingDrivers, drivers: driversList } = useGetDrivers();
const { loading: enabling,
  enableAccount } = useEnableDriverAccount()
const { loading: disabling,
  disableAccount } = useDisableDriverAccount()

// View mode
const viewMode = ref<'grid' | 'list'>('grid');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 9;

// Search and filters
const searchQuery = ref('');
const filters = ref({
  carBrand: '',
  carColor: '',
  verificationStatus: '',
  rating: '',
  sortBy: 'rating',
  carYear: '',
  seats: '',
  accountStatus: ''
});

// Dropdown state
const activeDropdown = ref<string | null>(null);

// Modal state
const showModal = ref(false);
const selectedDriver = ref<Driver | null>(null);
const isBanning = ref(false);

// Export modal state
const showExportModal = ref(false);
const exportFormat = ref<'csv' | 'pdf'>('csv');
const isExporting = ref(false);
const selectedFields = ref<string[]>([
  'firstName', 'lastName', 'email', 'phone', 
  'driverData.carBrand', 'driverData.carModel', 'driverData.plateNumber'
]);
const exportOptions = ref({
  includeHeaders: true,
  onlyFiltered: false
});

// Toast state
const showToast = ref(false);
const toastMessage = ref('');

// Verification statuses
const verificationStatuses = [
  { value: 'created', label: 'Created' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' }
];

// Export field definitions
const personalFields = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'dob', label: 'Date of Birth' },
  { key: 'rating', label: 'Rating' },
  { key: 'createdAt', label: 'Registration Date' }
];

const vehicleFields = [
  { key: 'driverData.carBrand', label: 'Car Brand' },
  { key: 'driverData.carModel', label: 'Car Model' },
  { key: 'driverData.carYear', label: 'Car Year' },
  { key: 'driverData.carColor', label: 'Car Color' },
  { key: 'driverData.seats', label: 'Seats' },
  { key: 'driverData.plateNumber', label: 'Plate Number' }
];

const accountFields = [
  { key: 'driverData.walletBalance', label: 'Wallet Balance' },
  { key: 'walletBalance', label: 'Account Balance' },
  { key: 'isDisabled', label: 'Account Status' },
  { key: 'authProvider', label: 'Auth Provider' }
];

const verificationFields = [
  { key: 'IDIsVerified', label: 'ID Verified' },
  { key: 'IDVerificationStatus', label: 'ID Verification Status' },
  { key: 'emailIsVerified', label: 'Email Verified' },
  { key: 'phoneIsVerified', label: 'Phone Verified' },
  { key: 'driverData.licenseIsVerified', label: 'License Verified' },
  { key: 'driverData.proofOfInsuranceVerified', label: 'Insurance Verified' }
];

// All available fields
const allFields = computed(() => [
  ...personalFields,
  ...vehicleFields,
  ...accountFields,
  ...verificationFields
]);

// Check if all fields are selected
const allFieldsSelected = computed(() => {
  return selectedFields.value.length === allFields.value.length;
});

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (activeDropdown.value) {
    activeDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Computed properties
const filteredDrivers = computed(() => {
  let result = [...driversList.value];
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(driver => 
      driver.firstName.toLowerCase().includes(query) ||
      driver.lastName.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.phone.toLowerCase().includes(query) ||
      driver.driverData.plateNumber.toLowerCase().includes(query)
    );
  }
  
  // Apply filters
  if (filters.value.carBrand) {
    result = result.filter(driver => driver.driverData.carBrand === filters.value.carBrand);
  }
  
  if (filters.value.carColor) {
    result = result.filter(driver => driver.driverData.carColor === filters.value.carColor);
  }
  
  if (filters.value.verificationStatus) {
    result = result.filter(driver => driver.IDVerificationStatus === filters.value.verificationStatus);
  }
  
  if (filters.value.rating) {
    const minRating = parseInt(filters.value.rating);
    result = result.filter(driver => driver.rating >= minRating);
  }
  
  if (filters.value.carYear) {
    result = result.filter(driver => driver.driverData.carYear === parseInt(filters.value.carYear));
  }
  
  if (filters.value.seats) {
    const minSeats = parseInt(filters.value.seats);
    result = result.filter(driver => driver.driverData.seats >= minSeats);
  }
  
  if (filters.value.accountStatus) {
    if (filters.value.accountStatus === 'active') {
      result = result.filter(driver => !driver.isDisabled);
    } else if (filters.value.accountStatus === 'disabled') {
      result = result.filter(driver => driver.isDisabled);
    }
  }
  
  // Apply sorting
  switch (filters.value.sortBy) {
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
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
    case 'balance':
      result.sort((a, b) => b.driverData.walletBalance - a.driverData.walletBalance);
      break;
  }
  
  return result;
});

const paginatedDrivers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredDrivers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDrivers.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage;
  return end > filteredDrivers.value.length ? filteredDrivers.value.length : end;
});

const uniqueCarBrands = computed(() => {
  const brands = new Set<string>();
  driversList.value.forEach(driver => {
    if (driver.driverData.carBrand) {
      brands.add(driver.driverData.carBrand);
    }
  });
  return Array.from(brands);
});

const uniqueCarColors = computed(() => {
  const colors = new Set<string>();
  driversList.value.forEach(driver => {
    if (driver.driverData.carColor) {
      colors.add(driver.driverData.carColor);
    }
  });
  return Array.from(colors);
});

const averageRating = computed(() => {
  if (driversList.value.length === 0) return '0.0';
  const total = driversList?.value?.reduce((sum, driver) => sum + driver.rating, 0);
  return (total / driversList.value.length).toFixed(1);
});

const verifiedDriversCount = computed(() => {
  return driversList.value.filter(driver => driver.IDIsVerified).length;
});

const totalEarnings = computed(() => {
  const total = driversList.value.reduce((sum, driver) => sum + driver.driverData.walletBalance, 0);
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

const toggleDropdown = (driverId: string) => {
  // Stop event propagation to prevent immediate closing
  event?.stopPropagation();
  
  if (activeDropdown.value === driverId) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = driverId;
  }
};

const viewDriverDetails = (driver: Driver) => {
  activeDropdown.value = null;
  // Navigate to driver details page
  console.log('View driver details:', driver._id);
  navigateTo(`/dashboard/drivers/${driver._id}`);
};

const editDriver = (driver: Driver) => {
  activeDropdown.value = null;
  // Navigate to edit driver page
  console.log('Edit driver:', driver._id);
  // navigateTo(`/drivers/${driver._id}/edit`);
};

const showBanConfirmation = (driver: Driver) => {
  activeDropdown.value = null;
  selectedDriver.value = driver;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    selectedDriver.value = null;
  }, 300);
};

const banDriver = async () => {
  if (!selectedDriver.value) return;
  
  isBanning.value = true;
  
  try {
    // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1500));

    const driver = selectedDriver?.value;
    if (!driver) return;

    const action = driver.isDisabled ? enableAccount : disableAccount;
    const actionText = driver.isDisabled ? 'unbanned' : 'banned';

    await action(driver._id).then(() => {
      toastMessage.value = `${driver.firstName} ${driver.lastName} has been ${actionText} successfully.`;
      showToast.value = true;
      closeModal();
    });


    // if(!selectedDriver?.value?.isDisabled) {
    //   await disableAccount(selectedDriver.value._id).then(() => {
    //         // Show success toast
    // toastMessage.value = `${selectedDriver.value.firstName} ${selectedDriver.value.lastName} has been banned successfully.`;
    // showToast.value = true;
    
    // // Close modal
    // closeModal();
    //   })
    // } else {
    //   await enableAccount(selectedDriver.value._id).then(() => {
    //         // Show success toast
    // toastMessage.value = `${selectedDriver.value.firstName} ${selectedDriver.value.lastName} has been banned successfully.`;
    // showToast.value = true;
    
    // // Close modal
    // closeModal();
    //   })
    // }

    
    // Make actual API call here
    // const response = await fetch(`/api/drivers/${selectedDriver.value._id}/ban`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to ban driver');
    // }
    
    
    // // Auto-hide toast after 3 seconds
    // setTimeout(() => {
    //   showToast.value = false;
    // }, 3000);
    
    // // Update local state (in a real app, you'd refetch the data)
    // const index = driversList.value.findIndex(d => d._id === selectedDriver.value?._id);
    // if (index !== -1) {
    //   driversList.value[index].isDisabled = true;
    // }
    
  } catch (error) {
    console.error('Error banning driver:', error);
    toastMessage.value = 'Failed to ban driver. Please try again.';
    showToast.value = true;
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  } finally {
    isBanning.value = false;
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
  if (key === 'driverData.walletBalance' || key === 'walletBalance') {
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
      <h1 class="title">Drivers Report</h1>
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
    const dataToExport = exportOptions.value.onlyFiltered ? filteredDrivers.value : driversList.value;
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (exportFormat.value === 'csv') {
      // Export as CSV
      const csvContent = exportAsCSV(
        dataToExport, 
        selectedFields.value, 
        exportOptions.value.includeHeaders
      );
      
      downloadFile(csvContent, `drivers-export-${timestamp}.csv`, 'text/csv');
      
      toastMessage.value = `Successfully exported ${dataToExport.length} drivers to CSV.`;
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
      downloadFile(pdfContent, `drivers-export-${timestamp}.html`, 'text/html');
      
      toastMessage.value = `Successfully exported ${dataToExport.length} drivers to PDF.`;
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

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'Red': 'bg-red-500',
    'Blue': 'bg-blue-500',
    'Green': 'bg-green-500',
    'Yellow': 'bg-yellow-500',
    'Black': 'bg-black',
    'White': 'bg-gray-200',
    'Silver': 'bg-gray-300',
    'Gray': 'bg-gray-500',
    'Brown': 'bg-amber-700',
    'Orange': 'bg-orange-500',
    'Purple': 'bg-purple-500',
    'Pink': 'bg-pink-500'
  };
  
  return colorMap[color] || 'bg-gray-400';
};

definePageMeta({
  layout: 'dashboard'
});
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