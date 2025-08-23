<template>
  <div class="min-h-screen animate-fadeIn">
  
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="ml-3 text-gray-600">Loading driver details...</p>
    </div>
        

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
        
    <div v-else>
      <div class="mb-6">
        <button 
          @click="router.push('/dashboard/drivers')"
          class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft class="mr-1 h-4 w-4" />
          Back to Drivers
        </button>
      </div>
            
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-shrink-0 mb-4 md:mb-0">
              <img 
                :src="driver.photoURL || '/placeholder.svg?height=96&width=96'"
                alt="Driver photo"
                class="h-24 w-24 rounded-full object-cover border border-gray-200"
                @error="handleImageError"
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
                  <span class="ml-1 text-lg text-gray-900">{{ driver.rating?.toFixed(1) || '0.0' }}</span>
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
                  @click="callDriver(driver)"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
                >
                  <Phone class="mr-2 h-4 w-4" />
                  Call Driver
                </button>
              <!-- <button 
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                <Phone class="mr-2 h-4 w-4" />
                Call Driver
              </button> -->
              <!-- <button 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                <Edit class="mr-2 h-4 w-4" />
                Edit Profile
              </button> -->
            </div>
          </div>
        </div>
      </div>
            

      <TabsComponent 
        :tabs="tabs"
        v-model:active-tab="activeTab"
      >

        <div v-if="activeTab === 'details'" class="animate-fadeIn">
          <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Personal Information -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                  <User class="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
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
                    <p class="text-sm text-gray-500">Country</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.countryCode || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Time Zone</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.timeZone || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Joined</p>
                    <p class="text-base font-medium text-gray-900">{{ formatDate(driver.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
                        
            <!-- Vehicle Information -->
            <div class="bg-white shadow rounded-lg overflow-hidden" v-if="driver.hasDriverAccount && driver.driverData">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                  <Car class="h-5 w-5 mr-2 text-green-600" />
                  Vehicle Information
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Vehicle</p>
                    <p class="text-base font-medium text-gray-900">
                      {{ driver.driverData.carBrand }} {{ driver.driverData.carModel }}
                    </p>
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
                  <div>
                    <p class="text-sm text-gray-500">Description</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.driverData.carDescription || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Amenities</p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span v-if="driver.driverData.amenities?.wifi" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        WiFi
                      </span>
                      <span v-if="driver.driverData.amenities?.ac" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        AC
                      </span>
                      <span v-if="!driver.driverData.amenities?.wifi && !driver.driverData.amenities?.ac" class="text-sm text-gray-500">
                        No amenities listed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                        
            <!-- Account & Financial Information -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 flex items-center">
                  <Wallet class="h-5 w-5 mr-2 text-purple-600" />
                  Account & Financial
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Main Wallet Balance</p>
                    <p class="text-xl font-bold text-gray-900">
                      {{ formatCurrency(driver.walletBalance?.priceInUserCurrency || 0, driver.currencySymbol) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      CAD: {{ formatCurrency(driver.walletBalance?.priceInCAD || 0, 'CAD') }}
                    </p>
                  </div>
                  <div v-if="driver.hasDriverAccount && driver.driverData?.walletBalance">
                    <p class="text-sm text-gray-500">Driver Wallet Balance</p>
                    <p class="text-xl font-bold text-gray-900">
                      {{ formatCurrency(driver.driverData.walletBalance.priceInUserCurrency || 0, driver.currencySymbol) }}
                    </p>
                    <p class="text-sm text-gray-500">
                      CAD: {{ formatCurrency(driver.driverData.walletBalance.priceInCAD || 0, 'CAD') }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Exchange Rate</p>
                    <p class="text-base font-medium text-gray-900">
                      {{ driver.walletBalance?.rate || 'N/A' }}
                    </p>
                    <p class="text-xs text-gray-400">
                      Updated: {{ formatDate(driver.walletBalance?.rateTimestamp) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Rating</p>
                    <div class="flex items-center">
                      <div class="flex">
                        <Star v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= Math.round(driver.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" />
                      </div>
                      <span class="ml-2 text-gray-900">{{ (driver.rating || 0).toFixed(1) }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Registration Step</p>
                    <p class="text-base font-medium text-gray-900">{{ driver.currentRegistrationStep || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Has Transaction PIN</p>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      :class="driver.hasTransactionPin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ driver.hasTransactionPin ? 'Yes' : 'No' }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Account Status</p>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      :class="driver.isDisabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                      {{ driver.isDisabled ? 'Disabled' : 'Active' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
                    
          <!-- Notification Preferences -->
          <div class="mt-6 bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 flex items-center">
                <Bell class="h-5 w-5 mr-2 text-orange-600" />
                Notification Preferences
              </h3>
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
                    :checked="driver.notificationPreference?.SMS"
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
              </div>
            </div>
          </div>
        </div>


        <div v-else-if="activeTab === 'documents'" class="animate-fadeIn">
          <div class="space-y-6">
            <!-- Country Specific Documents -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <FileText class="h-5 w-5 mr-2 text-blue-600" />
                    Country Specific Documents
                  </h3>
                  <span class="text-sm text-gray-500">
                    {{ driver.driverData?.countrySpecificDocuments?.length || 0 }} documents
                  </span>
                </div>
              </div>
              <div class="p-6">
                <!-- Loading state for documents -->
                <div v-if="documentsLoading" class="flex justify-center items-center py-12">
                  <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <span class="ml-2 text-gray-600">Loading documents...</span>
                </div>
                
                <!-- Empty state for documents -->
                <div v-else-if="!driver.driverData?.countrySpecificDocuments?.length" class="text-center py-12">
                  <FileX class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    Country specific documents will appear here once uploaded.
                  </p>
                </div>
                
                <!-- Documents grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DocumentCard
                    v-for="document in driver.driverData.countrySpecificDocuments"
                    :key="document._id"
                    :title="document.name"
                    :document-url="document.url"
                    :is-verified="document.verified"
                    :verification-status="getDocumentVerificationStatus(document)"
                    :document-type="getDocumentType(document.url)"
                    :is-required="document.required"
                    :uploaded-at="document.uploadedAt"
                    :checked-at="document.checkedAt"
                    :rejection-reason="document.rejectionReason"
                    :document-code="document.documentCode"
                    @preview="openImagePreview"
                    @approve="handleApproveDocument"
                    @reject="handleRejectDocument"
                  />
                </div>
              </div>
            </div>

            <!-- Personal Documents -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <User class="h-5 w-5 mr-2 text-green-600" />
                    Personal Documents
                  </h3>
                  <span class="text-sm text-gray-500">{{ getPersonalDocumentsCount() }} documents</span>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Profile Photo -->
                  <DocumentCard
                    v-if="driver.photoURL"
                    title="Profile Photo"
                    :document-url="driver.photoURL"
                    :is-verified="true"
                    verification-status="verified"
                    document-type="image"
                    @preview="openImagePreview"
                  />
                  
                  <!-- ID Verification -->
                  <div class="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div class="text-center">
                      <Shield class="mx-auto h-8 w-8 text-gray-400" />
                      <h4 class="mt-2 text-sm font-medium text-gray-900">ID Verification</h4>
                      <p class="mt-1 text-xs text-gray-500">Status: {{ formatVerificationStatus(driver.IDVerificationStatus) }}</p>
                      <span class="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium"
                        :class="driver.IDIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ driver.IDIsVerified ? 'Verified' : 'Not Verified' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vehicle Documents -->
            <div v-if="driver.hasDriverAccount && driver.driverData" class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <Car class="h-5 w-5 mr-2 text-purple-600" />
                    Vehicle Documents
                  </h3>
                  <span class="text-sm text-gray-500">{{ getVehicleDocumentsCount() }} documents</span>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Driver's License -->
                  <div v-if="driver.driverData.licenseIsVerified !== undefined" class="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div class="text-center">
                      <FileText class="mx-auto h-8 w-8 text-gray-400" />
                      <h4 class="mt-2 text-sm font-medium text-gray-900">Driver's License</h4>
                      <p class="mt-1 text-xs text-gray-500">Status: {{ driver.driverData.licenseVerificationStatus || 'Unknown' }}</p>
                      <span class="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium"
                        :class="driver.driverData.licenseIsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ driver.driverData.licenseIsVerified ? 'Verified' : 'Not Verified' }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Insurance Certificate -->
                  <DocumentCard
                    v-if="driver.driverData.proofOfInsuranceURL"
                    title="Insurance Certificate"
                    :document-url="driver.driverData.proofOfInsuranceURL"
                    :is-verified="driver.driverData.proofOfInsuranceVerified"
                    verification-status="verified"
                    document-type="pdf"
                    @preview="openImagePreview"
                  />
                </div>
              </div>
            </div>

            <!-- Vehicle Photos -->
            <div v-if="driver.hasDriverAccount && driver.driverData?.carPhotos?.length" class="bg-white shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-medium text-gray-900 flex items-center">
                    <Camera class="h-5 w-5 mr-2 text-indigo-600" />
                    Vehicle Photos
                  </h3>
                  <span class="text-sm text-gray-500">{{ driver.driverData.carPhotos.length }} photos</span>
                </div>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              </div>
            </div>
          </div>
        </div>
                

        <div v-else-if="activeTab === 'trips'" class="animate-fadeIn">

          <div class="bg-white p-5 rounded-lg shadow mb-6">
            <div class="flex flex-col md:flex-row justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 mb-2 md:mb-0">Trip Filters</h3>
              <div class="flex space-x-2">

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
                    
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div 
              v-for="(stat, index) in tripStats"
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
                  <component :is="stat.icon" class="h-6 w-6" />
                </div>
                <div class="ml-5">
                  <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
                  <p class="mt-1 text-xl font-semibold text-gray-900">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          </div>
                    
   
          <div v-if="fetchingHistory" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
                    

          <div v-else-if="filteredTrips.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
            <FileX class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-lg font-medium text-gray-900">No trips found</h3>
            <p class="mt-1 text-sm text-gray-500">
              This driver hasn't completed any trips yet or no trips match your filter criteria.
            </p>
          </div>
                    

          <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="trip in filteredTrips"
              :key="trip._id"
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-5">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 capitalize">{{ trip?.type }} Trip</h3>
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
                  

                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <div class="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                        <DollarSign class="h-3 w-3 text-yellow-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-xs text-gray-500">Total Fare</p>
                      <p class="text-sm font-medium text-gray-900">
                        {{ formatCurrency(getTotalTripFare(trip), driver.currencySymbol) }}
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
                                            

                      <div class="flex items-start">
                        <div class="flex-shrink-0 mt-1">
                          <div class="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                            <DollarSign class="h-3 w-3 text-yellow-600" />
                          </div>
                        </div>
                        <div class="ml-3">
                          <p class="text-xs text-gray-500">Total Fare</p>
                          <p class="text-sm font-medium text-gray-900">
                            {{ formatCurrency(getTotalTripFare(trip), driver.currencySymbol) }}
                          </p>
                        </div>
                      </div>
                    </div>
                                        
                    <div class="mt-3 border-t border-gray-100 pt-3">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
   
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
          <div v-if="filteredTrips.length > 0" class="mt-6">
            <CorePagination 
              :current-page="pagination.page"
              :total-pages="pagination.totalPages"
              :total="pagination.total"
              :limit="pagination.limit"
              @page-change="handlePageChange"
            />
          </div>
        </div>



      <div v-else-if="activeTab === 'referrals'" class="animate-fadeIn">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Referrals</h3>
              <p class="text-sm text-gray-600 mt-1">
                Users referred by this driver
              </p>
            </div>

            <div class="p-6">
              <!-- Loading State -->
              <div v-if="fetchingReferrals || fetchingReferralDetails" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-gray-600">Loading referrals...</span>
              </div>

              <!-- Empty State -->
              <div v-else-if="!referralDetails || referralDetails.length === 0" class="text-center py-8">
                <Users class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No referrals</h3>
                <p class="mt-1 text-sm text-gray-500">This driver hasn't referred anyone yet.</p>
              </div>

              <!-- Referrals Table -->
              <div v-else class="overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referee
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Type
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referral Code
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credential Completion
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Referred
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="referral in referralDetails" :key="referral._id" class="hover:bg-gray-50">
                        <!-- Referee Info -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User class="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">
                                {{ referral.referree.firstName }} {{ referral.referree.lastName }}
                              </div>
                              <div class="text-sm text-gray-500">
                                ID: {{ referral.referree._id.slice(-8) }}
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Contact -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ referral.referree.email }}</div>
                          <div class="text-sm text-gray-500">{{ referral.referree.phone }}</div>
                        </td>

                        <!-- User Type -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                :class="{
                                  'bg-green-100 text-green-800': referral.referree.hasDriverAccount,
                                  'bg-blue-100 text-blue-800': !referral.referree.hasDriverAccount
                                }">
                            {{ referral.referree.hasDriverAccount ? 'Driver' : 'Passenger' }}
                          </span>
                        </td>

                        <!-- Referral Code -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {{ referral.referralCode }}
                          </div>
                        </td>

                        <!-- Credential Completion -->
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-1">
                              <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-900 font-medium">{{ referral.refereeCompletion }}%</span>
                              </div>
                              <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  class="h-2 rounded-full transition-all duration-300"
                                  :class="{
                                    'bg-red-500': referral.refereeCompletion < 50,
                                    'bg-yellow-500': referral.refereeCompletion >= 50 && referral.refereeCompletion < 80,
                                    'bg-green-500': referral.refereeCompletion >= 80
                                  }"
                                  :style="{ width: `${referral.refereeCompletion}%` }"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Date Referred -->
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ new Date(referral.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Summary Stats -->
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600">{{ referralDetails.length }}</div>
                    <div class="text-sm text-blue-800">Total Referrals</div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-green-600">
                      {{ referralDetails.filter(r => r.refereeCompletion >= 80).length }}
                    </div>
                    <div class="text-sm text-green-800">Complete Profiles</div>
                  </div>
                  <div class="bg-yellow-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-yellow-600">
                      {{ Math.round(referralDetails.reduce((acc, r) => acc + r.refereeCompletion, 0) / referralDetails.length) }}%
                    </div>
                    <div class="text-sm text-yellow-800">Avg. Completion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsComponent>
    </div>
        

    <Teleport to="body">
      <div 
        v-if="showApprovalModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="closeApprovalModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Approve Document</h3>
              <button
                @click="closeApprovalModal"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
                        
            <div class="mb-6">
              <p class="text-sm text-gray-600">
                Are you sure you want to approve the document "{{ selectedDocument?.name }}"?
              </p>
            </div>
                        
            <div class="flex justify-end space-x-3">
              <button
                @click="closeApprovalModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                @click="confirmApproveDocument"
                :disabled="approvingDocument"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 flex items-center"
                :class="{ 'opacity-50 cursor-not-allowed': approvingDocument }"
              >
                <span v-if="approvingDocument" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Approving...
                </span>
                <span v-else class="flex items-center">
                  <CheckCircle class="h-4 w-4 mr-2" />
                  Approve
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div 
        v-if="showRejectionModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
        @click.self="closeRejectionModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Reject Document</h3>
              <button
                @click="closeRejectionModal"
                class="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
                        
            <div class="mb-6">
              <p class="text-sm text-gray-600 mb-4">
                Are you sure you want to reject the document "{{ selectedDocument?.name }}"?
              </p>
              
              <div>
                <label for="rejectionReason" class="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="rejectionReason"
                  v-model="rejectionReason"
                  rows="4"
                  class="w-full rounded-md text-sm p-3 border-gray-300 border shadow-sm focus:border-red-500 focus:ring focus:ring-red-500 focus:ring-opacity-50"
                  placeholder="Please provide a detailed reason for rejecting this document..."
                  required
                ></textarea>
              </div>
            </div>
                        
            <div class="flex justify-end space-x-3">
              <button
                @click="closeRejectionModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                @click="confirmRejectDocument"
                :disabled="rejectingDocument || !rejectionReason.trim()"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 flex items-center"
                :class="{ 'opacity-50 cursor-not-allowed': rejectingDocument || !rejectionReason.trim() }"
              >
                <span v-if="rejectingDocument" class="flex items-center">
                  <span class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Rejecting...
                </span>
                <span v-else class="flex items-center">
                  <XCircle class="h-4 w-4 mr-2" />
                  Reject
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>


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

          <button 
            @click="closeImagePreview"
            class="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all duration-200"
          >
            <X class="h-6 w-6" />
          </button>
                    

          <div class="absolute top-4 left-4 z-10 bg-black bg-opacity-50 rounded-lg px-3 py-2">
            <h3 class="text-white font-medium">{{ previewImageTitle }}</h3>
          </div>
                    

          <img 
            :src="previewImageUrl"
            :alt="previewImageTitle"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            @click.stop
          />
                    
 
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowLeft, Star, Phone, Edit,
  AlertCircle, FileX, Circle, MapPin, User, DollarSign,
  Download, X, CheckCircle, RefreshCw, Car, XCircle, Wallet,
  LayoutGrid, List, Eye, FileText, Camera, Shield, ZoomIn,
  Bell
} from 'lucide-vue-next';
import { useGetReferralsByUserId } from "@/composables/modules/referrals/useGetReferralsByUserId"
import { useRejectCountrySpecificDocument } from "@/composables/modules/drivers/useRejectCountrySpecificDocument"
import { useApproveCountrySpecificDocument } from  "@/composables/modules/drivers/useApproveCountrySpecificDocument"
import { useGetDriverById } from "@/composables/modules/drivers/useGetDriversById";
import { useGetDriverTripHistory } from "@/composables/modules/trips/useGetDriverTripsHistory";
// import { Driver, Trip } from '@/types/drivers';
import TabsComponent from '@/components/modules/drivers/TabsComponent.vue';
import DocumentCard from '@/components/modules/drivers/DocumentCard.vue';

const { rejectDocument, loading: rejecting } = useRejectCountrySpecificDocument()
const { loading: approving, approveDocument } = useApproveCountrySpecificDocument()
const {
    loading: fetchingReferrals,
    referrals
  } = useGetReferralsByUserId()

// Types

interface CountrySpecificDocument {
  _id: string;
  documentCode: string;
  name: string;
  url: string;
  required: boolean;
  verified: boolean;
  uploadedAt: string;
  checkedAt?: string;
  rejectionReason?: string;
}

interface Trip {
  _id: string;
  type: string;
  status: string;
  isScheduled: boolean;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  primaryUserId?: {
    firstName: string;
    lastName: string;
  };
  passengers?: Array<{
    passengerId?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    passengerStatus: string;
    origin?: {
      properties: {
        address: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    };
    destination?: {
      properties: {
        address: string;
      };
      geometry: {
        coordinates: [number, number];
      };
    };
    fare: number;
    tax: number;
    discount: number;
    totalFare: {
      priceInCAD: number;
      priceInUserCurrency: number;
    };
  }>;
}

// Router and route
const router = useRouter();
const route = useRoute();
// Fetch driver data
const { loading, driver } = useGetDriverById();
const { driverTripHistory, loading: fetchingHistory, pagination, changePage } = useGetDriverTripHistory();

// Component state
const documentsLoading = ref(false);
const showApprovalModal = ref(false);
const showRejectionModal = ref(false);
const selectedDocument = ref<CountrySpecificDocument | null>(null);
const rejectionReason = ref('');
const approvingDocument = ref(false);
const rejectingDocument = ref(false);


// Referrals state
const referralDetails = ref<any[]>([])
const fetchingReferralDetails = ref(false)

// Tabs
const tabs = [
  { name: 'Driver Details', value: 'details' },
  { name: 'Documents', value: 'documents' },
  { name: 'Trip History', value: 'trips' },
  { name: 'Referrals', value: 'referrals' }
];
const activeTab = ref('details');

// Image preview state
const showImagePreview = ref(false);
const previewImageUrl = ref('');
const previewImageTitle = ref('');

// View mode toggle (grid or list)
const viewMode = ref<'grid' | 'list'>('list');

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

// // Function to calculate credential completion percentage
// const calculateCredentialCompletion = (user: any) => {
//   if (!user) return 0
  
//   const requiredFields = ['firstName', 'lastName', 'email', 'phone']
//   const completedFields = requiredFields.filter(field => user[field] && user[field].trim() !== '')
  
//   return Math.round((completedFields.length / requiredFields.length) * 100)
// }

// // Function to fetch detailed referral information
// const fetchReferralDetails = async () => {
//   if (!referrals.value || referrals.value.length === 0) return
  
//   fetchingReferralDetails.value = true
//   try {
//     // In a real app, you'd fetch additional details for each referee
//     // For now, we'll use the existing data and calculate completion
//     referralDetails.value = referrals.value.map((referral: any) => ({
//       ...referral,
//       refereeCompletion: calculateCredentialCompletion(referral.referree),
//       referrerCompletion: calculateCredentialCompletion(referral.referrer)
//     }))
//   } catch (error) {
//     console.error('Error fetching referral details:', error)
//   } finally {
//     fetchingReferralDetails.value = false
//   }
// }

const callDriver = (driver: Record<string,any>) => {
  // Remove spaces from the phone number
  const cleanedNumber = driver?.phone?.replace(/\s+/g, "");
  // Redirect to phone dialer
  window.location.href = `tel:${cleanedNumber}`;
};

// Enhanced function to calculate credential completion percentage
const calculateCredentialCompletion = (user: any) => {
  if (!user) return 0
  
  let totalScore = 0
  let maxScore = 0
  
  // Basic Profile Information (30% weight)
  const basicFields = ['firstName', 'lastName', 'email', 'phone', 'dob']
  const basicFieldsWeight = 30
  let basicScore = 0
  
  basicFields.forEach(field => {
    if (user[field] && user[field].toString().trim() !== '') {
      basicScore += 1
    }
  })
  totalScore += (basicScore / basicFields.length) * basicFieldsWeight
  maxScore += basicFieldsWeight
  
  // Verification Status (25% weight)
  const verificationWeight = 25
  let verificationScore = 0
  
  // Email verification (5%)
  if (user.emailIsVerified) verificationScore += 5
  
  // Phone verification (10%)
  if (user.phoneIsVerified) verificationScore += 10
  
  // ID verification (10%)
  if (user.IDIsVerified || user.IdIsVerified) verificationScore += 10
  
  totalScore += verificationScore
  maxScore += verificationWeight
  
  // Profile Completeness (15% weight)
  const profileWeight = 15
  let profileScore = 0
  
  // Photo upload (5%)
  if (user.photoURL && user.photoURL.trim() !== '') profileScore += 5
  
  // Country and timezone (5%)
  if (user.countryCode && user.timeZone) profileScore += 5
  
  // Transaction PIN (5%)
  if (user.hasTransactionPin) profileScore += 5
  
  totalScore += profileScore
  maxScore += profileWeight
  
  // Registration Progress (10% weight)
  const registrationWeight = 10
  let registrationScore = 0
  
  if (user.currentRegistrationStep) {
    // Assuming max registration step is 5
    const maxRegistrationStep = 5
    registrationScore = Math.min(user.currentRegistrationStep / maxRegistrationStep, 1) * registrationWeight
  }
  
  totalScore += registrationScore
  maxScore += registrationWeight
  
  // Driver-specific completion (20% weight) - only if user has driver account
  const driverWeight = 20
  let driverScore = 0
  
  if (user.hasDriverAccount && user.driverData) {
    const driverData = user.driverData
    
    // Vehicle details completion (8%)
    const vehicleFields = ['carBrand', 'carModel', 'carColor', 'plateNumber', 'seats']
    let vehicleFieldsComplete = 0
    
    vehicleFields.forEach(field => {
      if (driverData[field] && driverData[field].toString().trim() !== '' && driverData[field] !== 0) {
        vehicleFieldsComplete += 1
      }
    })
    
    if (driverData.carDetailsComplete) {
      driverScore += 8
    } else {
      driverScore += (vehicleFieldsComplete / vehicleFields.length) * 8
    }
    
    // License verification (6%)
    if (driverData.licenseIsVerified) {
      driverScore += 6
    }
    
    // Insurance verification (3%)
    if (driverData.proofOfInsuranceVerified && driverData.proofOfInsuranceURL && driverData.proofOfInsuranceURL.trim() !== '') {
      driverScore += 3
    }
    
    // Country specific documents (3%)
    if (driverData.countrySpecificDocuments && driverData.countrySpecificDocuments.length > 0) {
      const verifiedDocs = driverData.countrySpecificDocuments.filter((doc: any) => doc.verified)
      const requiredDocs = driverData.countrySpecificDocuments.filter((doc: any) => doc.required)
      
      if (requiredDocs.length > 0) {
        driverScore += (verifiedDocs.length / requiredDocs.length) * 3
      }
    }
    
    totalScore += driverScore
  }
  
  maxScore += driverWeight
  
  // Calculate final percentage
  const completionPercentage = Math.round((totalScore / maxScore) * 100)
  
  return Math.min(completionPercentage, 100)
}

// Enhanced function to get completion details for debugging/display
const getCompletionDetails = (user: any) => {
  if (!user) return null
  
  const details = {
    basicProfile: {
      score: 0,
      maxScore: 30,
      completed: [] as string[],
      missing: [] as string[]
    },
    verification: {
      score: 0,
      maxScore: 25,
      completed: [] as string[],
      missing: [] as string[]
    },
    profile: {
      score: 0,
      maxScore: 15,
      completed: [] as string[],
      missing: [] as string[]
    },
    registration: {
      score: 0,
      maxScore: 10,
      step: user.currentRegistrationStep || 0
    },
    driver: {
      score: 0,
      maxScore: 20,
      completed: [] as string[],
      missing: [] as string[],
      applicable: user.hasDriverAccount
    }
  }
  
  // Basic Profile
  const basicFields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'dob', label: 'Date of Birth' }
  ]
  
  basicFields.forEach(field => {
    if (user[field.key] && user[field.key].toString().trim() !== '') {
      details.basicProfile.completed.push(field.label)
      details.basicProfile.score += 6 // 30/5 = 6 points each
    } else {
      details.basicProfile.missing.push(field.label)
    }
  })
  
  // Verification
  if (user.emailIsVerified) {
    details.verification.completed.push('Email Verified')
    details.verification.score += 5
  } else {
    details.verification.missing.push('Email Verification')
  }
  
  if (user.phoneIsVerified) {
    details.verification.completed.push('Phone Verified')
    details.verification.score += 10
  } else {
    details.verification.missing.push('Phone Verification')
  }
  
  if (user.IDIsVerified || user.IdIsVerified) {
    details.verification.completed.push('ID Verified')
    details.verification.score += 10
  } else {
    details.verification.missing.push('ID Verification')
  }
  
  // Profile
  if (user.photoURL && user.photoURL.trim() !== '') {
    details.profile.completed.push('Profile Photo')
    details.profile.score += 5
  } else {
    details.profile.missing.push('Profile Photo')
  }
  
  if (user.countryCode && user.timeZone) {
    details.profile.completed.push('Location Details')
    details.profile.score += 5
  } else {
    details.profile.missing.push('Location Details')
  }
  
  if (user.hasTransactionPin) {
    details.profile.completed.push('Transaction PIN')
    details.profile.score += 5
  } else {
    details.profile.missing.push('Transaction PIN')
  }
  
  // Registration
  if (user.currentRegistrationStep) {
    const maxStep = 5
    details.registration.score = Math.min(user.currentRegistrationStep / maxStep, 1) * 10
  }
  
  // Driver specific
  if (user.hasDriverAccount && user.driverData) {
    const driverData = user.driverData
    
    if (driverData.carDetailsComplete) {
      details.driver.completed.push('Vehicle Details')
      details.driver.score += 8
    } else {
      details.driver.missing.push('Vehicle Details')
    }
    
    if (driverData.licenseIsVerified) {
      details.driver.completed.push('License Verified')
      details.driver.score += 6
    } else {
      details.driver.missing.push('License Verification')
    }
    
    if (driverData.proofOfInsuranceVerified && driverData.proofOfInsuranceURL?.trim()) {
      details.driver.completed.push('Insurance Verified')
      details.driver.score += 3
    } else {
      details.driver.missing.push('Insurance Verification')
    }
    
    if (driverData.countrySpecificDocuments?.length > 0) {
      const verifiedDocs = driverData.countrySpecificDocuments.filter((doc: any) => doc.verified)
      const requiredDocs = driverData.countrySpecificDocuments.filter((doc: any) => doc.required)
      
      if (requiredDocs.length > 0 && verifiedDocs.length === requiredDocs.length) {
        details.driver.completed.push('Required Documents')
        details.driver.score += 3
      } else {
        details.driver.missing.push('Required Documents')
      }
    } else {
      details.driver.missing.push('Required Documents')
    }
  }
  
  return details
}

// Enhanced function to get completion status with categories
const getCompletionStatus = (percentage: number) => {
  if (percentage >= 95) return { status: 'complete', color: 'green', label: 'Complete' }
  if (percentage >= 80) return { status: 'high', color: 'green', label: 'Nearly Complete' }
  if (percentage >= 60) return { status: 'medium', color: 'yellow', label: 'In Progress' }
  if (percentage >= 30) return { status: 'low', color: 'orange', label: 'Getting Started' }
  return { status: 'minimal', color: 'red', label: 'Just Started' }
}

// Helper function to calculate days ago
const getDaysAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// View referral details function
const viewReferralDetails = (referral: any) => {
  const details = getCompletionDetails(referral.referree)
  
  console.log('Referral Details:', {
    referral,
    completionDetails: details,
    completionPercentage: referral.refereeCompletion
  })
  
  // You can implement navigation to detailed view or show a modal
  // router.push(`/dashboard/users/${referral.referree._id}`)
}

// Enhanced fetchReferralDetails function
const fetchReferralDetails = async () => {
  if (!referrals.value || referrals.value.length === 0) return
  
  fetchingReferralDetails.value = true
  try {
    referralDetails.value = referrals.value.map((referral: any) => {
      const refereeCompletion = calculateCredentialCompletion(referral.referree)
      const completionDetails = getCompletionDetails(referral.referree)
      
      return {
        ...referral,
        refereeCompletion,
        completionDetails,
        referrerCompletion: calculateCredentialCompletion(referral.referrer)
      }
    })
  } catch (error) {
    console.error('Error fetching referral details:', error)
  } finally {
    fetchingReferralDetails.value = false
  }
}

// Function to get completion category stats
const getCompletionStats = computed(() => {
  if (!referralDetails.value || referralDetails.value.length === 0) {
    return {
      complete: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0
    }
  }
  
  const stats = {
    complete: referralDetails.value.filter(r => r.refereeCompletion >= 95).length,
    high: referralDetails.value.filter(r => r.refereeCompletion >= 80 && r.refereeCompletion < 95).length,
    medium: referralDetails.value.filter(r => r.refereeCompletion >= 60 && r.refereeCompletion < 80).length,
    low: referralDetails.value.filter(r => r.refereeCompletion < 60).length,
    total: referralDetails.value.length
  }
  
  return stats
})

// Document helper functions
const getPersonalDocumentsCount = () => {
  let count = 0;
  if (driver.value?.photoURL) count++;
  return count + 1; // +1 for ID verification status
};

const getVehicleDocumentsCount = () => {
  let count = 0;
  if (driver.value?.driverData?.licenseIsVerified !== undefined) count++;
  if (driver.value?.driverData?.proofOfInsuranceURL) count++;
  return count;
};

const getDocumentVerificationStatus = (document: CountrySpecificDocument) => {
  if (document.verified) return 'verified';
  if (document.rejectionReason) return 'rejected';
  return 'pending';
};

const getDocumentType = (url: string) => {
  if (!url) return 'unknown';
  const extension = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
  if (['pdf'].includes(extension || '')) return 'pdf';
  return 'unknown';
};

// Document approval/rejection handlers
const handleApproveDocument = (documentCode: string) => {
  approveDocument()
};

const handleRejectDocument = (documentCode: string) => {
  const document = driver.value?.driverData?.countrySpecificDocuments?.find(
    doc => doc.documentCode === documentCode
  );
  if (document) {
    selectedDocument.value = document;
    rejectionReason.value = '';
    showRejectionModal.value = true;
  }
};

const confirmApproveDocument = async () => {
  if (!selectedDocument.value) return;
  
  approvingDocument.value = true;
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update document status
    if (selectedDocument.value) {
      selectedDocument.value.verified = true;
      selectedDocument.value.checkedAt = new Date().toISOString();
      selectedDocument.value.rejectionReason = '';
    }
    
    toastMessage.value = `Document "${selectedDocument.value.name}" has been approved successfully.`;
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
    
    closeApprovalModal();
  } catch (error) {
    console.error('Error approving document:', error);
    toastMessage.value = 'Failed to approve document. Please try again.';
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
  } finally {
    approvingDocument.value = false;
  }
};

const confirmRejectDocument = async () => {
  if (!selectedDocument.value || !rejectionReason.value.trim()) return;
  
  rejectingDocument.value = true;
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update document status
    if (selectedDocument.value) {
      selectedDocument.value.verified = false;
      selectedDocument.value.checkedAt = new Date().toISOString();
      selectedDocument.value.rejectionReason = rejectionReason.value.trim();
    }
    
    toastMessage.value = `Document "${selectedDocument.value.name}" has been rejected.`;
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
    
    closeRejectionModal();
  } catch (error) {
    console.error('Error rejecting document:', error);
    toastMessage.value = 'Failed to reject document. Please try again.';
    showToast.value = true;
    setTimeout(() => { showToast.value = false; }, 3000);
  } finally {
    rejectingDocument.value = false;
  }
};

const closeApprovalModal = () => {
  showApprovalModal.value = false;
  selectedDocument.value = null;
};

const closeRejectionModal = () => {
  showRejectionModal.value = false;
  selectedDocument.value = null;
  rejectionReason.value = '';
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
  img.src = '/placeholder.svg?height=96&width=96';
};

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page);
};

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

const completedTripsCount = computed(() => {
  if (!driverTripHistory.value) return 0;
  return driverTripHistory.value.filter(trip => trip.status === 'completed').length;
});

const cancelledTripsCount = computed(() => {
  if (!driverTripHistory.value) return 0;
  return driverTripHistory.value.filter(trip => trip.status === 'cancelled').length;
});

const tripTotalEarnings = computed(() => {
  if (!driverTripHistory.value) return formatCurrency(0, driver.value?.currencySymbol);
  
  const total = driverTripHistory.value.reduce((sum, trip) => {
    return sum + getTotalTripFare(trip);
  }, 0);
  
  return formatCurrency(total, driver.value?.currencySymbol);
});

const tripTotalEarningsInCAD = computed(() => {
  if (!driverTripHistory.value) return formatCurrency(0, 'CAD');
  
  const total = driverTripHistory.value.reduce((sum, trip) => {
    return sum + getTotalTripFareInCAD(trip);
  }, 0);
  
  return formatCurrency(total, 'CAD');
});

const tripStats = computed(() => [
  { 
    title: 'Total Trips', 
    value: driverTripHistory.value?.length || 0, 
    icon: Car, 
    color: 'primary' 
  },
  { 
    title: 'Completed Trips', 
    value: completedTripsCount.value, 
    icon: CheckCircle, 
    color: 'green' 
  },
  { 
    title: 'Cancelled Trips', 
    value: cancelledTripsCount.value, 
    icon: XCircle, 
    color: 'red' 
  },
  { 
    title: `Total Earnings (${driver.value?.currencySymbol || 'NGN'})`, 
    value: tripTotalEarnings.value, 
    icon: Wallet, 
    color: 'blue' 
  }
]);

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

const formatCurrency = (amount: number, currency = 'NGN') => {
  if (currency === 'CAD') {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
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
    case 'resubmission_requested':
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
    case 'resubmission_requested':
      return 'Resubmission Required';
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
    return trip.passengers.reduce((sum, passenger) => sum + (passenger?.totalFare?.priceInUserCurrency || 0), 0);
  }
  return 0;
};

const getTotalTripFareInCAD = (trip: Trip) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers.reduce((sum, passenger) => sum + (passenger?.totalFare?.priceInCAD || 0), 0);
  }
  return 0;
};

const resetTripFilters = () => {
  tripFilters.value = {
    type: '',
    status: '',
    sortBy: 'newest'
  };
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
    totalFare: firstPassenger?.totalFare?.priceInUserCurrency || 0
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
    const tripsToExport = exportOptions.value.onlyFiltered ? filteredTrips.value : driverTripHistory.value || [];
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
  // Reset pagination if needed
}, { deep: true });

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'trips' && !fetchingHistory.value && (!driverTripHistory.value || driverTripHistory.value.length === 0)) {
    // If we're switching to the trips tab and don't have trip history yet, fetch it
    // This would be handled by the composable
  }

  if (newTab === 'referrals' && referralDetails.value.length === 0) {
    fetchReferralDetails()
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
