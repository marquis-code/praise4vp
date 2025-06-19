<template>
  <div class="min-h-screen rounded-2xl animate-fadeIn">
  <div class="pb-4">
    <button @click="router.back()" class="bg-black rounded-2xl px-6 py-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M232,71.84V184.16a15.92,15.92,0,0,1-24.48,13.34L128,146.86v37.3a15.92,15.92,0,0,1-24.48,13.34L15.33,141.34a15.8,15.8,0,0,1,0-26.68L103.52,58.5A15.91,15.91,0,0,1,128,71.84v37.3L207.52,58.5A15.91,15.91,0,0,1,232,71.84Z"></path></svg>
    </button>
  </div>
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="ml-3 text-gray-600">Loading trip details...</p>
    </div>
    
    <!-- Trip not found -->
    <div v-else-if="!trip" class="flex flex-col items-center justify-center min-h-screen">
      <IconAlertCircle class="h-16 w-16 text-red-500 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Trip Not Found</h2>
      <p class="text-gray-600 mb-6">The trip you're looking for doesn't exist or you don't have permission to view it.</p>
      <button 
        @click="router.push('/dashboard/trips')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <IconArrowLeft class="mr-2 h-4 w-4" />
        Back to Trips
      </button>
    </div>
    
    <!-- Trip details -->
    <div v-else>
      <!-- Trip header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              {{ trip?._id }} 
              <span class="mx-2 text-gray-400">•</span> 
              {{ formatTime(trip?.createdAt) }} 
              <span class="mx-2 text-gray-400">•</span> 
              {{ trip?.driverId?.firstName }} {{ trip?.driverId?.lastName }} 
              <span class="mx-2 text-gray-400">•</span> 
              {{ formatDate(trip?.createdAt) }}
            </h1>
            <span 
              class="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
              :class="getStatusClass(trip?.status)"
            >
              {{ trip.status }}
            </span>
          </div>
          
          <!-- WebSocket Connection Status -->
          <div class="mt-4 md:mt-0 flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div 
                class="w-2 h-2 rounded-full"
                :class="{
                  'bg-green-500 animate-pulse': connectionStatus === 'connected',
                  'bg-yellow-500': connectionStatus === 'connecting',
                  'bg-red-500': connectionStatus === 'disconnected'
                }"
              ></div>
              <span class="text-sm text-gray-600">
                {{ connectionStatus === 'connected' ? 'Live Tracking' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Offline' }}
              </span>
            </div>
            
            <button 
              @click="showActionsDropdown = !showActionsDropdown"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Actions
              <IconChevronDown class="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="border-b border-gray-200 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </button>
          </nav>
        </div>
      </div>
      
      <!-- Map and Trip Info (Details Tab) -->
      <div v-if="activeTab === 'details'" class="relative">

        <div class="bg-white shadow-sm border-b p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-gray-800">🚗 Live Trip Tracking</h1>
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="{
                'bg-green-500 animate-pulse': connectionStatus === 'connected',
                'bg-yellow-500': connectionStatus === 'connecting',
                'bg-red-500': connectionStatus === 'disconnected'
              }"
            ></div>
            <span class="text-sm text-gray-600 capitalize">{{ connectionStatus }}</span>
          </div>
        </div>
        
      </div>
    </div>
        <!-- Map -->
        <div class="h-[calc(100vh-180px)] w-full bg-gray-200 relative">
          <div class="absolute inset-0">
            <RealTimeGoogleMaps
              :trip="trip"
              :real-time-route="realTimeRoute"
              :driver-position="driverPosition"
              :connection-status="connectionStatus"
              :last-update-time="lastUpdateTime"
              :api-key="apiKey"
              @map-ready="onMapReady"
            />
          </div>

          <div v-if="showSidebar" class="w-80 bg-white border-l overflow-hidden flex flex-col">
        <div class="p-4 border-b bg-gray-50">
          <h2 class="font-semibold text-gray-800">📡 Live Events</h2>
          <p class="text-xs text-gray-500 mt-1">Real-time trip updates</p>
        </div>
        
        <div class="flex-1 overflow-y-auto p-4">
          <div class="space-y-3">
            <div
              v-for="(event, index) in tripEvents.slice().reverse().slice(0, 20)"
              :key="index"
              class="text-xs p-3 rounded-lg border-l-4"
              :class="{
                'bg-blue-50 border-blue-400 text-blue-800': event.type === 'route_update',
                'bg-green-50 border-green-400 text-green-800': event.type === 'location_update',
                'bg-yellow-50 border-yellow-400 text-yellow-800': event.type === 'status_update',
                'bg-purple-50 border-purple-400 text-purple-800': event.type === 'pickup' || event.type === 'dropoff',
                'bg-red-50 border-red-400 text-red-800': event.type === 'emergency',
                'bg-gray-50 border-gray-400 text-gray-800': event.type === 'connection'
              }"
            >
              <div class="font-medium mb-1">{{ event.message }}</div>
              <div class="text-gray-500 text-xs">{{ formatTime(event.timestamp) }}</div>
            </div>
            
            <div v-if="tripEvents.length === 0" class="text-center text-gray-500 py-8">
              <div class="text-2xl mb-2">📡</div>
              <p>Waiting for live updates...</p>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t bg-gray-50">
          <div class="text-xs text-gray-600">
            <div>Total Events: {{ tripEvents.length }}</div>
            <div>Last Update: {{ formatTime(lastUpdateTime) }}</div>
          </div>
        </div>
      </div>

          <RouteDebugger
          :trip="trip"
          :real-time-route="realTimeRoute"
          :driver-position="driverPosition"
          :connection-status="connectionStatus"
          :last-update-time="lastUpdateTime"
        />

          
          <!-- Map controls -->
          <div class="absolute top-4 left-4 z-10">
            <button 
              @click="router.push('/dashboard/trips')"
              class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <IconArrowLeft class="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div class="absolute top-4 right-4 z-10 flex space-x-2">
            <button 
              @click="toggleMapType"
              class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <IconMap class="h-5 w-5 text-gray-600" />
            </button>
            <button 
              @click="toggleFullscreen"
              class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
            >
              <IconMaximize2 class="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <!-- Trip Info Card -->
          <div class="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 z-10 animate-slideIn">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Trip Information</h3>
              <div v-if="tripEvents.length > 0" class="text-xs text-gray-500">
                {{ tripEvents.length }} events
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <IconMapPin class="h-6 w-6 text-green-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Pickup</p>
                  <p class="text-sm text-gray-500">{{ getOriginAddress(trip) }}</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <IconFlag class="h-6 w-6 text-red-600" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Dropoff</p>
                  <p class="text-sm text-gray-500">{{ getDestinationAddress(trip) }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                <div>
                  <p class="text-xs text-gray-500">Started At</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDateTime(trip?.createdAt) }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <p class="text-sm font-medium text-gray-900 capitalize">{{ trip?.status }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Driver</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.driverId?.firstName }} {{ trip?.driverId?.lastName }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Trip Type</p>
                  <p class="text-sm font-medium text-gray-900 capitalize">{{ trip?.type }}</p>
                </div>
              </div>
              
              <!-- Real-time Events -->
              <div v-if="tripEvents.length > 0" class="pt-4 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Recent Events</h4>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div 
                    v-for="event in tripEvents.slice(-3)" 
                    :key="event.timestamp"
                    class="text-xs p-2 bg-gray-50 rounded"
                  >
                    <div class="flex justify-between items-start">
                      <span class="font-medium capitalize">{{ event.type.replace('_', ' ') }}</span>
                      <span class="text-gray-500">{{ formatTime(event.timestamp) }}</span>
                    </div>
                    <p class="text-gray-600 mt-1">{{ event.message }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="trip.status === 'active'" class="pt-4 border-t border-gray-200">
                <button 
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <IconPhoneCall class="mr-2 h-4 w-4" />
                  Call Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'passengers'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200 flex justify-end">
            <button 
              @click="downloadPassengersReport"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <IconDownload class="mr-2 h-4 w-4" />
              Download Report
            </button>
          </div>
          
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center space-x-6">
              <label class="inline-flex items-center">
                <input 
                  type="checkbox" 
                  v-model="selectAllPassengers"
                  class="form-checkbox h-4 w-4 text-primary rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Select all passengers</span>
              </label>
              
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  v-model="passengerFilter" 
                  value="pickups"
                  class="form-radio h-4 w-4 text-primary"
                />
                <span class="ml-2 text-sm text-gray-700">Pick ups</span>
              </label>
              
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  v-model="passengerFilter" 
                  value="dropoffs"
                  class="form-radio h-4 w-4 text-primary"
                />
                <span class="ml-2 text-sm text-gray-700">Drop offs</span>
              </label>
            </div>
          </div>
          
          <div v-if="loadingPassengers" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <div v-else-if="!trip.passengers || trip.passengers.length === 0" class="p-8 text-center">
            <IconUsers class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No passengers</h3>
            <p class="mt-1 text-sm text-gray-500">This trip doesn't have any passengers.</p>
          </div>
          
          <div v-else class="relative">
            <button 
              @click="prevLocation" 
              class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              :disabled="currentLocationIndex === 0"
              :class="{ 'opacity-50 cursor-not-allowed': currentLocationIndex === 0 }"
            >
              <IconChevronLeft class="h-6 w-6 text-gray-600" />
            </button>
            
            <button 
              @click="nextLocation" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
              :disabled="currentLocationIndex >= passengerLocations?.length - 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentLocationIndex >= passengerLocations?.length - 1 }"
            >
              <IconChevronRight class="h-6 w-6 text-gray-600" />
            </button>
            
            <div v-if="currentLocation" class="p-4 border-b border-gray-200">
              <div class="flex items-start">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <IconMapPin class="h-6 w-6 text-green-600" />
                </div>
                <div class="ml-3">
                  <h3 class="text-lg font-medium text-gray-900">{{ currentLocation?.address }}</h3>
                  <p class="text-sm text-gray-500">{{ currentLocation?.passengers?.length }} passenger(s)</p>
                </div>
                
                <div class="ml-auto">
                  <button 
                    @click="notifyBusStop"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Notify Bus-Stop
                  </button>
                </div>
              </div>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div 
                v-for="passenger in currentLocationPassengers" 
                :key="passenger._id"
                class="p-4 hover:bg-gray-50"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <input 
                      type="checkbox" 
                      v-model="selectedPassengers" 
                      :value="passenger._id"
                      class="form-checkbox h-4 w-4 text-primary rounded mt-1"
                    />
                  </div>
                  
                  <div class="ml-3 flex-1">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                        {{ getInitials(passenger.passengerId) }}
                      </div>
                      
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ passenger?.passengerId?.firstName }} {{ passenger?.passengerId?.lastName }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ passenger?.passengerId?.email }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex items-start">
                        <IconMapPin class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span class="ml-2 text-sm text-gray-700">{{ passenger?.origin?.properties?.address }}</span>
                      </div>
                      
                      <div class="flex items-start">
                        <IconFlag class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span class="ml-2 text-sm text-gray-700">{{ passenger?.destination?.properties?.address }}</span>
                      </div>
                    </div>
                    
                    <div class="mt-4 flex items-center justify-between">
                      <div class="text-sm text-gray-500">
                        {{ formatCurrency(passenger.totalFare) }}
                      </div>
                      
                      <div class="text-sm text-gray-500">
                        {{ formatDate(trip.createdAt) }}
                      </div>
                      
                      <div>
                        <span 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                          :class="getStatusClass(passenger.passengerStatus)"
                        >
                          {{ passenger.passengerStatus }}
                        </span>
                      </div>
                      
                      <div class="flex space-x-2">
                        <button class="text-gray-400 hover:text-primary">
                          <IconBell class="h-5 w-5" />
                        </button>
                        <button class="text-gray-400 hover:text-primary">
                          <IconMessageSquare class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="!currentLocationPassengers.length" class="p-8 text-center">
                <IconUsers class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No passengers</h3>
                <p class="mt-1 text-sm text-gray-500">There are no passengers at this location.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'issues'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div class="relative w-full sm:w-64">
              <input
                v-model="issuesSearchQuery"
                type="text"
                placeholder="Search issues..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <IconSearch class="w-5 h-5" />
              </span>
            </div>
            
            <button 
              @click="downloadIssuesReport"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <IconDownload class="mr-2 h-4 w-4" />
              Download report
            </button>
          </div>
          
          <div v-if="loadingIssues" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S/N
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incident
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logged By
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="filteredIssues.length === 0">
                  <td colspan="5" class="px-6 py-16 text-center text-sm text-gray-500">
                    No issues reported for this trip
                  </td>
                </tr>
                <tr v-for="(issue, index) in filteredIssues" :key="issue.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ issue.incident }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ issue.resolution }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ issue.loggedBy }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDateTime(issue.time) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="filteredIssues.length > 0" class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div class="text-sm text-gray-700">
              Page {{ currentIssuePage }} of {{ totalIssuePages || 1 }}
            </div>
            <div class="flex space-x-2">
              <button 
                @click="prevIssuePage"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="currentIssuePage <= 1"
                :class="{ 'opacity-50 cursor-not-allowed': currentIssuePage <= 1 }"
              >
                <IconArrowLeft class="mr-2 h-4 w-4" />
                Previous
              </button>
              <button 
                @click="nextIssuePage"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                :disabled="currentIssuePage >= totalIssuePages"
                :class="{ 'opacity-50 cursor-not-allowed': currentIssuePage >= totalIssuePages }"
              >
                Next
                <IconArrowRight class="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div class="p-4 flex justify-center">
            <button 
              @click="showAddIssueModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <IconPlus class="mr-2 h-4 w-4" />
              Report an Issue
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'ratings'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ratings & Reviews</h3>
          
          <div v-if="loadingRatings" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <div v-else class="text-center py-8">
            <IconStar class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No ratings yet</h3>
            <p class="mt-1 text-sm text-gray-500">This trip hasn't been rated yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWebSocketTracking } from '@/composables/useWebSocketTracking'
