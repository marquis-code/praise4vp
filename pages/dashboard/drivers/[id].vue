<template>
  <div class="min-h-screen animate-fadeIn">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="ml-3 text-gray-600">Loading driver details...</p>
    </div>
    
    <!-- Driver not found -->
    <div v-else-if="!driver" class="flex flex-col items-center justify-center min-h-screen">
      <AlertCircle class="h-16 w-16 text-red-500 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Driver Not Found</h2>
      <p class="text-gray-600 mb-6">The driver you're looking for doesn't exist or you don't have permission to view it.</p>
      <button 
        @click="router.push('/dashboard/drivers')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Drivers
      </button>
    </div>
    
    <!-- Driver details -->
    <div v-else>
      <!-- Back button -->
      <div class="mb-6">
        <button 
          @click="router.push('/dashboard/drivers')"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft class="mr-1 h-4 w-4" />
          Back to Drivers
        </button>
      </div>
      
      <!-- Driver header -->
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-shrink-0 mb-4 md:mb-0">
              <img 
                src="@/assets/img/avatar-male.svg" 
                alt="Driver photo" 
                class="h-24 w-24 rounded-full object-cover border border-gray-200"
              />
            </div>
            <div class="md:ml-6">
              <div class="flex flex-col md:flex-row md:items-center">
                <h1 class="text-2xl font-bold text-gray-900">{{ driver.firstName }} {{ driver.lastName }}</h1>
                <span 
                  class="mt-2 md:mt-0 md:ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getVerificationStatusClass(driver.IDVerificationStatus)"
                >
                  {{ formatVerificationStatus(driver.IDVerificationStatus) }}
                </span>
              </div>
              <div class="mt-1 flex items-center">
                <div class="flex items-center">
                  <Star class="h-5 w-5 text-yellow-400" />
                  <span class="ml-1 text-lg text-gray-900">{{ driver.rating.toFixed(1) }}</span>
                </div>
                <span class="mx-2 text-gray-300">•</span>
                <span class="text-gray-600">{{ formatDate(driver.createdAt) }}</span>
              </div>
              <div class="mt-2 text-gray-600">
                {{ driver.email }} 
                <span 
                  class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="driver.emailIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ driver.emailIsVerified ? 'Email Verified' : 'Email Not Verified' }}
                </span>
              </div>
            </div>
            
            <div class="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                <Phone class="mr-2 h-4 w-4" />
                Call Driver
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
      <TabsComponent 
        :tabs="tabs" 
        v-model:active-tab="activeTab"
      >
        <!-- Driver Details Tab -->
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
                    <p class="text-base font-medium text-gray-900">{{ driver.firstName }} {{ driver.lastName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.email }}</p>
                    <span 
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="driver.emailIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ driver.emailIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Phone</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.phone }}</p>
                    <span 
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="driver.phoneIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ driver.phoneIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Date of Birth</p>
                    <p class="text-base font-medium text-gray-900">{{ formatDate(driver.dob) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Joined</p>
                    <p class="text-base font-medium text-gray-900">{{ formatDate(driver.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Vehicle Information -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Vehicle Information</h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Car</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.driverData.carBrand }} {{ driver.driverData.carModel }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Year</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.driverData.carYear }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Color</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.driverData.carColor }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Plate Number</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.driverData.plateNumber }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Seats</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.driverData.seats }}</p>
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
                    <p class="text-sm text-gray-500">Wallet Balance</p>
                    <p class="text-xl font-bold text-gray-900">{{ formatCurrency(driver.walletBalance) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Driver Wallet Balance</p>
                    <p class="text-xl font-bold text-gray-900">{{ formatCurrency(driver.driverData.walletBalance) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Rating</p>
                    <div class="flex items-center">
                      <div class="flex">
                        <Star v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= Math.round(driver.rating) ? 'text-yellow-400' : 'text-gray-300'" />
                      </div>
                      <span class="ml-2 text-gray-900">{{ driver.rating.toFixed(1) }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">ID Verification</p>
                    <p class="text-base font-medium text-gray-900">{{ formatVerificationStatus(driver.IDVerificationStatus) }}</p>
                    <span 
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="driver.IDIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ driver.IDIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">License</p>
                    <p class="text-base font-medium text-gray-900 truncate">{{ driver.driverData.licenseURL }}</p>
                    <span 
                      class="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium"
                      :class="driver.driverData.licenseIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ driver.driverData.licenseIsVerified ? 'Verified' : 'Not Verified' }}
                    </span>
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
                    :checked="driver.notificationPreference?.email"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Email Notifications</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="driver.notificationPreference?.sms"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">SMS Notifications</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="driver.notificationPreference?.push"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Push Notifications</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="driver.notificationPreference?.SMS"
                    disabled
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">Marketing SMS</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'documents'" class="animate-fadeIn">
          <div class="space-y-6">
            <!-- Personal Documents -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <FileText class="h-5 w-5 mr-2 text-blue-600" />
                    Personal Documents
                  </h3>
                  <span class="text-sm text-gray-500">{{ getPersonalDocumentsCount() }} documents</span>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Profile Photo -->
                  <DocumentCard
                    title="Profile Photo"
                    :document-url="driver.photoURL"
                    :is-verified="true"
                    :verification-status="'verified'"
                    document-type="image"
                    @preview="openImagePreview"
                  />
                  
                  <!-- ID Document -->
                  <DocumentCard
                    title="ID Document"
                    :document-url="getIdDocumentUrl()"
                    :is-verified="driver.IDIsVerified"
                    :verification-status="driver.IDVerificationStatus"
                    document-type="image"
                    @preview="openImagePreview"
                  />
                  
                  <!-- Additional Personal Documents -->
                  <DocumentCard
                    title="Proof of Address"
                    :document-url="getProofOfAddressUrl()"
                    :is-verified="false"
                    :verification-status="'pending'"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                </div>
              </div>
            </div>

            <!-- Vehicle Documents -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <Car class="h-5 w-5 mr-2 text-green-600" />
                    Vehicle Documents
                  </h3>
                  <span class="text-sm text-gray-500">{{ getVehicleDocumentsCount() }} documents</span>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Driver's License -->
                  <DocumentCard
                    title="Driver's License"
                    :document-url="driver.driverData?.licenseURL"
                    :is-verified="driver.driverData?.licenseIsVerified"
                    :verification-status="driver.driverData?.licenseVerificationStatus"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                  
                  <!-- Vehicle Registration -->
                  <DocumentCard
                    title="Vehicle Registration"
                    :document-url="getVehicleRegistrationUrl()"
                    :is-verified="false"
                    :verification-status="'pending'"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                  
                  <!-- Insurance Certificate -->
                  <DocumentCard
                    title="Insurance Certificate"
                    :document-url="getInsuranceUrl()"
                    :is-verified="driver.driverData?.proofOfInsuranceVerified"
                    :verification-status="'created'"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                </div>
              </div>
            </div>

            <!-- Vehicle Photos -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <Camera class="h-5 w-5 mr-2 text-purple-600" />
                    Vehicle Photos
                  </h3>
                  <span class="text-sm text-gray-500">{{ getVehiclePhotosCount() }} photos</span>
                </div>
              </div>
              <div class="p-6">
                <div v-if="driver.driverData?.carPhotos && driver.driverData.carPhotos.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div 
                    v-for="(photo, index) in driver.driverData.carPhotos" 
                    :key="index"
                    class="relative group cursor-pointer"
                    @click="openImagePreview(photo, `Vehicle Photo ${index + 1}`)"
                  >
                    <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-primary transition-colors duration-200">
                      <img 
                        :src="photo" 
                        :alt="`Vehicle photo ${index + 1}`"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <ZoomIn class="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-12">
                  <Camera class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No vehicle photos</h3>
                  <p class="mt-1 text-sm text-gray-500">Vehicle photos will appear here once uploaded.</p>
                </div>
              </div>
            </div>

            <!-- Verification Documents -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <Shield class="h-5 w-5 mr-2 text-orange-600" />
                    Verification Documents
                  </h3>
                  <span class="text-sm text-gray-500">{{ getVerificationDocumentsCount() }} documents</span>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Background Check -->
                  <DocumentCard
                    title="Background Check"
                    :document-url="getBackgroundCheckUrl()"
                    :is-verified="false"
                    :verification-status="'pending'"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                  
                  <!-- Medical Certificate -->
                  <DocumentCard
                    title="Medical Certificate"
                    :document-url="getMedicalCertificateUrl()"
                    :is-verified="false"
                    :verification-status="'created'"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                  
                  <!-- Training Certificate -->
                  <DocumentCard
                    title="Training Certificate"
                    :document-url="getTrainingCertificateUrl()"
                    :is-verified="false"
                    :verification-status="'created'"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
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
                <!-- View Toggle Buttons -->
                <div class="flex border border-gray-300 rounded-md overflow-hidden mr-2">
                  <button 
                    @click="viewMode = 'grid'"
                    class="px-3 py-2 text-sm font-medium transition-colors duration-150 flex items-center"
                    :class="viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                  >
                    <LayoutGrid class="h-4 w-4" />
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
            <div 
              v-for="(stat, index) in [
                { title: 'Total Trips', value: driverTripHistory.length, icon: 'car', color: 'primary' },
                { title: 'Completed Trips', value: completedTripsCount, icon: 'check-circle', color: 'green' },
                { title: 'Cancelled Trips', value: cancelledTripsCount, icon: 'x-circle', color: 'red' },
                { title: 'Total Earnings', value: tripTotalEarnings, icon: 'wallet', color: 'blue' }
              ]"
              :key="index"
              class="bg-white rounded-lg shadow p-5"
              :class="{
                'border-l-4 border-primary': stat.color === 'primary',
                'border-l-4 border-green-500': stat.color === 'green',
                'border-l-4 border-red-500': stat.color === 'red',
                'border-l-4 border-blue-500': stat.color === 'blue'
              }"
            >
              <div class="flex items-center">
                <div 
                  class="p-3 rounded-full"
                  :class="{
                    'bg-primary-50 text-primary': stat.color === 'primary',
                    'bg-green-50 text-green-500': stat.color === 'green',
                    'bg-red-50 text-red-500': stat.color === 'red',
                    'bg-blue-50 text-blue-500': stat.color === 'blue'
                  }"
                >
                  <component :is="stat.icon === 'car' ? Car : stat.icon === 'check-circle' ? CheckCircle : stat.icon === 'x-circle' ? XCircle : Wallet" class="h-6 w-6" />
                </div>
                <div class="ml-5">
                  <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
                  <p class="mt-1 text-xl font-semibold text-gray-900">{{ typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString() }}</p>
                </div>
              </div>
            </div>
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
              This driver hasn't completed any trips yet or no trips match your filter criteria.
            </p>
          </div>
          
          <!-- Trips Grid View -->
          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="trip in filteredTrips" 
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
                  <!-- Passenger -->
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <User class="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-500">Passenger</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ getPrimaryPassengerName(trip) }}
                      </p>
                    </div>
                  </div>
                  
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
                        {{ getFirstPassengerOriginAddress(trip) }}
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
                        {{ getFirstPassengerDestinationAddress(trip) }}
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
                      <p class="text-xs text-gray-500">Total Fare</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ formatCurrency(getTotalTripFare(trip)) }}
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
          
          <!-- Trips List View -->
          <div v-else-if="viewMode === 'list'" class="space-y-4">
            <div 
              v-for="trip in filteredTrips" 
              :key="trip._id" 
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-5">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-2">
                      <h3 class="text-lg font-medium text-gray-900 capitalize mr-3">{{ trip.type }} Trip</h3>
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getTripStatusClass(trip.status)"
                      >
                        {{ formatTripStatus(trip.status) }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-gray-500 mb-3">{{ formatDate(trip.createdAt) }}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Passenger -->
                      <div class="flex items-start">
                        <div class="flex-shrink-0 mt-1">
                          <div class="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                            <User class="h-3 w-3 text-blue-600" />
                          </div>
                        </div>
                        <div class="ml-3">
                          <p class="text-xs text-gray-500">Passenger</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{ getPrimaryPassengerName(trip) }}
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
                          <p class="text-xs text-gray-500">Total Fare</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{ formatCurrency(getTotalTripFare(trip)) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-3 border-t border-gray-100 pt-3">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              {{ getFirstPassengerOriginAddress(trip) }}
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
                              {{ getFirstPassengerDestinationAddress(trip) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 md:mt-0 md:ml-4 flex justify-end">
                    <button 
                      @click="viewTripDetails(trip._id)"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
                    >
                      <Eye class="mr-2 h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
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
      </TabsComponent>
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
                
                <!-- Passenger Information -->
                <div class="space-y-2">
                  <h4 class="text-xs font-semibold text-gray-500 uppercase">Passenger Information</h4>
                  <div v-for="field in passengerFields" :key="field.key" class="flex items-center">
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

    <Teleport to="body">
      <div 
        v-if="showImagePreview" 
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
        @click="closeImagePreview"
      >
        <div class="relative max-w-4xl max-h-full">
          <!-- Close button -->
          <button 
            @click="closeImagePreview"
            class="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all duration-200"
          >
            <X class="h-6 w-6" />
          </button>
          
          <!-- Image title -->
          <div class="absolute top-4 left-4 z-10 bg-black bg-opacity-50 rounded-lg px-3 py-2">
            <h3 class="text-white font-medium">{{ previewImageTitle }}</h3>
          </div>
          
          <!-- Image -->
          <img 
            :src="previewImageUrl" 
            :alt="previewImageTitle"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            @click.stop
          />
          
          <!-- Download button -->
          <div class="absolute bottom-4 right-4 z-10">
            <a 
              :href="previewImageUrl" 
              :download="previewImageTitle"
              class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
              @click.stop
            >
              <Download class="h-4 w-4 mr-2" />
              Download
            </a>
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
  ArrowLeft, Star, Phone, Edit, ChevronLeft, ChevronRight, 
  AlertCircle, FileX, Circle, MapPin, User, DollarSign,
  Download, X, CheckCircle, RefreshCw, Car, XCircle, Wallet,
  LayoutGrid, List, Eye
} from 'lucide-vue-next';
import avatarImage from "@/assets/icons/avatar.svg";
import { useGetDriverById } from "@/composables/modules/drivers/useGetDriversById";
import { useGetDriverTripHistory } from "@/composables/modules/trips/useGetDriverTripsHistory";
import { Driver, Trip } from '@/types/drivers';
import TabsComponent from '@/components/modules/drivers/TabsComponent.vue';
import DocumentCard from '@/components/modules/drivers/DocumentCard.vue';

// Router and route
const router = useRouter();

// Fetch driver data
const { loading, driver } = useGetDriverById();
const { driverTripHistory, loading: fetchingHistory, pagination, changePage } = useGetDriverTripHistory();

// Tabs
// Tabs - Updated to include documents tab
const tabs = [
  { name: 'Driver Details', value: 'details' },
  { name: 'Documents', value: 'documents' },
  { name: 'Trip History', value: 'trips' }
];
const activeTab = ref('details');

// Image preview state
const showImagePreview = ref(false);
const previewImageUrl = ref('');
const previewImageTitle = ref('');

// View mode toggle (grid or list)
const viewMode = ref<'grid' | 'list'>('list');

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
  'type', 'status', 'createdAt', 'originAddress', 'destinationAddress', 'passengerName', 'totalFare'
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

const passengerFields = [
  { key: 'passengerId', label: 'Passenger ID' },
  { key: 'passengerName', label: 'Passenger Name' },
  { key: 'passengerEmail', label: 'Passenger Email' },
  { key: 'passengerStatus', label: 'Passenger Status' }
];

const paymentFields = [
  { key: 'fare', label: 'Base Fare' },
  { key: 'tax', label: 'Tax' },
  { key: 'discount', label: 'Discount' },
  { key: 'totalFare', label: 'Total Fare' }
];

// / Document helper functions
const getPersonalDocumentsCount = () => {
  let count = 0;
  if (driver.value?.photoURL) count++;
  if (getIdDocumentUrl()) count++;
  if (getProofOfAddressUrl()) count++;
  return count;
};

const getVehicleDocumentsCount = () => {
  let count = 0;
  if (driver.value?.driverData?.licenseURL) count++;
  if (getVehicleRegistrationUrl()) count++;
  if (getInsuranceUrl()) count++;
  return count;
};

const getVehiclePhotosCount = () => {
  return driver.value?.driverData?.carPhotos?.length || 0;
};

const getVerificationDocumentsCount = () => {
  let count = 0;
  if (getBackgroundCheckUrl()) count++;
  if (getMedicalCertificateUrl()) count++;
  if (getTrainingCertificateUrl()) count++;
  return count;
};

// Document URL getters (these would be actual URLs in a real implementation)
const getIdDocumentUrl = () => {
  // In a real implementation, this would come from the driver data
  return null; // Return null to show empty state
};

const getProofOfAddressUrl = () => {
  return null;
};

const getVehicleRegistrationUrl = () => {
  return null;
};

const getInsuranceUrl = () => {
  return null;
};

const getBackgroundCheckUrl = () => {
  return null;
};

const getMedicalCertificateUrl = () => {
  return null;
};

const getTrainingCertificateUrl = () => {
  return null;
};

// Image preview functions
const openImagePreview = (imageUrl: string, title: string) => {
  if (!imageUrl) return;
  
  previewImageUrl.value = imageUrl;
  previewImageTitle.value = title;
  showImagePreview.value = true;
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

const closeImagePreview = () => {
  showImagePreview.value = false;
  previewImageUrl.value = '';
  previewImageTitle.value = '';
  
  // Restore body scroll
  document.body.style.overflow = 'auto';
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder.svg?height=200&width=200';
};

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}

// All available fields
const allFields = computed(() => [
  ...tripFields,
  ...locationFields,
  ...passengerFields,
  ...paymentFields
]);

// Check if all fields are selected
const allFieldsSelected = computed(() => {
  return selectedFields.value.length === allFields.value.length;
});

// Computed properties for trips
const filteredTrips = computed(() => {
  if (!driverTripHistory.value) return [];
  
  let result = [...driverTripHistory.value];
  
  // Apply filters
  if (tripFilters.value.type) {
    result = result.filter(trip => trip.type === tripFilters.value.type);
  }
  
  if (tripFilters.value.status) {
    result = result.filter(trip => trip.status === tripFilters.value.status);
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
        const fareA = getTotalTripFare(a);
        const fareB = getTotalTripFare(b);
        return fareB - fareA;
      });
      break;
    case 'fare-low':
      result.sort((a, b) => {
        const fareA = getTotalTripFare(a);
        const fareB = getTotalTripFare(b);
        return fareA - fareB;
      });
      break;
  }
  
  return result;
});

