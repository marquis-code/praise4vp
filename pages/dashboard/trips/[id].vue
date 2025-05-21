<template>
  <div class="min-h-screen bg-gray-50 rounded-2xl p-2 animate-fadeIn">
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
        @click="router.push('/trips')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <IconArrowLeft class="mr-2 h-4 w-4" />
        Back to Trips
      </button>
    </div>
    
    <!-- Trip details -->
    <div v-else>
      <!-- Trip header -->
      <div class="">
        <div class="max-w-7xl mx-auto">
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
            
            <div class="mt-4 md:mt-0">
              <div class="relative">
                <button 
                  @click="showActionsDropdown = !showActionsDropdown"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Actions
                  <IconChevronDown class="ml-2 h-4 w-4" />
                </button>
                
                <div 
                  v-if="showActionsDropdown" 
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn"
                >
                  <div class="py-1" role="menu" aria-orientation="vertical">
                    <button 
                      v-if="trip.status === 'active' || trip.status === 'pending'"
                      @click="handleTripAction('cancel')"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <IconXCircle class="mr-2 h-4 w-4" />
                      Cancel Trip
                    </button>
                    
                    <button 
                      v-if="trip.status === 'pending' && trip.isScheduled"
                      @click="handleTripAction('reschedule')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconCalendar class="mr-2 h-4 w-4" />
                      Reschedule
                    </button>
                    
                    <button 
                      v-if="trip.status === 'completed'"
                      @click="handleTripAction('invoice')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconFileText class="mr-2 h-4 w-4" />
                      Download Invoice
                    </button>
                    
                    <button 
                      @click="handleTripAction('share')"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <IconShare2 class="mr-2 h-4 w-4" />
                      Share Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
        <!-- Map -->
        <div class="h-[calc(100vh-180px)] w-full bg-gray-200 relative">
          <div class="absolute inset-0">
            <ModulesTripsGoogleMaps
              :origin="getOriginCoordinates(trip)"
              :destination="getDestinationCoordinates(trip)"
              :markers="getMapMarkers(trip)"
              :apiKey="apiKey"
            />
          </div>
          
          <!-- Map controls -->
          <div class="absolute top-4 left-4 z-10">
            <button 
              @click="router.push('/trips')"
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
            <h3 class="text-lg font-medium text-gray-900 mb-4">Trip Information</h3>
            
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
                  <p class="text-xs text-gray-500">Distance</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.distance || 'N/A' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Duration</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.duration || 'N/A' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <p class="text-sm font-medium text-gray-900 capitalize">{{ trip?.status }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Route Code</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?._id }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Driver</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.driverId?.firstName }} {{ trip?.driverId?.lastName }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Driver's Phone</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.driverPhone || 'N/A' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Vehicle</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.vehicle || 'N/A' }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Primary User</p>
                  <p class="text-sm font-medium text-gray-900">{{ trip?.primaryUserId?.firstName }} {{ trip?.primaryUserId?.lastName }}</p>
                </div>
                
                <div>
                  <p class="text-xs text-gray-500">Trip Type</p>
                  <p class="text-sm font-medium text-gray-900 capitalize">{{ trip?.type }}</p>
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
      
      <!-- Passengers Tab -->
      <div v-else-if="activeTab === 'passengers'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <!-- Download Report Button -->
          <div class="p-4 border-b border-gray-200 flex justify-end">
            <button 
              @click="downloadPassengersReport"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <IconDownload class="mr-2 h-4 w-4" />
              Download Report
            </button>
          </div>
          
          <!-- Filter Options -->
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
          
          <!-- Loading State -->
          <div v-if="loadingPassengers" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!trip.passengers || trip.passengers.length === 0" class="p-8 text-center">
            <IconUsers class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No passengers</h3>
            <p class="mt-1 text-sm text-gray-500">This trip doesn't have any passengers.</p>
          </div>
          
          <!-- Passenger Locations -->
          <div v-else class="relative">
            <!-- Navigation Arrows -->
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
            
            <!-- Location Header -->
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
            
            <!-- Passengers List -->
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
      
      <!-- Issues Tab -->
      <div v-else-if="activeTab === 'issues'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <!-- Search and Download -->
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
          
          <!-- Loading State -->
          <div v-if="loadingIssues" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <!-- Issues Table -->
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
          
          <!-- Pagination -->
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
          
          <!-- Add Issue Button -->
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
      
      <!-- Ratings Tab -->
      <div v-else-if="activeTab === 'ratings'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ratings & Reviews</h3>
          
          <!-- Loading State -->
          <div v-if="loadingRatings" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <IconStar class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No ratings yet</h3>
            <p class="mt-1 text-sm text-gray-500">This trip hasn't been rated yet.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add Issue Modal -->
    <div v-if="showAddIssueModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showAddIssueModal = false"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <IconAlertTriangle class="h-6 w-6 text-red-600" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Report an Issue
                </h3>
                <div class="mt-4">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                    <select 
                      v-model="newIssue.type"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    >
                      <option value="">Select incident type</option>
                      <option value="delay">Delay</option>
                      <option value="cancellation">Cancellation</option>
                      <option value="driver">Driver Issue</option>
                      <option value="vehicle">Vehicle Issue</option>
                      <option value="payment">Payment Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      v-model="newIssue.description"
                      rows="4"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      placeholder="Describe the issue in detail..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="submitIssue"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="!newIssue.type || !newIssue.description"
              :class="{ 'opacity-50 cursor-not-allowed': !newIssue.type || !newIssue.description }"
            >
              Submit Issue
            </button>
            <button 
              type="button" 
              @click="showAddIssueModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGetTripById } from "@/composables/modules/trips/useGetTripById"

// Router and route
const router = useRouter()
const route = useRoute()

// Fetch trip data from composable
const { loading, trip } = useGetTripById()

// State
const activeTab = ref('details')
const showActionsDropdown = ref(false)
const showAddIssueModal = ref(false)
const mapType = ref('roadmap')
const apiKey = ref(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

// Loading states
const loadingPassengers = ref(false)
const loadingIssues = ref(false)
const loadingRatings = ref(false)

// Passengers Tab State
const selectAllPassengers = ref(false)
const passengerFilter = ref('pickups')
const selectedPassengers = ref<string[]>([])
const currentLocationIndex = ref(0)

// Issues Tab State
const issues = ref<any[]>([])
const issuesSearchQuery = ref('')
const currentIssuePage = ref(1)
const issuesPerPage = 10
const newIssue = ref({
  type: '',
  description: ''
})

// Tabs
const tabs = [
  { name: 'Details', value: 'details' },
  { name: 'Passengers', value: 'passengers' },
  { name: 'Ratings', value: 'ratings' },
  { name: 'Issues', value: 'issues' }
]

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

const currentLocation = computed(() => {
  if (passengerLocations.value.length === 0) return null
  if (currentLocationIndex.value >= passengerLocations.value.length) {
    currentLocationIndex.value = 0
  }
  return passengerLocations.value[currentLocationIndex.value]
})

const currentLocationPassengers = computed(() => {
  if (!currentLocation.value) return []
  return currentLocation.value.passengers
})

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

const totalIssuePages = computed(() => {
  if (issues.value.length === 0) return 0
  return Math.ceil(issues.value.length / issuesPerPage)
})

// Watch for selectAllPassengers changes
watch(selectAllPassengers, (newValue) => {
  if (newValue) {
    selectedPassengers.value = currentLocationPassengers.value.map(p => p._id)
  } else {
    selectedPassengers.value = []
  }
})

// Watch for tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'passengers') {
    loadPassengers()
  } else if (newTab === 'issues') {
    loadIssues()
  } else if (newTab === 'ratings') {
    loadRatings()
  }
})