import { useGetTripById } from "@/composables/modules/trips/useGetTripById"
const { trip, loading, fetchTripById } = useGetTripById()
// import { definePageMeta } from '#app'

// Router and route
const router = useRouter()
const route = useRoute()


const {
  connectionStatus,
  realTimeRoute,
  driverPosition,
  tripEvents,
  lastUpdateTime,
  connect,
  disconnect,
  subscribeToTrip,
  clearTripData
} = useWebSocketTracking()

const showSidebar = ref(true)

// State
const showAddIssueModal = ref(false)
// Loading states
const loadingPassengers = ref(false)
const loadingIssues = ref(false)
const loadingRatings = ref(false)

// Passengers Tab State
const selectAllPassengers = ref(false)
const passengerFilter = ref('pickups')
const selectedPassengers = ref<string[]>([])
const currentLocationIndex = ref(0)


const issues = ref<any[]>([])
const issuesSearchQuery = ref('')
const currentIssuePage = ref(1)
const issuesPerPage = 10

    let map = null;


const filteredIssues = computed(() => {
  let result = [...issues.value]
  
  if (issuesSearchQuery.value) {
    const query = issuesSearchQuery.value.toLowerCase()
    result = result.filter(issue => 
      issue.incident.toLowerCase().includes(query) ||
      issue.resolution.toLowerCase().includes(query) ||
      issue.loggedBy.toLowerCase().includes(query)
    )
  }
  
  // Pagination
  const start = (currentIssuePage.value - 1) * issuesPerPage
  const end = start + issuesPerPage
  
  return result.slice(start, end)
})