// const filteredTrips = computed(() => {
//   const start = (tripCurrentPage.value - 1) * tripItemsPerPage;
//   const end = start + tripItemsPerPage;
//   return filteredTrips.value.slice(start, end);
// });

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
  if (!driverTripHistory.value) return 0;
  return driverTripHistory.value.filter(trip => trip.status === 'completed').length;
});

const cancelledTripsCount = computed(() => {
  if (!driverTripHistory.value) return 0;
  return driverTripHistory.value.filter(trip => trip.status === 'cancelled').length;
});

const tripTotalEarnings = computed(() => {
  if (!driverTripHistory.value) return formatCurrency(0);
  
  const total = driverTripHistory.value.reduce((sum, trip) => {
    return sum + getTotalTripFare(trip);
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

const formatTripStatus = (status: string) => {
  switch (status) {
    case 'waiting for driver':
      return 'Waiting for Driver';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const getPrimaryPassengerName = (trip: Trip) => {
  if (trip.primaryUserId) {
    return `${trip.primaryUserId.firstName} ${trip.primaryUserId.lastName}`;
  }
  
  if (trip.passengers && trip.passengers.length > 0 && trip.passengers[0].passengerId) {
    return `${trip.passengers[0].passengerId.firstName} ${trip.passengers[0].passengerId.lastName}`;
  }
  
  return 'Unknown passenger';
};

const getFirstPassengerOriginAddress = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0 && trip.passengers[0].origin && trip.passengers[0].origin.properties) {
    return trip.passengers[0].origin.properties.address;
  }
  return 'Unknown location';
};

const getFirstPassengerDestinationAddress = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0 && trip.passengers[0].destination && trip.passengers[0].destination.properties) {
    return trip.passengers[0].destination.properties.address;
  }
  return 'Unknown location';
};

const getTotalTripFare = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers.reduce((sum, passenger) => sum + passenger.totalFare, 0);
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
  const firstPassenger = trip.passengers && trip.passengers.length > 0 ? trip.passengers[0] : null;
  
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
    originAddress: firstPassenger?.origin?.properties?.address || '',
    originLat: firstPassenger?.origin?.geometry?.coordinates[1] || '',
    originLng: firstPassenger?.origin?.geometry?.coordinates[0] || '',
    destinationAddress: firstPassenger?.destination?.properties?.address || '',
    destinationLat: firstPassenger?.destination?.geometry?.coordinates[1] || '',
    destinationLng: firstPassenger?.destination?.geometry?.coordinates[0] || '',
    
    // Passenger fields
    passengerId: firstPassenger?.passengerId?._id || '',
    passengerName: firstPassenger?.passengerId ? `${firstPassenger.passengerId.firstName} ${firstPassenger.passengerId.lastName}` : '',
    passengerEmail: firstPassenger?.passengerId?.email || '',
    passengerStatus: firstPassenger?.passengerStatus || '',
    
    // Payment fields
    fare: firstPassenger?.fare || 0,
    tax: firstPassenger?.tax || 0,
    discount: firstPassenger?.discount || 0,
    totalFare: firstPassenger?.totalFare || 0
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
      <p>Driver: ${driver.value?.firstName} ${driver.value?.lastName}</p>
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
    const tripsToExport = exportOptions.value.onlyFiltered ? filteredTrips.value : driverTripHistory.value;
    const dataToExport = tripsToExport.map(trip => getTripDataForExport(trip));
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const driverName = `${driver.value?.firstName}_${driver.value?.lastName}`.replace(/\s+/g, '_');
    
    if (exportFormat.value === 'csv') {
      // Export as CSV
      const csvContent = exportAsCSV(
        dataToExport, 
        selectedFields.value, 
        exportOptions.value.includeHeaders
      );
      
      downloadFile(csvContent, `trip_history_${driverName}_${timestamp}.csv`, 'text/csv');
      
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
      downloadFile(pdfContent, `trip_history_${driverName}_${timestamp}.html`, 'text/html');
      
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
  if (newTab === 'trips' && !fetchingHistory.value && (!driverTripHistory.value || driverTripHistory.value.length === 0)) {
    // If we're switching to the trips tab and don't have trip history yet, fetch it
    // This would be handled by the composable
  }
});

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = 'auto';
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

