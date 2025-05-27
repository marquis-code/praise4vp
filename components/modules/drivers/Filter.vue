<template>
  <div class="bg-white rounded-lg shadow p-6 mb-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2 md:mb-0">Filters</h3>
      <button 
        @click="resetFilters"
        class="text-sm text-primary hover:text-primary-dark transition-colors duration-150 flex items-center"
      >
        <RefreshCw class="h-3.5 w-3.5 mr-1" />
        Reset Filters
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <!-- Car Brand Filter -->
      <div>
        <label for="carBrand" class="block text-sm font-medium text-gray-700 mb-1">Car Brand</label>
        <select
          id="carBrand"
          v-model="localFilters.carBrand"
          class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">All Brands</option>
          <option v-for="brand in carBrands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </div>
      
      <!-- Car Color Filter -->
      <div>
        <label for="carColor" class="block text-sm font-medium text-gray-700 mb-1">Car Color</label>
        <select
          id="carColor"
          v-model="localFilters.carColor"
          class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">All Colors</option>
          <option v-for="color in carColors" :key="color" :value="color">{{ color }}</option>
        </select>
      </div>
      
      <!-- Country Filter -->
      <div>
        <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <select
          id="country"
          v-model="localFilters.country"
          class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">All Countries</option>
          <option v-for="country in countries" :key="country.code" :value="country.code">
            {{ country.name }}
          </option>
        </select>
      </div>
      
      <!-- Verification Status Filter -->
      <div>
        <label for="verificationStatus" class="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
        <select
          id="verificationStatus"
          v-model="localFilters.verificationStatus"
          class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">All Statuses</option>
          <option v-for="status in verificationStatuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      
      <!-- Rating Filter -->
      <div>
        <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
        <select
          id="rating"
          v-model="localFilters.rating"
          class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">Any Rating</option>
          <option value="1">1+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
    </div>
    
    <!-- Advanced Filters Toggle -->
    <div class="mt-4">
      <button 
        @click="showAdvancedFilters = !showAdvancedFilters"
        class="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150 flex items-center"
      >
        <span v-if="showAdvancedFilters">
          <ChevronUp class="h-4 w-4 mr-1" />
          Hide Advanced Filters
        </span>
        <span v-else>
          <ChevronDown class="h-4 w-4 mr-1" />
          Show Advanced Filters
        </span>
      </button>
      
      <!-- Advanced Filters -->
      <div v-if="showAdvancedFilters" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Sort By -->
        <div>
          <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select
            id="sortBy"
            v-model="localFilters.sortBy"
            class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="rating">Rating (High to Low)</option>
            <option value="name">Name (A-Z)</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="balance">Balance (High to Low)</option>
            <option value="country">Country (A-Z)</option>
          </select>
        </div>
        
        <!-- Car Year Filter -->
        <div>
          <label for="carYear" class="block text-sm font-medium text-gray-700 mb-1">Car Year</label>
          <select
            id="carYear"
            v-model="localFilters.carYear"
            class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="">All Years</option>
            <option v-for="year in carYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        
        <!-- Seats Filter -->
        <div>
          <label for="seats" class="block text-sm font-medium text-gray-700 mb-1">Seats</label>
          <select
            id="seats"
            v-model="localFilters.seats"
            class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Any Seats</option>
            <option v-for="seat in [2, 3, 4, 5, 6, 7, 8]" :key="seat" :value="seat">{{ seat }}+ Seats</option>
          </select>
        </div>
        
        <!-- Account Status -->
        <div>
          <label for="accountStatus" class="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
          <select
            id="accountStatus"
            v-model="localFilters.accountStatus"
            class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium text-gray-700">Active filters:</span>
        
        <!-- Country Filter Badge -->
        <div v-if="localFilters.country" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Globe class="h-3 w-3 mr-1" />
          {{ getCountryName(localFilters.country) }}
          <button @click="localFilters.country = ''" class="ml-1 hover:text-blue-600">
            <X class="h-3 w-3" />
          </button>
        </div>
        
        <!-- Car Brand Filter Badge -->
        <div v-if="localFilters.carBrand" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Car class="h-3 w-3 mr-1" />
          {{ localFilters.carBrand }}
          <button @click="localFilters.carBrand = ''" class="ml-1 hover:text-green-600">
            <X class="h-3 w-3" />
          </button>
        </div>
        
        <!-- Car Color Filter Badge -->
        <div v-if="localFilters.carColor" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Palette class="h-3 w-3 mr-1" />
          {{ localFilters.carColor }}
          <button @click="localFilters.carColor = ''" class="ml-1 hover:text-purple-600">
            <X class="h-3 w-3" />
          </button>
        </div>
        
        <!-- Verification Status Filter Badge -->
        <div v-if="localFilters.verificationStatus" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Shield class="h-3 w-3 mr-1" />
          {{ getVerificationStatusLabel(localFilters.verificationStatus) }}
          <button @click="localFilters.verificationStatus = ''" class="ml-1 hover:text-yellow-600">
            <X class="h-3 w-3" />
          </button>
        </div>
        
        <!-- Rating Filter Badge -->
        <div v-if="localFilters.rating" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Star class="h-3 w-3 mr-1" />
          {{ localFilters.rating }}+ Stars
          <button @click="localFilters.rating = ''" class="ml-1 hover:text-orange-600">
            <X class="h-3 w-3" />
          </button>
        </div>
        
        <!-- Account Status Filter Badge -->
        <div v-if="localFilters.accountStatus" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <UserCheck class="h-3 w-3 mr-1" />
          {{ localFilters.accountStatus === 'active' ? 'Active' : 'Disabled' }}
          <button @click="localFilters.accountStatus = ''" class="ml-1 hover:text-red-600">
            <X class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { RefreshCw, ChevronDown, ChevronUp, Globe, Car, Palette, Shield, Star, UserCheck, X } from 'lucide-vue-next';

// Types
interface Country {
  code: string;
  name: string;
}

interface VerificationStatus {
  value: string;
  label: string;
}

// Props
const props = defineProps({
  carBrands: {
    type: Array as () => string[],
    default: () => []
  },
  carColors: {
    type: Array as () => string[],
    default: () => []
  },
  countries: {
    type: Array as () => Country[],
    default: () => []
  },
  verificationStatuses: {
    type: Array as () => VerificationStatus[],
    default: () => []
  }
});

// Emits
const emit = defineEmits(['update:filters']);

// State
const showAdvancedFilters = ref(false);

// Default filters
const defaultFilters = {
  carBrand: '',
  carColor: '',
  country: '',
  verificationStatus: '',
  rating: '',
  sortBy: 'rating',
  carYear: '',
  seats: '',
  accountStatus: ''
};

// Local filters state
const localFilters = ref({ ...defaultFilters });

// Car years for filter
const carYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 15; i--) {
    years.push(i);
  }
  return years;
});

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return Object.entries(localFilters.value).some(([key, value]) => {
    if (key === 'sortBy') return false; // Don't count sortBy as an active filter
    return value !== '';
  });
});

// Helper function to get country name from code
const getCountryName = (countryCode: string): string => {
  const country = props.countries.find(c => c.code === countryCode);
  return country ? country.name : countryCode;
};

// Helper function to get verification status label
const getVerificationStatusLabel = (statusValue: string): string => {
  const status = props.verificationStatuses.find(s => s.value === statusValue);
  return status ? status.label : statusValue;
};

// Watch for changes in local filters and emit to parent
watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters);
}, { deep: true });

// Reset filters to default
const resetFilters = () => {
  localFilters.value = { ...defaultFilters };
};
</script>