// Watch for selectAllPassengers changes
watch(selectAllPassengers, (newValue) => {
  if (newValue) {
    selectedPassengers.value = currentLocationPassengers.value.map(p => p._id)
  } else {
    selectedPassengers.value = []
  }
})

const currentLocationPassengers = computed(() => {
  if (!currentLocation.value) return []
  return currentLocation.value.passengers
})


// Computed properties
const passengerLocations = computed(() => {
  if (!trip.value) return []
  
  // Group passengers by origin or destination based on filter
  const locations: Record<string, any[]> = {}
  
  trip.value.passengers.forEach(passenger => {
    const location = passengerFilter.value === 'pickups' 
      ? passenger.origin.properties.address 
      : passenger.destination.properties.address
    
    if (!locations[location]) {
      locations[location] = []
    }
    
    locations[location].push(passenger)
  })
  
  // Convert to array
  return Object.entries(locations).map(([address, passengers]) => ({
    address,
    passengers
  }))
})


const getInitials = (user: any) => {
  if (!user) return 'NA'
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
}

const currentLocation = computed(() => {
  if (passengerLocations.value.length === 0) return null
  if (currentLocationIndex.value >= passengerLocations.value.length) {
    currentLocationIndex.value = 0
  }
  return passengerLocations.value[currentLocationIndex.value]
})