// Methods
const loadPassengers = async () => {
  if (!trip.value || !trip.value.passengers) return
  
  loadingPassengers.value = true
  try {
    // In a real app, you might need to fetch additional passenger data
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Error loading passengers:', error)
  } finally {
    loadingPassengers.value = false
  }
}

const loadIssues = async () => {
  loadingIssues.value = true
  try {
    // In a real app, you would fetch issues from an API
    // For now, we'll just simulate a delay and set empty issues
    await new Promise(resolve => setTimeout(resolve, 500))
    issues.value = []
  } catch (error) {
    console.error('Error loading issues:', error)
  } finally {
    loadingIssues.value = false
  }
}

const loadRatings = async () => {
  loadingRatings.value = true
  try {
    // In a real app, you would fetch ratings from an API
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Error loading ratings:', error)
  } finally {
    loadingRatings.value = false
  }
}

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

const getOriginCoordinates = (trip: any) => {
  if (trip.passengers && trip.passengers.length > 0) {
    const coords = trip.passengers[0].origin.geometry.coordinates
    return { lat: coords[1], lng: coords[0] }
  }
  return { lat: 0, lng: 0 }
}

const getDestinationCoordinates = (trip: any) => {
  if (trip.passengers && trip.passengers.length > 0) {
    const coords = trip.passengers[0].destination.geometry.coordinates
    return { lat: coords[1], lng: coords[0] }
  }
  return { lat: 0, lng: 0 }
}

