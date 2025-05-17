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
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-vue-next';

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
  verificationStatuses: {
    type: Array as () => { value: string, label: string }[],
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

// Watch for changes in local filters and emit to parent
watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters);
}, { deep: true });

// Reset filters to default
const resetFilters = () => {
  localFilters.value = { ...defaultFilters };
};
</script>