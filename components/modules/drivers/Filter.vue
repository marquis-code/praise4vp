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
          @change="onCountryChange"
          class="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="">All Countries</option>
          <option v-for="country in worldCountries" :key="country.code" :value="country.code">
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
          <button @click="clearCountryFilter" class="ml-1 hover:text-blue-600">
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
  verificationStatuses: {
    type: Array as () => VerificationStatus[],
    default: () => []
  }
});

// Emits
const emit = defineEmits(['update:filters', 'country-selected']);

// State
const showAdvancedFilters = ref(false);

// World Countries List
const worldCountries = ref<Country[]>([
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei Darussalam' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: 'Cote D\'Ivoire' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands (Malvinas)' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island & Mcdonald Islands' },
  { code: 'VA', name: 'Holy See (Vatican City State)' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran, Islamic Republic Of' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle Of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KR', name: 'Korea' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Lao People\'s Democratic Republic' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libyan Arab Jamahiriya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia, Federated States Of' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'AN', name: 'Netherlands Antilles' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestinian Territory, Occupied' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Reunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthelemy' },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'KN', name: 'Saint Kitts And Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin' },
  { code: 'PM', name: 'Saint Pierre And Miquelon' },
  { code: 'VC', name: 'Saint Vincent And Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome And Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia And Sandwich Isl.' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard And Jan Mayen' },
  { code: 'SZ', name: 'Swaziland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad And Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks And Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UM', name: 'United States Outlying Islands' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Viet Nam' },
  { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' },
  { code: 'WF', name: 'Wallis And Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
]);

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
  const country = worldCountries.value.find(c => c.code === countryCode);
  return country ? country.name : countryCode;
};

// Helper function to get verification status label
const getVerificationStatusLabel = (statusValue: string): string => {
  const status = props.verificationStatuses.find(s => s.value === statusValue);
  return status ? status.label : statusValue;
};

// Handle country selection change
const onCountryChange = () => {
  if (localFilters.value.country) {
    emit('country-selected', localFilters.value.country);
  }
};

// Clear country filter
const clearCountryFilter = () => {
  localFilters.value.country = '';
  emit('country-selected', '');
};

// Watch for changes in local filters and emit to parent
watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters);
}, { deep: true });

// Reset filters to default
const resetFilters = () => {
  localFilters.value = { ...defaultFilters };
  emit('country-selected', '');
};
</script>