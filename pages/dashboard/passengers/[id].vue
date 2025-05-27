<template>
  <div class="min-h-screen animate-fadeIn">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="ml-3 text-gray-600">Loading passenger details...</p>
    </div>
    
    <!-- Passenger not found -->
    <div v-else-if="!passenger" class="flex flex-col items-center justify-center min-h-screen">
      <AlertCircle class="h-16 w-16 text-red-500 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Passenger Not Found</h2>
      <p class="text-gray-600 mb-6">The passenger you're looking for doesn't exist or you don't have permission to view it.</p>
      <button 
        @click="router.push('/dashboard/passengers')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Passengers
      </button>
    </div>
    
    <!-- Passenger details -->
    <div v-else>
      <!-- Back button -->
      <div class="mb-6">
        <button 
          @click="router.push('/dashboard/passengers')"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft class="mr-1 h-4 w-4" />
          Back to Passengers
        </button>
      </div>
      
      <!-- Passenger header -->
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-shrink-0 mb-4 md:mb-0">
              <img 
                :src="passenger.photoURL || avatarImage" 
                alt="Passenger photo" 
                class="h-24 w-24 rounded-full object-cover border border-gray-200"
              />
            </div>
            <div class="md:ml-6">
              <div class="flex flex-col md:flex-row md:items-center">
                <h1 class="text-2xl font-bold text-gray-900">{{ passenger.firstName }} {{ passenger.lastName }}</h1>
                <span 
                  class="mt-2 md:mt-0 md:ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getVerificationStatusClass(passenger.IDVerificationStatus)"
                >
                  {{ formatVerificationStatus(passenger.IDVerificationStatus) }}
                </span>
              </div>
              <div class="mt-1 flex items-center">
                <div class="flex items-center" v-if="passenger.rating > 0">
                  <Star class="h-5 w-5 text-yellow-400" />
                  <span class="ml-1 text-lg text-gray-900">{{ passenger.rating.toFixed(1) }}</span>
                </div>
                <span class="mx-2 text-gray-300" v-if="passenger.rating > 0">•</span>
                <span class="text-gray-600">{{ formatDate(passenger.createdAt) }}</span>
              </div>
              <div class="mt-2 text-gray-600">
                {{ passenger.email }} 
                <span 
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="passenger.emailIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ passenger.emailIsVerified ? 'Email Verified' : 'Email Not Verified' }}
                </span>
              </div>
            </div>
            
            <div class="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                <Mail class="mr-2 h-4 w-4" />
                Email Passenger
              </button>
              <button 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                <Edit class="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <ModulesPassengersTabsComponent 
        :tabs="tabs" 
        v-model:active-tab="activeTab"
      >
        <!-- Passenger Details Tab -->
        <div v-if="activeTab === 'details'" class="animate-fadeIn">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Personal Information -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Full Name</p>
                    <p class="text-base font-medium text-gray-900">{{ passenger.firstName }} {{ passenger.lastName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-base font-medium text-gray-900">{{ passenger.email }}</p>
                    <span 
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="passenger.emailIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ passenger.emailIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Phone</p>
                    <p class="text-base font-medium text-gray-900">{{ passenger.phone || 'Not provided' }}</p>
                    <span 
                      v-if="passenger.phone"
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="passenger.phoneIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ passenger.phoneIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Date of Birth</p>
                    <p class="text-base font-medium text-gray-900">{{ formatDate(passenger.dob) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Joined</p>
                    <p class="text-base font-medium text-gray-900">{{ formatDate(passenger.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Account Information -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Account Information</h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Auth Provider</p>
                    <p class="text-base font-medium text-gray-900 capitalize">{{ passenger.authProvider }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Wallet Balance</p>
                    <p class="text-xl font-bold text-gray-900">{{ formatCurrency(passenger.walletBalance) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Has Transaction PIN</p>
                    <p class="text-base font-medium text-gray-900">{{ passenger.hasTransactionPin ? 'Yes' : 'No' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Registration Step</p>
                    <p class="text-base font-medium text-gray-900">{{ passenger.currentRegistrationStep }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">ID Verification</p>
                    <p class="text-base font-medium text-gray-900">{{ formatVerificationStatus(passenger.IDVerificationStatus) }}</p>
                    <span 
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="passenger.IDIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ passenger.IDIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Driver Account Information (if applicable) -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Driver Account</h3>
              </div>
              <div class="p-6">
                <div v-if="passenger.hasDriverAccount">
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Car</p>
                      <p class="text-base font-medium text-gray-900">{{ passenger.driverData.carBrand }} {{ passenger.driverData.carModel }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Year</p>
                      <p class="text-base font-medium text-gray-900">{{ passenger.driverData.carYear || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Color</p>
                      <p class="text-base font-medium text-gray-900">{{ passenger.driverData.carColor || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Plate Number</p>
                      <p class="text-base font-medium text-gray-900">{{ passenger.driverData.plateNumber || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Driver Rating</p>
                      <div class="flex items-center">
                        <div class="flex">
                          <Star v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= Math.round(passenger.driverData.rating) ? 'text-yellow-400' : 'text-gray-300'" />
                        </div>
                        <span class="ml-2 text-gray-900">{{ passenger.driverData.rating || 'N/A' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <Car class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No driver account</h3>
                  <p class="mt-1 text-sm text-gray-500">This passenger doesn't have a driver account.</p>
                  <div class="mt-6">
                    <button 
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <Plus class="mr-2 h-4 w-4" />
                      Create Driver Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Notification Preferences -->
          <div class="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Notification Preferences</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="passenger.notificationPreference?.email"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Email Notifications</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="passenger.notificationPreference?.sms"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">SMS Notifications</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="passenger.notificationPreference?.push"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Push Notifications</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="passenger.notificationPreference?.SMS"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Marketing SMS</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Trip History Tab -->
        <div v-else-if="activeTab === 'trips'" class="animate-fadeIn">
          <!-- Filters and Export -->
          <div class="bg-white p-5 rounded-lg shadow mb-6">
            <div class="flex flex-col md:flex-row justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 mb-2 md:mb-0">Trip Filters</h3>
              <div class="flex space-x-2">
                <button 
                  @click="resetTripFilters"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
                >
                  <RefreshCw class="h-4 w-4 mr-2 inline" />
                  Reset
                </button>
                <button 
                  @click="showExportModal = true"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150 flex items-center"
                >
                  <Download class="h-4 w-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                <select 
                  v-model="tripFilters.type"
                  class="w-full rounded-md border-gray-300 border-[0.5px] text-sm p-2.5 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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
                  v-model="tripFilters.status"
                  class="w-full rounded-md border-gray-300 border-[0.5px] text-sm p-2.5 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="waiting for driver">Waiting for Driver</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select 
                  v-model="tripFilters.sortBy"
                  class="w-full rounded-md border-gray-300 border-[0.5px] text-sm p-2.5 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="fare-high">Fare (High to Low)</option>
                  <option value="fare-low">Fare (Low to High)</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Trip Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ModulesPassengersStatsCard 
              title="Total Trips" 
              :value="passengerTripHistory.length" 
              icon="car" 
              color="primary"
            />
            <ModulesPassengersStatsCard 
              title="Completed Trips" 
              :value="completedTripsCount" 
              icon="check-circle" 
              color="green"
            />
            <ModulesPassengersStatsCard 
              title="Cancelled Trips" 
              :value="cancelledTripsCount" 
              icon="x-circle" 
              color="red"
            />
            <ModulesPassengersStatsCard 
              title="Total Spent" 
              :value="tripTotalSpent" 
              icon="wallet" 
              color="blue"
            />
          </div>
          
          <!-- Loading State -->
          <div v-if="fetchingHistory" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="filteredTrips.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
            <FileX class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-lg font-medium text-gray-900">No trips found</h3>
            <p class="mt-1 text-sm text-gray-500">
              This passenger hasn't taken any trips yet or no trips match your filter criteria.
            </p>
          </div>
          
          <!-- Trips Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="trip in paginatedTrips" 
              :key="trip._id" 
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-5">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 capitalize">{{ trip.type }} Trip</h3>
                    <p class="text-sm text-gray-500">{{ formatDate(trip.createdAt) }}</p>
                  </div>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTripStatusClass(trip.status)"
                  >
                    {{ formatTripStatus(trip.status) }}
                  </span>
                </div>
                
                <div class="space-y-3">
                  <!-- Origin -->
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Circle class="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-500">From</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ getPassengerOriginAddress(trip) }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Destination -->
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                        <MapPin class="h-3 w-3 text-red-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-500">To</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ getPassengerDestinationAddress(trip) }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Driver -->
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <User class="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-500">Driver</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ trip.driverId ? `${trip.driverId.firstName} ${trip.driverId.lastName}` : 'Not assigned' }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Fare -->
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                        <DollarSign class="h-3 w-3 text-yellow-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-500">Fare</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ formatCurrency(getPassengerTotalFare(trip)) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="px-5 py-3 bg-gray-50 flex justify-end">
                <button 
                  @click="viewTripDetails(trip._id)"
                  class="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div  v-if="filteredTrips.length > 0" class="mt-6">
          <CorePagination 
            :current-page="pagination.page"
            :total-pages="pagination.totalPages"
            :total="pagination.total"
            :limit="pagination.limit"
            @page-change="handlePageChange"
          />
        </div>
        </div>
      </ModulesPassengersTabsComponent>
    </div>
    
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
              <h3 class="text-lg font-medium text-gray-900">Export Trip History</h3>
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
                <!-- Trip Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Trip Information</h4>
                  <div v-for="field in tripFields" :key="field.key" class="flex items-center">
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
                
                <!-- Location Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Location Information</h4>
                  <div v-for="field in locationFields" :key="field.key" class="flex items-center">
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
                
                <!-- Driver Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Driver Information</h4>
                  <div v-for="field in driverFields" :key="field.key" class="flex items-center">
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
                
                <!-- Payment Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Payment Information</h4>
                  <div v-for="field in paymentFields" :key="field.key" class="flex items-center">
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
                  <span class="ml-2 text-sm text-gray-700">Export Only Filtered Trips</span>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ArrowLeft, Star, Mail, Edit, ChevronLeft, ChevronRight, 
  AlertCircle, FileX, Car, Plus, Circle, MapPin, User, DollarSign,
  Download, X, CheckCircle, RefreshCw
} from 'lucide-vue-next';
import avatarImage from "@/assets/icons/avatar.svg";
import { useGetPassengerById } from "@/composables/modules/passengers/useGetPassengersById";
import { useGetPassengerTripHistory } from "@/composables/modules/trips/useGetPassengerTripHistory";
import { Passenger, Trip } from '@/types/passenger';

// Router and route
const router = useRouter();
const route = useRoute();
const passengerId = computed(() => route.params.id as string);

// Fetch passenger data
const { loading, passenger } = useGetPassengerById();
const { passengerTripHistory, loading: fetchingHistory,  pagination, changePage } = useGetPassengerTripHistory();

// Tabs
const tabs = [
  { name: 'Passenger Details', value: 'details' },
  { name: 'Trip History', value: 'trips' }
];
const activeTab = ref('details');

// Trip history pagination
const tripCurrentPage = ref(1);
const tripItemsPerPage = 6;

// Trip filters
const tripFilters = ref({
  type: '',
  status: '',
  sortBy: 'newest'
});

// Export modal state
const showExportModal = ref(false);
const exportFormat = ref<'csv' | 'pdf'>('csv');
const isExporting = ref(false);
const selectedFields = ref<string[]>([
  'type', 'status', 'createdAt', 'originAddress', 'destinationAddress', 'driverName', 'totalFare'
]);
const exportOptions = ref({
  includeHeaders: true,
  onlyFiltered: false
});

// Toast state
const showToast = ref(false);
const toastMessage = ref('');

// Export field definitions
const tripFields = [
  { key: 'type', label: 'Trip Type' },
  { key: 'status', label: 'Status' },
  { key: 'isScheduled', label: 'Is Scheduled' },
  { key: 'scheduledFor', label: 'Scheduled For' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'isPrivate', label: 'Is Private' }
];

const locationFields = [
  { key: 'originAddress', label: 'Origin Address' },
  { key: 'originLat', label: 'Origin Latitude' },
  { key: 'originLng', label: 'Origin Longitude' },
  { key: 'destinationAddress', label: 'Destination Address' },
  { key: 'destinationLat', label: 'Destination Latitude' },
  { key: 'destinationLng', label: 'Destination Longitude' }
];

const driverFields = [
  { key: 'driverId', label: 'Driver ID' },
  { key: 'driverName', label: 'Driver Name' },
  { key: 'driverEmail', label: 'Driver Email' }
];

const paymentFields = [
  { key: 'fare', label: 'Base Fare' },
  { key: 'tax', label: 'Tax' },
  { key: 'discount', label: 'Discount' },
  { key: 'totalFare', label: 'Total Fare' },
  { key: 'passengerStatus', label: 'Passenger Status' }
];

// All available fields
const allFields = computed(() => [
  ...tripFields,
  ...locationFields,
  ...driverFields,
  ...paymentFields
]);

// Check if all fields are selected
const allFieldsSelected = computed(() => {
  return selectedFields.value.length === allFields.value.length;
});

// Computed properties for trips
const filteredTrips = computed(() => {
  if (!passengerTripHistory.value) return [];
  
  let result = [...passengerTripHistory.value];
  
  // Apply filters
  if (tripFilters.value.type) {
    result = result.filter(trip => trip.type === tripFilters.value.type);
  }
  
  if (tripFilters.value.status) {
    // Check both trip status and passenger status
    result = result.filter(trip => {
      if (trip.status === tripFilters.value.status) return true;
      
      // Check if any passenger has the matching status
      const passengerWithStatus = trip.passengers.find(p => 
        p.passengerStatus === tripFilters.value.status && 
        p.passengerId._id === passengerId.value
      );
      
      return !!passengerWithStatus;
    });
  }
  
  // Apply sorting
  switch (tripFilters.value.sortBy) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'fare-high':
      result.sort((a, b) => {
        const fareA = getPassengerTotalFare(a);
        const fareB = getPassengerTotalFare(b);
        return fareB - fareA;
      });
      break;
    case 'fare-low':
      result.sort((a, b) => {
        const fareA = getPassengerTotalFare(a);
        const fareB = getPassengerTotalFare(b);
        return fareA - fareB;
      });
      break;
  }
  
  return result;
});

const paginatedTrips = computed(() => {
  const start = (tripCurrentPage.value - 1) * tripItemsPerPage;
  const end = start + tripItemsPerPage;
  return filteredTrips.value.slice(start, end);
});

const tripTotalPages = computed(() => {
  return Math.ceil(filteredTrips.value.length / tripItemsPerPage);
});

const tripStartIndex = computed(() => {
  return (tripCurrentPage.value - 1) * tripItemsPerPage;
});

const tripEndIndex = computed(() => {
  const end = tripStartIndex.value + tripItemsPerPage;
  return end > filteredTrips.value.length ? filteredTrips.value.length : end;
});

const completedTripsCount = computed(() => {
  if (!passengerTripHistory.value) return 0;
  return passengerTripHistory.value.filter(trip => trip.status === 'completed').length;
});

const cancelledTripsCount = computed(() => {
  if (!passengerTripHistory.value) return 0;
  return passengerTripHistory.value.filter(trip => trip.status === 'cancelled').length;
});

const tripTotalSpent = computed(() => {
  if (!passengerTripHistory.value) return formatCurrency(0);
  
  const total = passengerTripHistory.value.reduce((sum, trip) => {
    return sum + getPassengerTotalFare(trip);
  }, 0);
  
  return formatCurrency(total);
});

// Helper functions
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getVerificationStatusClass = (status: string) => {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatVerificationStatus = (status: string) => {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Created';
  }
};

const getTripStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'waiting for driver':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}

const formatTripStatus = (status: string) => {
  switch (status) {
    case 'waiting for driver':
      return 'Waiting for Driver';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const getPassengerOriginAddress = (trip: Trip) => {
  const passenger = trip.passengers.find(p => p.passengerId._id === passengerId.value);
  if (passenger && passenger.origin && passenger.origin.properties) {
    return passenger.origin.properties.address;
  }
  return 'Unknown location';
};

const getPassengerDestinationAddress = (trip: Trip) => {
  const passenger = trip.passengers.find(p => p.passengerId._id === passengerId.value);
  if (passenger && passenger.destination && passenger.destination.properties) {
    return passenger.destination.properties.address;
  }
  return 'Unknown location';
};

const getPassengerTotalFare = (trip: Trip) => {
  const passenger = trip.passengers.find(p => p.passengerId._id === passengerId.value);
  if (passenger) {
    return passenger.totalFare;
  }
  return 0;
};

const resetTripFilters = () => {
  tripFilters.value = {
    type: '',
    status: '',
    sortBy: 'newest'
  };
  tripCurrentPage.value = 1;
};

const nextTripPage = () => {
  if (tripCurrentPage.value < tripTotalPages.value) {
    tripCurrentPage.value++;
  }
};

const prevTripPage = () => {
  if (tripCurrentPage.value > 1) {
    tripCurrentPage.value--;
  }
};

const viewTripDetails = (tripId: string) => {
  router.push(`/dashboard/trips/${tripId}`);
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

// Get trip data for export
const getTripDataForExport = (trip: Trip) => {
  const passenger = trip.passengers.find(p => p.passengerId._id === passengerId.value);
  
  return {
    // Trip fields
    type: trip.type,
    status: trip.status,
    isScheduled: trip.isScheduled,
    scheduledFor: trip.scheduledFor,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
    isPrivate: trip.isPrivate,
    
    // Location fields
    originAddress: passenger?.origin?.properties?.address || '',
    originLat: passenger?.origin?.geometry?.coordinates[1] || '',
    originLng: passenger?.origin?.geometry?.coordinates[0] || '',
    destinationAddress: passenger?.destination?.properties?.address || '',
    destinationLat: passenger?.destination?.geometry?.coordinates[1] || '',
    destinationLng: passenger?.destination?.geometry?.coordinates[0] || '',
    
    // Driver fields
    driverId: trip.driverId?._id || '',
    driverName: trip.driverId ? `${trip.driverId.firstName} ${trip.driverId.lastName}` : '',
    driverEmail: trip.driverId?.email || '',
    
    // Payment fields
    fare: passenger?.fare || 0,
    tax: passenger?.tax || 0,
    discount: passenger?.discount || 0,
    totalFare: passenger?.totalFare || 0,
    passengerStatus: passenger?.passengerStatus || ''
  };
};

// Format value for export
const formatValueForExport = (value: any, key: string) => {
  if (value === null || value === undefined) return '';
  
  // Format dates
  if (key === 'createdAt' || key === 'updatedAt' || key === 'scheduledFor') {
    return value ? formatDate(value) : '';
  }
  
  // Format currency
  if (key === 'fare' || key === 'tax' || key === 'discount' || key === 'totalFare') {
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
      const value = item[field];
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
      <h1 class="title">Trip History Report</h1>
      <p>Passenger: ${passenger.value?.firstName} ${passenger.value?.lastName}</p>
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
      const value = item[field];
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
    // Prepare data for export
    const tripsToExport = exportOptions.value.onlyFiltered ? filteredTrips.value : passengerTripHistory.value;
    const dataToExport = tripsToExport.map(trip => getTripDataForExport(trip));
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const passengerName = `${passenger.value?.firstName}_${passenger.value?.lastName}`.replace(/\s+/g, '_');
    
    if (exportFormat.value === 'csv') {
      // Export as CSV
      const csvContent = exportAsCSV(
        dataToExport, 
        selectedFields.value, 
        exportOptions.value.includeHeaders
      );
      
      downloadFile(csvContent, `trip_history_${passengerName}_${timestamp}.csv`, 'text/csv');
      
      toastMessage.value = `Successfully exported ${dataToExport.length} trips to CSV.`;
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
      downloadFile(pdfContent, `trip_history_${passengerName}_${timestamp}.html`, 'text/html');
      
      toastMessage.value = `Successfully exported ${dataToExport.length} trips to PDF.`;
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

// Reset pagination when filters change
watch(tripFilters, () => {
  tripCurrentPage.value = 1;
}, { deep: true });

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'trips' && !fetchingHistory.value && passengerTripHistory.value.length === 0) {
    // If we're switching to the trips tab and don't have trip history yet, fetch it
    // This would be handled by the composable
  }
});

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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.4s ease-in-out;
}
</style>