const totalIssuePages = computed(() => {
  if (issues.value.length === 0) return 0
  return Math.ceil(issues.value.length / issuesPerPage)
})

const handleTripAction = (action: string) => {
  console.log(`Action ${action} for trip ${trip.value?._id}`)
  showActionsDropdown.value = false
  
  // In a real app, these would make API calls
  switch (action) {
    case 'cancel':
      // Cancel trip
      break
    case 'reschedule':
      // Open reschedule modal
      break
    case 'invoice':
      // Generate and download invoice
      break
    case 'share':
      // Share trip
      break
  }
}



// Get trip ID from URL
const tripId = computed(() => route.params.id as string)

// WebSocket tracking composabl

// State
const activeTab = ref('details')
const showActionsDropdown = ref(false)
const mapType = ref('roadmap')
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY


// Tabs
const tabs = [
  { name: 'Details', value: 'details' },
  { name: 'Passengers', value: 'passengers' },
  { name: 'Ratings', value: 'ratings' },
  { name: 'Issues', value: 'issues' }
]

onMounted(() => {
  console.log('🚀 Trip tracking page mounted')
  
  // Connect to WebSocket
  connect()
  
  // Subscribe to the current trip
  subscribeToTrip(route?.params?.id)
})

onUnmounted(() => {
  console.log('🛑 Trip tracking page unmounted')
  disconnect()
})

