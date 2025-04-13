<template>
    <div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Passenger Management</h1>
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
                  v-if="tab.count"
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
      
      <!-- Passenger Table -->
      <ReuseableDataTable
        title="Passengers"
        :columns="columns"
        :data="filteredPassengers"
        :loading="loading"
        :filters="filters"
        search-placeholder="Search passengers..."
        @view="viewPassenger"
        @edit="editPassenger"
        @delete="confirmDeletePassenger"
      >
        <!-- Custom cell renderers -->
        <template #cell-ridesharing="{ value }">
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
              @click="viewPassenger(item)" 
              class="text-primary hover:text-primary-dark"
              title="View passenger details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button 
              @click="editPassenger(item)" 
              class="text-primary hover:text-primary-light"
              title="Edit passenger"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button 
              v-if="item.status !== 'banned'"
              @click="banPassenger(item)" 
              class="text-yellow-600 hover:text-yellow-800"
              title="Ban passenger"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </button>
            
            <button 
              v-else
              @click="unbanPassenger(item)" 
              class="text-green-600 hover:text-green-800"
              title="Unban passenger"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button 
              @click="confirmDeletePassenger(item)" 
              class="text-red-600 hover:text-red-800"
              title="Delete passenger"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </ReuseableDataTable>
      
      <!-- View Passenger Modal -->
      <ReuseableModal
        v-model="showViewPassengerModal"
        title="Passenger Details"
        :show-close-button="true"
      >
        <template #content>
          <div v-if="selectedPassenger" class="space-y-6">
            <!-- Passenger profile header -->
            <div class="flex items-center space-x-4">
              <img 
                :src="selectedPassenger.avatar || '/placeholder.svg?height=80&width=80'" 
                alt="Passenger avatar" 
                class="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ selectedPassenger.name }}</h3>
                <div class="mt-1 flex items-center">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(selectedPassenger.status)"
                  >
                    {{ selectedPassenger.status }}
                  </span>
                  <span class="mx-2 text-gray-500">•</span>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-sm text-gray-600">{{ selectedPassenger.rating }} ({{ selectedPassenger.totalRides }} rides)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Passenger details -->
            <div class="border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPassenger.email }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPassenger.phone }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Joined</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedPassenger.joinedDate) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Last Active</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedPassenger.lastActive }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ridesharing</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="selectedPassenger.ridesharing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ selectedPassenger.ridesharing ? 'Enabled' : 'Disabled' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Location Sharing</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="selectedPassenger.locationSharing ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ selectedPassenger.locationSharing ? 'Enabled' : 'Disabled' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
            
            <!-- Recent rides -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Recent Rides</h4>
              <ul class="mt-2 divide-y divide-gray-200 max-h-60 overflow-y-auto">
                <li v-for="(ride, index) in passengerRides" :key="index" class="py-2">
                  <div class="flex justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ ride.from }} to {{ ride.to }}</p>
                      <p class="text-xs text-gray-500">{{ ride.date }} • Driver: {{ ride.driver }}</p>
                    </div>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': ride.status === 'completed',
                        'bg-yellow-100 text-yellow-800': ride.status === 'in progress',
                        'bg-red-100 text-red-800': ride.status === 'cancelled'
                      }"
                    >
                      {{ ride.status }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            
            <!-- Feedback and complaints -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Feedback & Complaints</h4>
              <ul class="mt-2 divide-y divide-gray-200 max-h-60 overflow-y-auto">
                <li v-for="(feedback, index) in passengerFeedback" :key="index" class="py-2">
                  <div>
                    <div class="flex justify-between">
                      <p class="text-sm font-medium text-gray-900">{{ feedback.type }}</p>
                      <span 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': feedback.status === 'resolved',
                          'bg-yellow-100 text-yellow-800': feedback.status === 'pending',
                          'bg-red-100 text-red-800': feedback.status === 'escalated'
                        }"
                      >
                        {{ feedback.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">{{ feedback.message }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ feedback.date }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </ReuseableModal>
      
      <!-- Edit Passenger Modal -->
      <ReuseableModal
        v-model="showEditPassengerModal"
        title="Edit Passenger"
        primary-button="Save"
        secondary-button="Cancel"
        @primary-click="savePassenger"
        @secondary-click="showEditPassengerModal = false"
      >
        <template #content>
          <form @submit.prevent="savePassenger" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReuseableReuseableFormInput
                v-model="passengerForm.name"
                label="Full Name"
                placeholder="John Doe"
                required
              />
              
              <ReuseableReuseableFormInput
                v-model="passengerForm.email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                required
              />
              
              <ReuseableReuseableFormInput
                v-model="passengerForm.phone"
                label="Phone"
                placeholder="+1 (555) 123-4567"
                required
              />
              
              <ReuseableFormSelect
                v-model="passengerForm.status"
                label="Status"
                :options="[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'banned', label: 'Banned' }
                ]"
                required
              />
              
              <div class="sm:col-span-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">Ridesharing</label>
                  <button 
                    type="button" 
                    @click="passengerForm.ridesharing = !passengerForm.ridesharing"
                    class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    :class="passengerForm.ridesharing ? 'bg-primary' : 'bg-gray-200'"
                  >
                    <span class="sr-only">Toggle ridesharing</span>
                    <span 
                      aria-hidden="true" 
                      class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                      :class="passengerForm.ridesharing ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Allow this passenger to share rides with other passengers</p>
              </div>
              
              <div class="sm:col-span-2">
                <div class="flex items-center justify-between">
                  <label class="block text-sm font-medium text-gray-700">Location Sharing</label>
                  <button 
                    type="button" 
                    @click="passengerForm.locationSharing = !passengerForm.locationSharing"
                    class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    :class="passengerForm.locationSharing ? 'bg-primary' : 'bg-gray-200'"
                  >
                    <span class="sr-only">Toggle location sharing</span>
                    <span 
                      aria-hidden="true" 
                      class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                      :class="passengerForm.locationSharing ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
                <p class="mt-1 text-sm text-gray-500">Allow this passenger to share their location with drivers and other passengers</p>
              </div>
            </div>
          </form>
        </template>
      </ReuseableModal>
      
      <!-- Delete Confirmation Modal -->
      <ReuseableModal
        v-model="showDeleteModal"
        title="Delete Passenger"
        content="Are you sure you want to delete this passenger? This action cannot be undone."
        primary-button="Delete"
        secondary-button="Cancel"
        type="danger"
        @primary-click="deletePassenger"
        @secondary-click="showDeleteModal = false"
      />
      
      <!-- Ban Confirmation Modal -->
      <ReuseableModal
        v-model="showBanModal"
        title="Ban Passenger"
        content="Are you sure you want to ban this passenger? They will not be able to use the platform until unbanned."
        primary-button="Ban"
        secondary-button="Cancel"
        type="warning"
        @primary-click="confirmBanPassenger"
        @secondary-click="showBanModal = false"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  // Mock data for passengers
  const passengers = ref([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active',
      rating: 4.7,
      totalRides: 42,
      joinedDate: '2022-02-10',
      lastActive: '5 minutes ago',
      ridesharing: true,
      locationSharing: true
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '+1 (555) 987-6543',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active',
      rating: 4.2,
      totalRides: 18,
      joinedDate: '2022-03-15',
      lastActive: '2 hours ago',
      ridesharing: false,
      locationSharing: true
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol.williams@example.com',
      phone: '+1 (555) 456-7890',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'banned',
      rating: 2.1,
      totalRides: 7,
      joinedDate: '2022-01-05',
      lastActive: '2 weeks ago',
      ridesharing: false,
      locationSharing: false
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 234-5678',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'active',
      rating: 4.9,
      totalRides: 63,
      joinedDate: '2021-11-20',
      lastActive: '1 day ago',
      ridesharing: true,
      locationSharing: true
    },
    {
      id: 5,
      name: 'Eva Davis',
      email: 'eva.davis@example.com',
      phone: '+1 (555) 876-5432',
      avatar: '/placeholder.svg?height=40&width=40',
      status: 'inactive',
      rating: 3.8,
      totalRides: 12,
      joinedDate: '2022-04-02',
      lastActive: '1 month ago',
      ridesharing: false,
      locationSharing: false
    }
  ])
  
  // Mock data for passenger rides
  const passengerRides = ref([
    {
      id: 1,
      from: 'Home',
      to: 'Office',
      date: 'Today, 8:30 AM',
      driver: 'John Doe',
      status: 'completed'
    },
    {
      id: 2,
      from: 'Office',
      to: 'Restaurant',
      date: 'Yesterday, 12:15 PM',
      driver: 'Jane Smith',
      status: 'completed'
    },
    {
      id: 3,
      from: 'Restaurant',
      to: 'Office',
      date: 'Yesterday, 1:45 PM',
      driver: 'Jane Smith',
      status: 'completed'
    },
    {
      id: 4,
      from: 'Office',
      to: 'Home',
      date: 'Yesterday, 5:30 PM',
      driver: 'Robert Johnson',
      status: 'completed'
    },
    {
      id: 5,
      from: 'Home',
      to: 'Airport',
      date: '3 days ago, 10:00 AM',
      driver: 'Emily Davis',
      status: 'cancelled'
    }
  ])
  
  // Mock data for passenger feedback
  const passengerFeedback = ref([
    {
      id: 1,
      type: 'Complaint',
      message: 'Driver was late by 15 minutes',
      date: '2 days ago',
      status: 'resolved'
    },
    {
      id: 2,
      type: 'Feedback',
      message: 'Great experience with the ridesharing feature',
      date: '1 week ago',
      status: 'resolved'
    },
    {
      id: 3,
      type: 'Complaint',
      message: 'Driver took a longer route than necessary',
      date: '2 weeks ago',
      status: 'pending'
    }
  ])
  
  // Table columns
  const columns = [
    { key: 'avatar', label: '', type: 'image', sortable: false, class: 'w-10' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'totalRides', label: 'Total Rides', sortable: true },
    { key: 'ridesharing', label: 'Ridesharing', sortable: true }
  ]
  
  // Filters
  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'banned', label: 'Banned' }
      ]
    },
    {
      key: 'ridesharing',
      label: 'Ridesharing',
      options: [
        { value: 'true', label: 'Enabled' },
        { value: 'false', label: 'Disabled' }
      ]
    }
  ]
  
  // Tabs
  const tabs = [
    { name: 'All Passengers', value: 'all', count: passengers.value.length },
    { name: 'Active', value: 'active', count: passengers.value.filter(p => p.status === 'active').length },
    { name: 'Inactive', value: 'inactive', count: passengers.value.filter(p => p.status === 'inactive').length },
    { name: 'Banned', value: 'banned', count: passengers.value.filter(p => p.status === 'banned').length }
  ]
  
  // State variables
  const loading = ref(false)
  const activeTab = ref('all')
  const showViewPassengerModal = ref(false)
  const showEditPassengerModal = ref(false)
  const showDeleteModal = ref(false)
  const showBanModal = ref(false)
  const selectedPassenger = ref(null)
  
  // Form state
  const passengerForm = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    status: 'active',
    ridesharing: false,
    locationSharing: false
  })
  
  // Filtered passengers based on active tab
  const filteredPassengers = computed(() => {
    if (activeTab.value === 'all') {
      return passengers.value
    } else {
      return passengers.value.filter(passenger => passenger.status === activeTab.value)
    }
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
      banned: 'bg-red-100 text-red-800'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }
  
  // Action handlers
  const viewPassenger = (passenger: any) => {
    selectedPassenger.value = passenger
    showViewPassengerModal.value = true
  }
  
  const editPassenger = (passenger: any) => {
    passengerForm.value = {
      id: passenger.id,
      name: passenger.name,
      email: passenger.email,
      phone: passenger.phone,
      status: passenger.status,
      ridesharing: passenger.ridesharing,
      locationSharing: passenger.locationSharing
    }
    showEditPassengerModal.value = true
  }
  
  const savePassenger = () => {
    const index = passengers.value.findIndex(p => p.id === passengerForm.value.id)
    if (index !== -1) {
      passengers.value[index] = {
        ...passengers.value[index],
        ...passengerForm.value
      }
    }
    
    showEditPassengerModal.value = false
    // In a real app, would make an API call to save the passenger
  }
  
  const confirmDeletePassenger = (passenger: any) => {
    selectedPassenger.value = passenger
    showDeleteModal.value = true
  }
  
  const deletePassenger = () => {
    if (selectedPassenger.value) {
      passengers.value = passengers.value.filter(p => p.id !== selectedPassenger.value.id)
      showDeleteModal.value = false
      selectedPassenger.value = null
      // In a real app, would make an API call to delete the passenger
    }
  }
  
  const banPassenger = (passenger: any) => {
    selectedPassenger.value = passenger
    showBanModal.value = true
  }
  
  const confirmBanPassenger = () => {
    if (selectedPassenger.value) {
      const index = passengers.value.findIndex(p => p.id === selectedPassenger.value.id)
      if (index !== -1) {
        passengers.value[index].status = 'banned'
      }
      showBanModal.value = false
      selectedPassenger.value = null
      // In a real app, would make an API call to ban the passenger
    }
  }
  
  const unbanPassenger = (passenger: any) => {
    const index = passengers.value.findIndex(p => p.id === passenger.id)
    if (index !== -1) {
      passengers.value[index].status = 'active'
    }
    // In a real app, would make an API call to unban the passenger
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