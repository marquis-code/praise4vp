<template>
    <main>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Package Delivery Management</h1>
        <div class="mt-4 md:mt-0">
          <button 
            @click="showAddCourierModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Courier
          </button>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="mb-6">
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">Select a tab</label>
          <select 
            id="tabs" 
            v-model="activeTab"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.name }}</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="[
                  activeTab === tab.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
                <span
                  v-if="tab.count !== undefined"
                  class="ml-2 py-0.5 px-2.5 text-xs rounded-full"
                  :class="[
                    activeTab === tab.value
                      ? 'bg-primary-light text-primary-foreground'
                      : 'bg-gray-100 text-gray-900'
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      <!-- Couriers Table -->
      <div v-if="activeTab === 'couriers'">
        <ReuseableDataTable
          title="Couriers"
          :columns="courierColumns"
          :data="couriers"
          :loading="loading"
          :filters="courierFilters"
          search-placeholder="Search couriers..."
          @view="viewCourier"
          @edit="editCourier"
          @delete="confirmDeleteCourier"
        >
          <!-- Custom cell renderers -->
          <template #cell-barcodeAccess="{ value }">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ value ? 'Enabled' : 'Disabled' }}
            </span>
          </template>
          
          <template #actions="{ item }">
            <div class="flex justify-end space-x-2">
              <button 
                @click="viewCourier(item)" 
                class="text-primary hover:text-primary-dark"
                title="View courier details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button 
                @click="editCourier(item)" 
                class="text-primary hover:text-primary-light"
                title="Edit courier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button 
                v-if="item.status !== 'suspended'"
                @click="suspendCourier(item)" 
                class="text-yellow-600 hover:text-yellow-800"
                title="Suspend courier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </button>
              
              <button 
                v-else
                @click="activateCourier(item)" 
                class="text-green-600 hover:text-green-800"
                title="Activate courier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <button 
                @click="confirmDeleteCourier(item)" 
                class="text-red-600 hover:text-red-800"
                title="Delete courier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </template>
        </ReuseableDataTable>
      </div>
      
      <!-- Packages Table -->
      <div v-if="activeTab === 'packages'">
        <ReuseableDataTable
          title="Packages"
          :columns="packageColumns"
          :data="packages"
          :loading="loading"
          :filters="packageFilters"
          search-placeholder="Search packages..."
          @view="viewPackage"
        >
          <!-- Custom cell renderers -->
          <template #cell-status="{ value }">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getPackageStatusClass(value)"
            >
              {{ value }}
            </span>
          </template>
          
          <template #actions="{ item }">
            <div class="flex justify-end space-x-2">
              <button
                @click="viewPackage(item)"
                class="text-primary hover:text-primary-dark"
                title="View package details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button 
                v-if="item.status === 'pending'"
                @click="assignCourier(item)" 
                class="text-primary hover:text-primary-light"
                title="Assign courier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button 
                v-if="['in transit', 'out for delivery'].includes(item.status)"
                @click="updatePackageStatus(item, 'delivered')" 
                class="text-green-600 hover:text-green-800"
                title="Mark as delivered"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button 
                v-if="['pending', 'in transit', 'out for delivery'].includes(item.status)"
                @click="updatePackageStatus(item, 'cancelled')" 
                class="text-red-600 hover:text-red-800"
                title="Cancel delivery"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </template>
        </ReuseableDataTable>
      </div>
      
      <!-- Feedback Table -->
      <div v-if="activeTab === 'feedback'">
        <ReuseableDataTable
          title="Feedback & Complaints"
          :columns="feedbackColumns"
          :data="feedback"
          :loading="loading"
          :filters="feedbackFilters"
          search-placeholder="Search feedback..."
          @view="viewFeedback"
        >
          <!-- Custom cell renderers -->
          <template #cell-type="{ value }">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-yellow-100 text-yellow-800': value === 'complaint',
                'bg-green-100 text-green-800': value === 'feedback'
              }"
            >
              {{ value }}
            </span>
          </template>
          
          <template #cell-status="{ value }">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': value === 'resolved',
                'bg-yellow-100 text-yellow-800': value === 'pending',
                'bg-red-100 text-red-800': value === 'escalated'
              }"
            >
              {{ value }}
            </span>
          </template>
          
          <template #actions="{ item }">
            <div class="flex justify-end space-x-2">
              <button 
                @click="viewFeedback(item)" 
                class="text-primary hover:text-primary-dark"
                title="View feedback details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button 
                v-if="item.status === 'pending'"
                @click="updateFeedbackStatus(item, 'resolved')" 
                class="text-green-600 hover:text-green-800"
                title="Mark as resolved"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button 
                v-if="item.status === 'pending'"
                @click="updateFeedbackStatus(item, 'escalated')" 
                class="text-red-600 hover:text-red-800"
                title="Escalate"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </button>
            </div>
          </template>
        </ReuseableDataTable>
      </div>
      
      <!-- View Courier Modal -->
      <ReuseableModal
        v-model="showViewCourierModal"
        title="Courier Details"
        :show-close-button="true"
      >
        <template #content>
          <div v-if="selectedCourier" class="space-y-6">
            <!-- Courier profile header -->
            <div class="flex items-center space-x-4">
              <img 
                :src="selectedCourier.avatar || '/placeholder.svg?height=80&width=80'" 
                alt="Courier avatar" 
                class="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ selectedCourier.name }}</h3>
                <div class="mt-1 flex items-center">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(selectedCourier.status)"
                  >
                    {{ selectedCourier.status }}
                  </span>
                  <span class="mx-2 text-gray-500">•</span>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-sm text-gray-600">{{ selectedCourier.rating }} ({{ selectedCourier.totalDeliveries }} deliveries)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Courier details -->
            <div class="border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourier.email }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourier.phone }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Vehicle</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourier.vehicle }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">License Plate</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourier.licensePlate }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Joined</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedCourier.joinedDate) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Last Active</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourier.lastActive }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Barcode Access</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="selectedCourier.barcodeAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ selectedCourier.barcodeAccess ? 'Enabled' : 'Disabled' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Max Package Weight</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourier.maxPackageWeight }} kg</dd>
                </div>
              </dl>
            </div>
            
            <!-- Recent deliveries -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Recent Deliveries</h4>
              <ul class="mt-2 divide-y divide-gray-200 max-h-60 overflow-y-auto">
                <li v-for="(delivery, index) in courierDeliveries" :key="index" class="py-2">
                  <div class="flex justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">Package #{{ delivery.packageId }}</p>
                      <p class="text-xs text-gray-500">{{ delivery.from }} to {{ delivery.to }}</p>
                      <p class="text-xs text-gray-400">{{ delivery.date }}</p>
                    </div>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPackageStatusClass(delivery.status)"
                    >
                      {{ delivery.status }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </ReuseableModal>
      
      <!-- View Package Modal -->
      <ReuseableModal
        v-model="showViewPackageModal"
        title="Package Details"
        :show-close-button="true"
      >
        <template #content>
          <div v-if="selectedPackage" class="space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">Package #{{ selectedPackage.id }}</h3>
                <div class="mt-1 flex items-center">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPackageStatusClass(selectedPackage.status)"
                  >
                    {{ selectedPackage.status }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedPackage.createdAt) }}</p>
                <p class="text-xs text-gray-500">{{ selectedPackage.estimatedDelivery }}</p>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Sender</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.sender }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Receiver</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.receiver }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Pickup Location</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.pickupLocation }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Delivery Location</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.deliveryLocation }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Weight</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.weight }} kg</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Dimensions</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.dimensions }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Courier</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span v-if="selectedPackage.courier">{{ selectedPackage.courier }}</span>
                    <span v-else class="text-gray-500">Not assigned</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tracking Number</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPackage.trackingNumber }}</dd>
                </div>
              </dl>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Tracking History</h4>
              <div class="mt-2 flow-root">
                <ul class="-mb-8">
                  <li v-for="(event, eventIdx) in packageTracking" :key="eventIdx">
                    <div class="relative pb-8">
                      <span v-if="eventIdx !== packageTracking.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div class="relative flex space-x-3">
                        <div>
                          <span 
                            class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                            :class="getTrackingStatusClass(event.status)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path v-if="event.status === 'created'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              <path v-else-if="event.status === 'picked up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              <path v-else-if="event.status === 'in transit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              <path v-else-if="event.status === 'out for delivery'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              <path v-else-if="event.status === 'delivered'" stroke-linecap  />
                              <path v-else-if="event.status === 'delivered'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              <path v-else-if="event.status === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p class="text-sm text-gray-900">{{ event.status }}</p>
                            <p v-if="event.location" class="text-xs text-gray-500">{{ event.location }}</p>
                          </div>
                          <div class="text-right text-xs text-gray-500">
                            <p>{{ event.date }}</p>
                            <p>{{ event.time }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </ReuseableModal>
      
      <!-- View Feedback Modal -->
      <ReuseableModal
        v-model="showViewFeedbackModal"
        title="Feedback Details"
        :show-close-button="true"
      >
        <template #content>
          <div v-if="selectedFeedback" class="space-y-6">
            <!-- Feedback header -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ selectedFeedback.type === 'complaint' ? 'Complaint' : 'Feedback' }}</h3>
                <div class="mt-1 flex items-center">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800': selectedFeedback.status === 'resolved',
                      'bg-yellow-100 text-yellow-800': selectedFeedback.status === 'pending',
                      'bg-red-100 text-red-800': selectedFeedback.status === 'escalated'
                    }"
                  >
                    {{ selectedFeedback.status }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ selectedFeedback.date }}</p>
              </div>
            </div>
            
            <!-- Feedback details -->
            <div class="border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">From</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedFeedback.from }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">User Type</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedFeedback.userType }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Subject</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedFeedback.subject }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Message</dt>
                  <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ selectedFeedback.message }}</dd>
                </div>
                <div v-if="selectedFeedback.packageId" class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Related Package</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <a 
                      href="#" 
                      @click.prevent="viewRelatedPackage(selectedFeedback.packageId)"
                      class="text-primary hover:text-primary-dark"
                    >
                      Package #{{ selectedFeedback.packageId }}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            
            <!-- Response section -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Response</h4>
              <div v-if="selectedFeedback.response" class="mt-2">
                <p class="text-sm text-gray-900 whitespace-pre-line">{{ selectedFeedback.response }}</p>
                <p class="text-xs text-gray-500 mt-1">Responded on {{ selectedFeedback.responseDate }}</p>
              </div>
              <div v-else class="mt-2">
                <textarea 
                  v-model="feedbackResponse" 
                  rows="4" 
                  class="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your response..."
                ></textarea>
                <div class="mt-2 flex justify-end">
                  <button 
                    @click="submitFeedbackResponse" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </ReuseableModal>
      
      <!-- Add/Edit Courier Modal -->
      <ReuseableModal
        v-model="showAddCourierModal"
        :title="isEditing ? 'Edit Courier' : 'Add New Courier'"
        primary-button="Save"
        secondary-button="Cancel"
        @primary-click="saveCourier"
        @secondary-click="showAddCourierModal = false"
      >
        <template #content>
          <form @submit.prevent="saveCourier" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReuseableFormInput
                v-model="courierForm.name"
                label="Full Name"
                placeholder="John Doe"
                required
              />
              
              <ReuseableFormInput
                v-model="courierForm.email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                required
              />
              
              <ReuseableFormInput
                v-model="courierForm.phone"
                label="Phone"
                placeholder="+1 (555) 123-4567"
                required
              />
              
              <ReuseableFormSelect
                v-model="courierForm.status"
                label="Status"
                :options="[
                  { value: 'active', label: 'Active' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'inactive', label: 'Inactive' }
                ]"
                required
              />
              
              <ReuseableFormInput
                v-model="courierForm.vehicle"
                label="Vehicle"
                placeholder="Toyota Camry 2020"
                required
              />
              
              <ReuseableFormInput
                v-model="courierForm.licensePlate"
                label="License Plate"
                placeholder="ABC-1234"
                required
              />
              
              <ReuseableFormInput
                v-model="courierForm.maxPackageWeight"
                label="Max Package Weight (kg)"
                type="number"
                placeholder="20"
                required
              />
              
              <div class="sm:col-span-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">Barcode Access</label>
                  <button 
                    type="button" 
                    @click="courierForm.barcodeAccess = !courierForm.barcodeAccess"
                    class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    :class="courierForm.barcodeAccess ? 'bg-primary' : 'bg-gray-200'"
                  >
                    <span class="sr-only">Toggle barcode access</span>
                    <span 
                      aria-hidden="true" 
                      class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                      :class="courierForm.barcodeAccess ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Allow this courier to use barcode scanning for package pickup and delivery</p>
              </div>
            </div>
          </form>
        </template>
      </ReuseableModal>
      
      <!-- Assign Courier Modal -->
      <ReuseableModal
        v-model="showAssignCourierModal"
        title="Assign Courier"
        primary-button="Assign"
        secondary-button="Cancel"
        @primary-click="confirmAssignCourier"
        @secondary-click="showAssignCourierModal = false"
      >
        <template #content>
          <div class="space-y-4">
            <p class="text-sm text-gray-500">Select a courier to assign to package #{{ selectedPackage?.id }}</p>
            
            <ReuseableFormSelect
              v-model="selectedCourierId"
              label="Courier"
              :options="availableCouriers"
              required
            />
          </div>
        </template>
      </ReuseableModal>
      
      <!-- Delete Confirmation Modal -->
      <ReuseableModal
        v-model="showDeleteModal"
        title="Delete Courier"
        content="Are you sure you want to delete this courier? This action cannot be undone."
        primary-button="Delete"
        secondary-button="Cancel"
        type="danger"
        @primary-click="deleteCourier"
        @secondary-click="showDeleteModal = false"
      />
      
      <!-- Suspend Confirmation Modal -->
      <ReuseableModal
        v-model="showSuspendModal"
        title="Suspend Courier"
        content="Are you sure you want to suspend this courier? They will not be able to accept deliveries until reactivated."
        primary-button="Suspend"
        secondary-button="Cancel"
        type="warning"
        @primary-click="confirmSuspendCourier"
        @secondary-click="showSuspendModal = false"
      />
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
//   import ReuseableDataTable from '~/components/ReuseableDataTable.vue'
//   import Modal from '~/components/Modal.vue'
//   import ReuseableFormInput from '~/components/ReuseableFormInput.vue'
//   import ReuseableFormSelect from '~/components/ReuseableFormSelect.vue'
  
  // Tabs
  const tabs = [
    { name: 'Couriers', value: 'couriers' },
    { name: 'Packages', value: 'packages' },
    { name: 'Feedback', value: 'feedback' }
  ]
  
  const activeTab = ref('couriers')
  const loading = ref(false)
  
  // Courier management
  const couriers = ref([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active',
      rating: 4.8,
      totalDeliveries: 156,
      vehicle: 'Toyota Prius 2020',
      licensePlate: 'ABC-1234',
      joinedDate: '2022-03-15',
      lastActive: '2 hours ago',
      barcodeAccess: true,
      maxPackageWeight: 25
    },
    {
      id: 2,
      name: 'Sarah Miller',
      email: 'sarah.miller@example.com',
      phone: '+1 (555) 987-6543',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'pending',
      rating: 0,
      totalDeliveries: 0,
      vehicle: 'Honda Civic 2019',
      licensePlate: 'XYZ-7890',
      joinedDate: '2022-05-20',
      lastActive: 'Never',
      barcodeAccess: false,
      maxPackageWeight: 15
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 (555) 456-7890',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'suspended',
      rating: 3.2,
      totalDeliveries: 47,
      vehicle: 'Ford Focus 2018',
      licensePlate: 'DEF-5678',
      joinedDate: '2022-01-10',
      lastActive: '3 days ago',
      barcodeAccess: true,
      maxPackageWeight: 20
    },
    {
      id: 4,
      name: 'Jessica Wilson',
      email: 'jessica.wilson@example.com',
      phone: '+1 (555) 234-5678',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active',
      rating: 4.9,
      totalDeliveries: 203,
      vehicle: 'Hyundai Sonata 2021',
      licensePlate: 'GHI-9012',
      joinedDate: '2021-11-05',
      lastActive: '5 minutes ago',
      barcodeAccess: true,
      maxPackageWeight: 30
    },
    {
      id: 5,
      name: 'David Taylor',
      email: 'david.taylor@example.com',
      phone: '+1 (555) 876-5432',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'inactive',
      rating: 4.1,
      totalDeliveries: 78,
      vehicle: 'Chevrolet Malibu 2017',
      licensePlate: 'JKL-3456',
      joinedDate: '2021-09-22',
      lastActive: '2 months ago',
      barcodeAccess: false,
      maxPackageWeight: 25
    }
  ])
  
  const courierColumns = [
    { key: 'avatar', label: '', type: 'image', sortable: false, class: 'w-10' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'totalDeliveries', label: 'Deliveries', sortable: true },
    { key: 'barcodeAccess', label: 'Barcode Access', sortable: true }
  ]
  
  const courierFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'barcodeAccess',
      label: 'Barcode Access',
      options: [
        { value: 'true', label: 'Enabled' },
        { value: 'false', label: 'Disabled' }
      ]
    }
  ]
  
  // Package management
  const packages = ref([
    {
      id: 1001,
      trackingNumber: 'CM1001XYZ',
      sender: 'John Smith',
      receiver: 'Mary Johnson',
      pickupLocation: '123 Main St, Anytown',
      deliveryLocation: '456 Oak Ave, Othertown',
      weight: 5.2,
      dimensions: '30 x 20 x 15 cm',
      status: 'delivered',
      courier: 'Alex Johnson',
      createdAt: '2022-05-10',
      estimatedDelivery: 'May 12, 2022'
    },
    {
      id: 1002,
      trackingNumber: 'CM1002XYZ',
      sender: 'Robert Brown',
      receiver: 'Emily Davis',
      pickupLocation: '789 Pine St, Anytown',
      deliveryLocation: '101 Maple Dr, Othertown',
      weight: 2.8,
      dimensions: '25 x 15 x 10 cm',
      status: 'in transit',
      courier: 'Jessica Wilson',
      createdAt: '2022-05-11',
      estimatedDelivery: 'May 13, 2022'
    },
    {
      id: 1003,
      trackingNumber: 'CM1003XYZ',
      sender: 'Michael Wilson',
      receiver: 'Sarah Miller',
      pickupLocation: '202 Cedar Ln, Anytown',
      deliveryLocation: '303 Birch Rd, Othertown',
      weight: 8.5,
      dimensions: '40 x 30 x 25 cm',
      status: 'pending',
      courier: null,
      createdAt: '2022-05-12',
      estimatedDelivery: 'May 14, 2022'
    },
    {
      id: 1004,
      trackingNumber: 'CM1004XYZ',
      sender: 'Jennifer Lee',
      receiver: 'David Taylor',
      pickupLocation: '404 Elm St, Anytown',
      deliveryLocation: '505 Walnut Ave, Othertown',
      weight: 1.3,
      dimensions: '20 x 15 x 5 cm',
      status: 'out for delivery',
      courier: 'Alex Johnson',
      createdAt: '2022-05-12',
      estimatedDelivery: 'May 13, 2022'
    },
    {
      id: 1005,
      trackingNumber: 'CM1005XYZ',
      sender: 'William Harris',
      receiver: 'Elizabeth Clark',
      pickupLocation: '606 Spruce Dr, Anytown',
      deliveryLocation: '707 Fir Ln, Othertown',
      weight: 3.7,
      dimensions: '35 x 25 x 15 cm',
      status: 'cancelled',
      courier: null,
      createdAt: '2022-05-09',
      estimatedDelivery: 'May 11, 2022'
    }
  ])
  
  const packageColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'trackingNumber', label: 'Tracking #', sortable: true },
    { key: 'sender', label: 'Sender', sortable: true },
    { key: 'receiver', label: 'Receiver', sortable: true },
    { key: 'weight', label: 'Weight (kg)', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'courier', label: 'Courier', sortable: true },
    { key: 'createdAt', label: 'Created', type: 'date', sortable: true }
  ]
  
  const packageFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in transit', label: 'In Transit' },
        { value: 'out for delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ]
  
  // Feedback management
  const feedback = ref([
    {
      id: 1,
      type: 'complaint',
      from: 'John Smith',
      userType: 'Sender',
      subject: 'Package damaged during delivery',
      message: 'My package was delivered with visible damage to the box. The contents were fortunately intact, but this is concerning.',
      status: 'pending',
      date: 'May 12, 2022',
      packageId: 1001,
      response: null,
      responseDate: null
    },
    {
      id: 2,
      type: 'feedback',
      from: 'Mary Johnson',
      userType: 'Receiver',
      subject: 'Excellent service',
      message: 'The courier was very professional and delivered my package ahead of schedule. Very satisfied with the service!',
      status: 'resolved',
      date: 'May 10, 2022',
      packageId: 1001,
      response: 'Thank you for your positive feedback! We\'re glad to hear you had a great experience.',
      responseDate: 'May 10, 2022'
    },
    {
      id: 3,
      type: 'complaint',
      from: 'Robert Brown',
      userType: 'Sender',
      subject: 'Delivery delay',
      message: 'My package was supposed to be delivered yesterday but it\'s still showing as "in transit". This is causing inconvenience to the receiver.',
      status: 'escalated',
      date: 'May 11, 2022',
      packageId: 1002,
      response: 'We apologize for the delay. We\'ve escalated this issue to our logistics team and they will prioritize your delivery.',
      responseDate: 'May 11, 2022'
    },
    {
      id: 4,
      type: 'feedback',
      from: 'Emily Davis',
      userType: 'Receiver',
      subject: 'Barcode feature is great',
      message: 'I love the new barcode scanning feature. It made receiving my package so much easier and more secure.',
      status: 'resolved',
      date: 'May 9, 2022',
      packageId: null,
      response: 'We\'re happy to hear you\'re enjoying our new barcode feature! We\'re constantly working to improve our services.',
      responseDate: 'May 9, 2022'
    },
    {
      id: 5,
      type: 'complaint',
      from: 'William Harris',
      userType: 'Sender',
      subject: 'Courier was unprofessional',
      message: 'The courier who picked up my package was rude and didn\'t handle my package with care. I\'m concerned about its condition upon delivery.',
      status: 'pending',
      date: 'May 12, 2022',
      packageId: 1005,
      response: null,
      responseDate: null
    }
  ])
  
  const feedbackColumns = [
    { key: 'type', label: 'Type', sortable: true },
    { key: 'from', label: 'From', sortable: true },
    { key: 'userType', label: 'User Type', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'date', label: 'Date', type: 'date', sortable: true }
  ]
  
  const feedbackFilters = [
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'complaint', label: 'Complaint' },
        { value: 'feedback', label: 'Feedback' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'escalated', label: 'Escalated' }
      ]
    },
    {
      key: 'userType',
      label: 'User Type',
      options: [
        { value: 'Sender', label: 'Sender' },
        { value: 'Receiver', label: 'Receiver' }
      ]
    }
  ]
  
  // Mock data for courier deliveries
  const courierDeliveries = ref([
    {
      packageId: 1001,
      from: '123 Main St, Anytown',
      to: '456 Oak Ave, Othertown',
      date: 'May 12, 2022',
      status: 'delivered'
    },
    {
      packageId: 1004,
      from: '404 Elm St, Anytown',
      to: '505 Walnut Ave, Othertown',
      date: 'May 13, 2022',
      status: 'out for delivery'
    },
    {
      packageId: 998,
      from: '111 Pine St, Anytown',
      to: '222 Maple Dr, Othertown',
      date: 'May 11, 2022',
      status: 'delivered'
    },
    {
      packageId: 995,
      from: '333 Cedar Ln, Anytown',
      to: '444 Birch Rd, Othertown',
      date: 'May 10, 2022',
      status: 'delivered'
    },
    {
      packageId: 990,
      from: '555 Spruce Dr, Anytown',
      to: '666 Fir Ln, Othertown',
      date: 'May 9, 2022',
      status: 'delivered'
    }
  ])
  
  // Mock data for package tracking
  const packageTracking = ref([
    {
      status: 'created',
      location: null,
      date: 'May 10, 2022',
      time: '09:15 AM'
    },
    {
      status: 'picked up',
      location: '123 Main St, Anytown',
      date: 'May 10, 2022',
      time: '11:30 AM'
    },
    {
      status: 'in transit',
      location: 'Sorting Facility, Midtown',
      date: 'May 11, 2022',
      time: '08:45 AM'
    },
    {
      status: 'out for delivery',
      location: 'Local Delivery Center, Othertown',
      date: 'May 12, 2022',
      time: '09:20 AM'
    },
    {
      status: 'delivered',
      location: '456 Oak Ave, Othertown',
      date: 'May 12, 2022',
      time: '02:15 PM'
    }
  ])
  
  // State variables
  const showViewCourierModal = ref(false)
  const showViewPackageModal = ref(false)
  const showViewFeedbackModal = ref(false)
  const showAddCourierModal = ref(false)
  const showAssignCourierModal = ref(false)
  const showDeleteModal = ref(false)
  const showSuspendModal = ref(false)
  const selectedCourier = ref(null)
  const selectedPackage = ref(null)
  const selectedFeedback = ref(null)
  const selectedCourierId = ref('')
  const isEditing = ref(false)
  const feedbackResponse = ref('')
  
  // Form state
  const courierForm = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    status: 'pending',
    vehicle: '',
    licensePlate: '',
    barcodeAccess: false,
    maxPackageWeight: 20
  })
  
  // Computed properties
  const availableCouriers = computed(() => {
    return couriers.value
      .filter(courier => courier.status === 'active')
      .map(courier => ({
        value: courier.id,
        label: courier.name
      }))
  })
  
  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }
  
  const getPackageStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in transit': 'bg-blue-100 text-blue-800',
      'out for delivery': 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }
  
  const getTrackingStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      created: 'bg-gray-500',
      'picked up': 'bg-blue-500',
      'in transit': 'bg-yellow-500',
      'out for delivery': 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-500'
  }
  
  // Action handlers for couriers
  const viewCourier = (courier: any) => {
    selectedCourier.value = courier
    showViewCourierModal.value = true
  }
  
  const editCourier = (courier: any) => {
    isEditing.value = true
    courierForm.value = {
      id: courier.id,
      name: courier.name,
      email: courier.email,
      phone: courier.phone,
      status: courier.status,
      vehicle: courier.vehicle,
      licensePlate: courier.licensePlate,
      barcodeAccess: courier.barcodeAccess,
      maxPackageWeight: courier.maxPackageWeight
    }
    showAddCourierModal.value = true
  }
  
  const saveCourier = () => {
    if (isEditing.value) {
      // Update existing courier
      const index = couriers.value.findIndex(c => c.id === courierForm.value.id)
      if (index !== -1) {
        couriers.value[index] = {
          ...couriers.value[index],
          ...courierForm.value
        }
      }
    } else {
      // Add new courier
      const newCourier = {
        id: couriers.value.length + 1,
        ...courierForm.value,
        avatar: '/placeholder.svg?height=40&width=40',
        rating: 0,
        totalDeliveries: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now'
      }
      couriers.value.push(newCourier)
    }
    
    // Reset form and close modal
    resetCourierForm()
    showAddCourierModal.value = false
    // In a real app, would make an API call to save the courier
  }
  
  const resetCourierForm = () => {
    courierForm.value = {
      id: null,
      name: '',
      email: '',
      phone: '',
      status: 'pending',
      vehicle: '',
      licensePlate: '',
      barcodeAccess: false,
      maxPackageWeight: 20
    }
    isEditing.value = false
  }
  
  const confirmDeleteCourier = (courier: any) => {
    selectedCourier.value = courier
    showDeleteModal.value = true
  }
  
  const deleteCourier = () => {
    if (selectedCourier.value) {
      couriers.value = couriers.value.filter(c => c.id !== selectedCourier.value.id)
      showDeleteModal.value = false
      selectedCourier.value = null
      // In a real app, would make an API call to delete the courier
    }
  }
  
  const suspendCourier = (courier: any) => {
    selectedCourier.value = courier
    showSuspendModal.value = true
  }
  
  const confirmSuspendCourier = () => {
    if (selectedCourier.value) {
      const index = couriers.value.findIndex(c => c.id === selectedCourier.value.id)
      if (index !== -1) {
        couriers.value[index].status = 'suspended'
      }
      showSuspendModal.value = false
      selectedCourier.value = null
      // In a real app, would make an API call to suspend the courier
    }
  }
  
  const activateCourier = (courier: any) => {
    const index = couriers.value.findIndex(c => c.id === courier.id)
    if (index !== -1) {
      couriers.value[index].status = 'active'
    }
    // In a real app, would make an API call to activate the courier
  }
  
  // Action handlers for packages
  const viewPackage = (pkg: any) => {
    selectedPackage.value = pkg
    showViewPackageModal.value = true
  }
  
  const assignCourier = (pkg: any) => {
    selectedPackage.value = pkg
    selectedCourierId.value = ''
    showAssignCourierModal.value = true
  }
  
  const confirmAssignCourier = () => {
    if (selectedPackage.value && selectedCourierId.value) {
      const index = packages.value.findIndex(p => p.id === selectedPackage.value.id)
      if (index !== -1) {
        const courier = couriers.value.find(c => c.id === parseInt(selectedCourierId.value))
        packages.value[index].status = 'in transit'
        packages.value[index].courier = courier ? courier.name : null
      }
      showAssignCourierModal.value = false
      // In a real app, would make an API call to assign the courier
    }
  }
  
  const updatePackageStatus = (pkg: any, status: string) => {
    const index = packages.value.findIndex(p => p.id === pkg.id)
    if (index !== -1) {
      packages.value[index].status = status
    }
    // In a real app, would make an API call to update the package status
  }
  
  // Action handlers for feedback
  const viewFeedback = (item: any) => {
    selectedFeedback.value = item
    feedbackResponse.value = ''
    showViewFeedbackModal.value = true
  }
  
  const updateFeedbackStatus = (item: any, status: string) => {
    const index = feedback.value.findIndex(f => f.id === item.id)
    if (index !== -1) {
      feedback.value[index].status = status
    }
    // In a real app, would make an API call to update the feedback status
  }
  
  const submitFeedbackResponse = () => {
    if (selectedFeedback.value && feedbackResponse.value) {
      const index = feedback.value.findIndex(f => f.id === selectedFeedback.value.id)
      if (index !== -1) {
        feedback.value[index].response = feedbackResponse.value
        feedback.value[index].responseDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        feedback.value[index].status = 'resolved'
      }
      feedbackResponse.value = ''
      // In a real app, would make an API call to submit the response
    }
  }
  
  const viewRelatedPackage = (packageId: number) => {
    const pkg = packages.value.find(p => p.id === packageId)
    if (pkg) {
      selectedPackage.value = pkg
      showViewFeedbackModal.value = false
      showViewPackageModal.value = true
    }
  }
  
  // Simulate loading data
  onMounted(() => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 1000)
  })

    definePageMeta({
      layout: 'dashboard'
  })
  </script>