// Helper functions
const getStatusClass = (status: string) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'active': 'bg-green-100 text-green-800',
    'waiting for driver': 'bg-yellow-100 text-yellow-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getOriginAddress = (trip: any) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers[0].origin.properties.address
  }
  return 'N/A'
}

const getDestinationAddress = (trip: any) => {
  if (trip.passengers && trip.passengers.length > 0) {
    return trip.passengers[0].destination.properties.address
  }
  return 'N/A'
}

const formatTime = (dateString: string) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(amount)
}

// Map methods
const onMapReady = (googleMap) => {
      map = googleMap;
    };

const toggleMapType = () => {
  mapType.value = mapType.value === 'roadmap' ? 'satellite' : 'roadmap'
  console.log('Map type toggled to:', mapType.value)
}

const toggleFullscreen = () => {
  const mapElement = document.querySelector('.google-map-container')
  if (!mapElement) return
  
  if (!document.fullscreenElement) {
    mapElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// Watch for trip ID changes
watch(tripId, async (newTripId) => {
  if (newTripId) {
    await fetchTripById()
    
    // Connect to WebSocket and subscribe to trip
    connect()
    subscribeToTrip(newTripId)
  }
}, { immediate: true })

// Lifecycle hooks
onMounted(async () => {
  // Initialize WebSocket connection
  connect()
  
  // Subscribe to trip if ID is available
  if (tripId.value) {
    subscribeToTrip(tripId.value)
  }
})

onUnmounted(() => {
  // Clean up WebSocket connection
  disconnect()
  clearTripData()
})

// Define page meta for Nuxt
definePageMeta({
  layout: 'dashboard'
})
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
