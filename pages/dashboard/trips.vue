<template>
  <main>
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Trip Management</h1>
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
    
    <!-- Active Trips -->
    <div v-if="activeTab === 'active'">
      <div class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, index) in tripStats" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">{{ stat.value }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ReuseableDataTable
        title="Active Trips"
        :columns="tripColumns"
        :data="activeTrips"
        :loading="loading"
        :filters="tripFilters"
        search-placeholder="Search trips..."
        @view="viewTrip"
      >
        <!-- Custom cell renderers -->
        <template #cell-status="{ value }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getTripStatusClass(value)"
          >
            {{ value }}
          </span>
        </template>
        
        <template #cell-ridesharing="{ value }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ value ? 'Yes' : 'No' }}
          </span>
        </template>
        
        <template #actions="{ item }">
          <div class="flex justify-end space-x-2">
            <button 
              @click="viewTrip(item)" 
              class="text-primary hover:text-primary-dark"
              title="View trip details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button 
              @click="trackTrip(item)" 
              class="text-primary hover:text-primary-light"
              title="Track on map"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
            
            <button 
              @click="cancelTrip(item)" 
              class="text-red-600 hover:text-red-800"
              title="Cancel trip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>
      </ReuseableDataTable>
    </div>
    
    <!-- Trip History -->
    <div v-if="activeTab === 'history'">
      <ReuseableDataTable
        title="Trip History"
        :columns="tripColumns"
        :data="tripHistory"
        :loading="loading"
        :filters="historyFilters"
        search-placeholder="Search trip history..."
        @view="viewTrip"
      >
        <!-- Custom cell renderers -->
        <template #cell-status="{ value }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getTripStatusClass(value)"
          >
            {{ value }}
          </span>
        </template>
        
        <template #cell-ridesharing="{ value }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ value ? 'Yes' : 'No' }}
          </span>
        </template>
        
        <template #actions="{ item }">
          <div class="flex justify-end space-x-2">
            <button 
              @click="viewTrip(item)" 
              class="text-primary hover:text-primary-dark"
              title="View trip details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </template>
      </ReuseableDataTable>
    </div>
    
    <!-- Disputes -->
    <div v-if="activeTab === 'disputes'">
      <ReuseableDataTable
        title="Pricing Disputes"
        :columns="disputeColumns"
        :data="disputes"
        :loading="loading"
        :filters="disputeFilters"
        search-placeholder="Search disputes..."
        @view="viewDispute"
      >
        <!-- Custom cell renderers -->
        <template #cell-status="{ value }">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="{
              'bg-yellow-100 text-yellow-800': value === 'pending',
              'bg-green-100 text-green-800': value === 'resolved',
              'bg-red-100 text-red-800': value === 'escalated'
            }"
          >
            {{ value }}
          </span>
        </template>
        
        <template #actions="{ item }">
          <div class="flex justify-end space-x-2">
            <button 
              @click="viewDispute(item)" 
              class="text-primary hover:text-primary-dark"
              title="View dispute details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button 
              v-if="item.status === 'pending'"
              @click="resolveDispute(item)" 
              class="text-green-600 hover:text-green-800"
              title="Resolve dispute"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            
            <button 
              v-if="item.status === 'pending'"
              @click="escalateDispute(item)" 
              class="text-red-600 hover:text-red-800"
              title="Escalate dispute"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </button>
          </div>
        </template>
      </ReuseableDataTable>
    </div>
    
    <!-- View Trip Modal -->
    <ReuseableModal
      v-model="showViewTripModal"
      title="Trip Details"
      :show-close-button="true"
    >
      <template #content>
        <div v-if="selectedTrip" class="space-y-6">
          <!-- Trip header -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Trip #{{ selectedTrip.id }}</h3>
              <div class="mt-1 flex items-center">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTripStatusClass(selectedTrip.status)"
                >
                  {{ selectedTrip.status }}
                </span>
                <span v-if="selectedTrip.ridesharing" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ridesharing
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ selectedTrip.date }}</p>
              <p class="text-xs text-gray-500">{{ selectedTrip.time }}</p>
            </div>
          </div>
          
          <!-- Trip details -->
          <div class="border-t border-gray-200 pt-4">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Driver</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedTrip.driver }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Passenger(s)</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <div v-for="(passenger, index) in selectedTrip.passengers" :key="index" class="flex items-center">
                    <span>{{ passenger }}</span>
                    <span v-if="index === 0 && selectedTrip.passengers.length > 1" class="ml-1 text-xs text-primary">(Primary)</span>
                  </div>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">From</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedTrip.from }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">To</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedTrip.to }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Distance</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedTrip.distance }} km</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Duration</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedTrip.duration }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Price</dt>
                <dd class="mt-1 text-sm text-gray-900">${{ selectedTrip.price.toFixed(2) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Payment Method</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedTrip.paymentMethod }}</dd>
              </div>
            </dl>
          </div>
          
          <!-- Trip map -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Trip Route</h4>
            <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p class="text-gray-500">Map view would be displayed here</p>
            </div>
          </div>
          
          <!-- Trip timeline -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-500">Trip Timeline</h4>
            <div class="mt-2 flow-root">
              <ul class="-mb-8">
                <li v-for="(event, eventIdx) in tripTimeline" :key="eventIdx">
                  <div class="relative pb-8">
                    <span v-if="eventIdx !== tripTimeline.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span 
                          class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                          :class="getTripEventClass(event.type)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="event.type === 'requested'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path v-else-if="event.type === 'accepted'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path v-else-if="event.type === 'arrived'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            <path v-else-if="event.type === 'started'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path v-else-if="event.type === 'completed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            <path v-else-if="event.type === 'cancelled'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-900">{{ event.description }}</p>
                        </div>
                        <div class="text-right text-xs text-gray-500">
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
    
    <!-- View Dispute Modal -->
    <ReuseableModal
      v-model="showViewDisputeModal"
      title="Dispute Details"
      :show-close-button="true"
    >
      <template #content>
        <div v-if="selectedDispute" class="space-y-6">
          <!-- Dispute header -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Pricing Dispute #{{ selectedDispute.id }}</h3>
              <div class="mt-1 flex items-center">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': selectedDispute.status === 'pending',
                    'bg-green-100 text-green-800': selectedDispute.status === 'resolved',
                    'bg-red-100 text-red-800': selectedDispute.status === 'escalated'
                  }"
                >
                  {{ selectedDispute.status }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ selectedDispute.date }}</p>
            </div>
          </div>
          
          <!-- Dispute details -->
          <div class="border-t border-gray-200 pt-4">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Trip ID</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <a 
                    href="#" 
                    @click.prevent="viewRelatedTrip(selectedDispute.tripId)"
                    class="text-primary hover:text-primary-dark"
                  >
                    #{{ selectedDispute.tripId }}
                  </a>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Filed By</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedDispute.filedBy }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Original Price</dt>
                <dd class="mt-1 text-sm text-gray-900">${{ selectedDispute.originalPrice.toFixed(2) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Disputed Price</dt>
                <dd class="mt-1 text-sm text-gray-900">${{ selectedDispute.disputedPrice.toFixed(2) }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Reason</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedDispute.reason }}</dd>
              </div>
            </dl>
          </div>
          
          <!-- Negotiation logs -->
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-500">Negotiation Logs</h4>
            <div class="mt-2 max-h-60 overflow-y-auto">
              <ul class="divide-y divide-gray-200">
                <li v-for="(log, index) in selectedDispute.negotiationLogs" :key="index" class="py-3">
                  <div class="flex space-x-3">
                    <div class="flex-shrink-0">
                      <span 
                        class="inline-flex h-8 w-8 items-center justify-center rounded-full"
                        :class="log.role === 'driver' ? 'bg-primary-light text-white' : 'bg-primary text-primary-foreground'"
                      >
                        {{ log.role === 'driver' ? 'D' : 'P' }}
                      </span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900">
                        {{ log.role === 'driver' ? 'Driver' : 'Passenger' }}
                        <span class="text-xs text-gray-500 ml-2">{{ log.time }}</span>
                      </p>
                      <p class="text-sm text-gray-700">{{ log.message }}</p>
                      <p v-if="log.offeredPrice" class="text-sm font-medium text-primary mt-1">
                        Offered price: ${{ log.offeredPrice.toFixed(2) }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Resolution section -->
          <div v-if="selectedDispute.status === 'pending'" class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Resolve Dispute</h4>
            <div class="space-y-4">
              <ReuseableFormInput
                v-model="resolvedPrice"
                label="Final Price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter final price"
                required
              />
              
              <ReuseableFormInput
                v-model="resolutionNote"
                label="Resolution Note"
                placeholder="Enter resolution details"
                required
              />
              
              <div class="flex justify-end space-x-3">
                <button 
                  @click="confirmResolveDispute" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Resolve Dispute
                </button>
                
                <button 
                  @click="confirmEscalateDispute" 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Escalate
                </button>
              </div>
            </div>
          </div>
          
          <div v-else-if="selectedDispute.resolution" class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-500">Resolution</h4>
            <div class="mt-2">
              <p class="text-sm text-gray-900">{{ selectedDispute.resolution.note }}</p>
              <p class="text-sm font-medium text-gray-900 mt-1">Final price: ${{ selectedDispute.resolution.finalPrice.toFixed(2) }}</p>
              <p class="text-xs text-gray-500 mt-1">Resolved by {{ selectedDispute.resolution.resolvedBy }} on {{ selectedDispute.resolution.date }}</p>
            </div>
          </div>
        </div>
      </template>
    </ReuseableModal>
    
    <!-- Track Trip Modal -->
    <ReuseableModal
      v-model="showTrackTripModal"
      title="Live Trip Tracking"
      :show-close-button="true"
      size="lg"
    >
      <template #content>
        <div v-if="selectedTrip" class="space-y-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Trip #{{ selectedTrip.id }}</h3>
              <p class="text-sm text-gray-500">{{ selectedTrip.from }} to {{ selectedTrip.to }}</p>
            </div>
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getTripStatusClass(selectedTrip.status)"
            >
              {{ selectedTrip.status }}
            </span>
          </div>
          
          <!-- Map view -->
          <div class="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p class="text-gray-500">Interactive map would be displayed here</p>
              <p class="text-gray-400 text-sm mt-1">Showing real-time location of driver and passengers</p>
            </div>
          </div>
          
          <!-- Trip info -->
          <div class="grid grid-cols-1 gap-4">
            <div class="bg-white shadow rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Driver</h4>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ selectedTrip.driver }}</p>
                  <p class="text-xs text-gray-500">Vehicle: {{ selectedTrip.vehicle }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white shadow rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Passengers</h4>
              <ul class="space-y-2">
                <li v-for="(passenger, index) in selectedTrip.passengers" :key="index" class="flex items-center">
                  <div class="flex-shrink-0">
                    <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {{ passenger.substring(0, 2).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ passenger }}
                      <span v-if="index === 0 && selectedTrip.passengers.length > 1" class="text-xs text-primary">(Primary)</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="bg-white shadow rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Trip Progress</h4>
              <div class="space-y-2">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm text-gray-900">Driver accepted</p>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm text-gray-900">Driver arrived at pickup</p>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm text-gray-900">Trip in progress</p>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm text-gray-400">Arrived at destination</p>
                </div>
              </div>
              <div class="mt-3">
                <p class="text-sm text-gray-900">ETA: <span class="font-medium">12 minutes</span></p>
                <p class="text-sm text-gray-900">Distance remaining: <span class="font-medium">5.2 km</span></p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button 
              @click="contactDriver" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact Driver
            </button>
            
            <button 
              @click="contactPassenger" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact Passenger
            </button>
            
            <button 
              @click="cancelTrip(selectedTrip)" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Trip
            </button>
          </div>
        </div>
      </template>
    </ReuseableModal>
    
    <!-- Cancel Trip Modal -->
    <ReuseableModal
      v-model="showCancelTripModal"
      title="Cancel Trip"
      content="Are you sure you want to cancel this trip? This action cannot be undone."
      primary-button="Cancel Trip"
      secondary-button="Go Back"
      type="danger"
      @primary-click="confirmCancelTrip"
      @secondary-click="showCancelTripModal = false"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MapPin, Users, Clock, Activity } from 'lucide-vue-next'
// Tabs
const tabs = [
  { name: 'Active Trips', value: 'active' },
  { name: 'Trip History', value: 'history' },
  { name: 'Disputes', value: 'disputes' }
]

const activeTab = ref('active')
const loading = ref(false)

// Trip stats
const tripStats = [
  {
    name: 'Active Trips',
    value: '24',
    icon: 'svg-icon-active-trips'
  },
  {
    name: 'Ridesharing Trips',
    value: '8',
    icon: 'svg-icon-ridesharing'
  },
  {
    name: 'Drivers Online',
    value: '42',
    icon: 'svg-icon-drivers'
  },
  {
    name: 'Avg. Trip Time',
    value: '18 min',
    icon: 'svg-icon-time'
  }
]

// Trip data
const activeTrips = ref([
  {
    id: 5001,
    driver: 'John Doe',
    passengers: ['Alice Johnson', 'Bob Smith'],
    from: 'Downtown',
    to: 'Airport',
    distance: 12.5,
    duration: '25 minutes',
    price: 24.50,
    status: 'in progress',
    ridesharing: true,
    date: 'Today',
    time: '10:30 AM',
    vehicle: 'Toyota Camry (ABC-1234)',
    paymentMethod: 'Credit Card'
  },
  {
    id: 5002,
    driver: 'Jane Smith',
    passengers: ['Carol Williams'],
    from: 'Shopping Mall',
    to: 'Residential Area',
    distance: 8.2,
    duration: '15 minutes',
    price: 18.75,
    status: 'picking up',
    ridesharing: false,
    date: 'Today',
    time: '10:45 AM',
    vehicle: 'Honda Civic (XYZ-7890)',
    paymentMethod: 'Cash'
  },
  {
    id: 5003,
    driver: 'Robert Johnson',
    passengers: ['David Brown', 'Eva Davis', 'Frank Miller'],
    from: 'University',
    to: 'Business District',
    distance: 5.7,
    duration: '12 minutes',
    price: 15.25,
    status: 'scheduled',
    ridesharing: true,
    date: 'Today',
    time: '11:15 AM',
    vehicle: 'Ford Focus (DEF-5678)',
    paymentMethod: 'Credit Card'
  },
  {
    id: 5004,
    driver: 'Emily Davis',
    passengers: ['George Wilson'],
    from: 'Airport',
    to: 'Hotel Zone',
    distance: 18.3,
    duration: '35 minutes',
    price: 32.00,
    status: 'accepted',
    ridesharing: false,
    date: 'Today',
    time: '11:30 AM',
    vehicle: 'Hyundai Sonata (GHI-9012)',
    paymentMethod: 'Credit Card'
  },
  {
    id: 5005,
    driver: 'Michael Wilson',
    passengers: ['Helen Taylor', 'Ian Clark'],
    from: 'Conference Center',
    to: 'Downtown',
    distance: 6.8,
    duration: '14 minutes',
    price: 16.50,
    status: 'in progress',
    ridesharing: true,
    date: 'Today',
    time: '10:15 AM',
    vehicle: 'Chevrolet Malibu (JKL-3456)',
    paymentMethod: 'Cash'
  }
])

const tripHistory = ref([
  {
    id: 4001,
    driver: 'John Doe',
    passengers: ['Alice Johnson'],
    from: 'Residential Area',
    to: 'Office Park',
    distance: 7.5,
    duration: '15 minutes',
    price: 17.25,
    status: 'completed',
    ridesharing: false,
    date: 'Yesterday',
    time: '8:30 AM',
    vehicle: 'Toyota Camry (ABC-1234)',
    paymentMethod: 'Credit Card'
  },
  {
    id: 4002,
    driver: 'Jane Smith',
    passengers: ['Bob Smith', 'Carol Williams'],
    from: 'Shopping Mall',
    to: 'Restaurant District',
    distance: 4.2,
    duration: '10 minutes',
    price: 12.50,
    status: 'completed',
    ridesharing: true,
    date: 'Yesterday',
    time: '12:15 PM',
    vehicle: 'Honda Civic (XYZ-7890)',
    paymentMethod: 'Cash'
  },
  {
    id: 4003,
    driver: 'Robert Johnson',
    passengers: ['David Brown'],
    from: 'Hotel Zone',
    to: 'Airport',
    distance: 15.8,
    duration: '30 minutes',
    price: 28.75,
    status: 'cancelled',
    ridesharing: false,
    date: 'Yesterday',
    time: '3:45 PM',
    vehicle: 'Ford Focus (DEF-5678)',
    paymentMethod: 'Credit Card'
  },
  {
    id: 4004,
    driver: 'Emily Davis',
    passengers: ['Eva Davis', 'Frank Miller', 'George Wilson'],
    from: 'University',
    to: 'Downtown',
    distance: 6.3,
    duration: '12 minutes',
    price: 14.00,
    status: 'completed',
    ridesharing: true,
    date: '2 days ago',
    time: '5:30 PM',
    vehicle: 'Hyundai Sonata (GHI-9012)',
    paymentMethod: 'Credit Card'
  },
  {
    id: 4005,
    driver: 'Michael Wilson',
    passengers: ['Helen Taylor'],
    from: 'Business District',
    to: 'Residential Area',
    distance: 9.5,
    duration: '20 minutes',
    price: 22.50,
    status: 'completed',
    ridesharing: false,
    date: '3 days ago',
    time: '7:15 PM',
    vehicle: 'Chevrolet Malibu (JKL-3456)',
    paymentMethod: 'Cash'
  }
])

// Dispute data
const disputes = ref([
  {
    id: 3001,
    tripId: 4001,
    filedBy: 'Alice Johnson (Passenger)',
    originalPrice: 17.25,
    disputedPrice: 14.50,
    reason: 'Driver took a longer route than necessary, which increased the fare.',
    status: 'pending',
    date: 'Yesterday',
    negotiationLogs: [
      {
        role: 'passenger',
        message: 'The driver took a longer route than necessary. I believe the fare should be reduced.',
        time: 'Yesterday, 9:15 AM',
        offeredPrice: 14.50
      },
      {
        role: 'driver',
        message: 'I had to take that route due to construction on the main road.',
        time: 'Yesterday, 10:30 AM',
        offeredPrice: 17.25
      },
      {
        role: 'passenger',
        message: 'There was no construction that I could see. I take this route regularly.',
        time: 'Yesterday, 11:45 AM',
        offeredPrice: 14.50
      }
    ],
    resolution: null
  },
  {
    id: 3002,
    tripId: 4002,
    filedBy: 'Jane Smith (Driver)',
    originalPrice: 12.50,
    disputedPrice: 15.00,
    reason: 'Passengers made multiple stops that were not included in the original fare calculation.',
    status: 'resolved',
    date: 'Yesterday',
    negotiationLogs: [
      {
        role: 'driver',
        message: 'The passengers made two additional stops that weren\'t included in the original fare.',
        time: 'Yesterday, 1:30 PM',
        offeredPrice: 15.00
      },
      {
        role: 'passenger',
        message: 'We only made one additional stop and it was very brief.',
        time: 'Yesterday, 2:15 PM',
        offeredPrice: 13.25
      },
      {
        role: 'driver',
        message: 'The stop at the convenience store and the ATM were both additional stops.',
        time: 'Yesterday, 3:00 PM',
        offeredPrice: 14.50
      }
    ],
    resolution: {
      finalPrice: 14.00,
      note: 'After reviewing the trip logs, there were indeed two additional stops. However, they were brief. A compromise price has been set.',
      resolvedBy: 'Admin',
      date: 'Yesterday, 4:30 PM'
    }
  },
  {
    id: 3003,
    tripId: 4003,
    filedBy: 'Robert Johnson (Driver)',
    originalPrice: 0.00,
    disputedPrice: 10.00,
    reason: 'Passenger cancelled the trip after I had already arrived at the pickup location.',
    status: 'escalated',
    date: '2 days ago',
    negotiationLogs: [
      {
        role: 'driver',
        message: 'The passenger cancelled after I arrived at the pickup location. I should receive a cancellation fee.',
        time: '2 days ago, 4:00 PM',
        offeredPrice: 10.00
      },
      {
        role: 'passenger',
        message: 'I cancelled because the driver was 15 minutes late and I had to make other arrangements.',
        time: '2 days ago, 5:30 PM',
        offeredPrice: 0.00
      },
      {
        role: 'driver',
        message: 'I was only 5 minutes late due to traffic, not 15 minutes.',
        time: '2 days ago, 6:15 PM',
        offeredPrice: 10.00
      }
    ],
    resolution: null
  },
  {
    id: 3004,
    tripId: 4004,
    filedBy: 'Eva Davis (Passenger)',
    originalPrice: 14.00,
    disputedPrice: 10.50,
    reason: 'The ridesharing option was supposed to reduce the fare, but it seems I was charged the full amount.',
    status: 'pending',
    date: '2 days ago',
    negotiationLogs: [
      {
        role: 'passenger',
        message: 'I selected the ridesharing option which should have reduced my fare, but I was charged the full amount.',
        time: '2 days ago, 6:00 PM',
        offeredPrice: 10.50
      },
      {
        role: 'driver',
        message: 'The ridesharing discount was applied, but there were additional charges for the longer route to accommodate all passengers.',
        time: '2 days ago, 7:30 PM',
        offeredPrice: 14.00
      }
    ],
    resolution: null
  },
  {
    id: 3005,
    tripId: 4005,
    filedBy: 'Helen Taylor (Passenger)',
    originalPrice: 22.50,
    disputedPrice: 22.50,
    reason: 'The driver was very rude and unprofessional. I would like a partial refund for the poor service.',
    status: 'resolved',
    date: '3 days ago',
    negotiationLogs: [
      {
        role: 'passenger',
        message: 'The driver was rude and unprofessional throughout the trip. I would like a partial refund for the poor service.',
        time: '3 days ago, 8:00 PM',
        offeredPrice: 15.00
      },
      {
        role: 'driver',
        message: 'I apologize if I came across as rude. I was dealing with a personal emergency call during the trip.',
        time: '3 days ago, 9:15 PM',
        offeredPrice: 22.50
      }
    ],
    resolution: {
      finalPrice: 18.00,
      note: 'While the driver had a personal emergency, professional service is expected. A partial refund has been issued as a goodwill gesture.',
      resolvedBy: 'Admin',
      date: '2 days ago, 10:30 AM'
    }
  }
])

// Trip timeline
const tripTimeline = ref([
  {
    type: 'requested',
    description: 'Trip requested',
    time: '10:15 AM'
  },
  {
    type: 'accepted',
    description: 'Driver accepted trip',
    time: '10:16 AM'
  },
  {
    type: 'arrived',
    description: 'Driver arrived at pickup location',
    time: '10:22 AM'
  },
  {
    type: 'started',
    description: 'Trip started',
    time: '10:25 AM'
  },
  {
    type: 'in progress',
    description: 'Currently in progress',
    time: 'Now'
  }
])

// Table columns
const tripColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'driver', label: 'Driver', sortable: true },
  { key: 'from', label: 'From', sortable: true },
  { key: 'to', label: 'To', sortable: true },
  { key: 'price', label: 'Price ($)', sortable: true },
  { key: 'status', label: 'Status', type: 'status', sortable: true },
  { key: 'ridesharing', label: 'Ridesharing', sortable: true },
  { key: 'date', label: 'Date', sortable: true }
]

const disputeColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'tripId', label: 'Trip ID', sortable: true },
  { key: 'filedBy', label: 'Filed By', sortable: true },
  { key: 'originalPrice', label: 'Original Price ($)', sortable: true },
  { key: 'disputedPrice', label: 'Disputed Price ($)', sortable: true },
  { key: 'status', label: 'Status', type: 'status', sortable: true },
  { key: 'date', label: 'Date', sortable: true }
]

// Filters
const tripFilters = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'picking up', label: 'Picking Up' },
      { value: 'in progress', label: 'In Progress' }
    ]
  },
  {
    key: 'ridesharing',
    label: 'Ridesharing',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  }
]

const historyFilters = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ]
  },
  {
    key: 'ridesharing',
    label: 'Ridesharing',
    options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]
  }
]

const disputeFilters = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'escalated', label: 'Escalated' }
    ]
  }
]

// State variables
const showViewTripModal = ref(false)
const showViewDisputeModal = ref(false)
const showTrackTripModal = ref(false)
const showCancelTripModal = ref(false)
const selectedTrip = ref(null)
const selectedDispute = ref(null)
const resolvedPrice = ref('')
const resolutionNote = ref('')

// Helper functions
const getTripStatusClass = (status) => {
  const statusMap = {
    scheduled: 'bg-gray-100 text-gray-800',
    accepted: 'bg-blue-100 text-blue-800',
    'picking up': 'bg-yellow-100 text-yellow-800',
    'in progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const getTripEventClass = (type) => {
  const typeMap = {
    requested: 'bg-gray-500',
    accepted: 'bg-blue-500',
    arrived: 'bg-yellow-500',
    started: 'bg-purple-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
    'in progress': 'bg-primary'
  }
  
  return typeMap[type.toLowerCase()] || 'bg-gray-500'
}

// Action handlers
const viewTrip = (trip) => {
  selectedTrip.value = trip
  showViewTripModal.value = true
}

const trackTrip = (trip) => {
  selectedTrip.value = trip
  showTrackTripModal.value = true
}

const cancelTrip = (trip) => {
  selectedTrip.value = trip
  showCancelTripModal.value = true
}

const confirmCancelTrip = () => {
  if (selectedTrip.value) {
    const index = activeTrips.value.findIndex(t => t.id === selectedTrip.value.id)
    if (index !== -1) {
      activeTrips.value[index].status = 'cancelled'
      // In a real app, would move this to trip history
      tripHistory.value.unshift({
        ...activeTrips.value[index],
        status: 'cancelled'
      })
      activeTrips.value.splice(index, 1)
    }
    showCancelTripModal.value = false
    showTrackTripModal.value = false
    // In a real app, would make an API call to cancel the trip
  }
}

const viewDispute = (dispute) => {
  selectedDispute.value = dispute
  resolvedPrice.value = dispute.originalPrice.toString()
  resolutionNote.value = ''
  showViewDisputeModal.value = true
}

const resolveDispute = (dispute) => {
  viewDispute(dispute)
}

const escalateDispute = (dispute) => {
  selectedDispute.value = dispute
  confirmEscalateDispute()
}

const confirmResolveDispute = () => {
  if (selectedDispute.value && resolvedPrice.value && resolutionNote.value) {
    const index = disputes.value.findIndex(d => d.id === selectedDispute.value.id)
    if (index !== -1) {
      disputes.value[index].status = 'resolved'
      disputes.value[index].resolution = {
        finalPrice: parseFloat(resolvedPrice.value),
        note: resolutionNote.value,
        resolvedBy: 'Admin',
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
    showViewDisputeModal.value = false
    // In a real app, would make an API call to resolve the dispute
  }
}

const confirmEscalateDispute = () => {
  if (selectedDispute.value) {
    const index = disputes.value.findIndex(d => d.id === selectedDispute.value.id)
    if (index !== -1) {
      disputes.value[index].status = 'escalated'
    }
    showViewDisputeModal.value = false
    // In a real app, would make an API call to escalate the dispute
  }
}

const viewRelatedTrip = (tripId) => {
  const trip = [...activeTrips.value, ...tripHistory.value].find(t => t.id === tripId)
  if (trip) {
    selectedTrip.value = trip
    showViewDisputeModal.value = false
    showViewTripModal.value = true
  }
}

const contactDriver = () => {
  // In a real app, would implement driver contact functionality
  alert('Contacting driver...')
}

const contactPassenger = () => {
  // In a real app, would implement passenger contact functionality
  alert('Contacting passenger...')
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