const getMapMarkers = (trip: any) => {
  const markers = []
  
  if (trip.passengers && trip.passengers.length > 0) {
    const originCoords = trip.passengers[0].origin.geometry.coordinates
    const destCoords = trip.passengers[0].destination.geometry.coordinates
    
    markers.push({
      position: { lat: originCoords[1], lng: originCoords[0] },
      title: 'Pickup',
      icon: 'pickup'
    })
    
    markers.push({
      position: { lat: destCoords[1], lng: destCoords[0] },
      title: 'Dropoff',
      icon: 'dropoff'
    })
  }
  
  return markers
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

const getInitials = (user: any) => {
  if (!user) return 'NA'
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
}

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

// Map methods
const toggleMapType = () => {
  mapType.value = mapType.value === 'roadmap' ? 'satellite' : 'roadmap'
  console.log('Map type toggled to:', mapType.value)
  // In a real implementation, this would update the map type
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

// Passengers tab methods
const prevLocation = () => {
  if (currentLocationIndex.value > 0) {
    currentLocationIndex.value--
  }
}

const nextLocation = () => {
  if (currentLocationIndex.value < passengerLocations.value.length - 1) {
    currentLocationIndex.value++
  }
}

const notifyBusStop = () => {
  console.log('Notifying bus stop:', currentLocation.value?.address)
  // In a real app, this would make an API call
  alert(`Notification sent to ${currentLocation.value?.address}`)
}

const downloadPassengersReport = () => {
  console.log('Downloading passengers report')
  // In a real app, this would generate and download a report
  alert('Passengers report would be downloaded here')
}

// Issues tab methods
const prevIssuePage = () => {
  if (currentIssuePage.value > 1) {
    currentIssuePage.value--
  }
}

const nextIssuePage = () => {
  if (currentIssuePage.value < totalIssuePages.value) {
    currentIssuePage.value++
  }
}

const downloadIssuesReport = () => {
  console.log('Downloading issues report')
  // In a real app, this would generate and download a report
  alert('Issues report would be downloaded here')
}

const submitIssue = () => {
  console.log('Submitting issue:', newIssue.value)
  
  // In a real app, this would make an API call
  // For now, we'll add it to our local issues array
  const now = new Date()
  
  issues.value.push({
    id: `issue-${issues.value.length + 1}`,
    incident: newIssue.value.description,
    resolution: 'Pending',
    loggedBy: 'Current User',
    time: now.toISOString()
  })
  
  // Reset form and close modal
  newIssue.value = {
    type: '',
    description: ''
  }
  showAddIssueModal.value = false
  
  // Switch to issues tab
  activeTab.value = 'issues'
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (showActionsDropdown.value && !(event.target as Element).closest('.relative')) {
    showActionsDropdown.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Import definePageMeta
import { definePageMeta } from '#imports'

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