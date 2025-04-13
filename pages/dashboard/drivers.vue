<template>
    <div>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Driver Management</h1>
        <div class="mt-4 md:mt-0">
          <button 
            @click="showAddDriverModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Driver
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
      
      <!-- Driver Table -->
      <ReuseableDataTable
        title="Drivers"
        :columns="columns"
        :data="filteredDrivers"
        :loading="loading"
        :filters="filters"
        search-placeholder="Search drivers..."
        @view="viewDriver"
        @edit="editDriver"
        @delete="confirmDeleteDriver"
      >
        <!-- Custom cell renderers -->
        <template #cell-documents="{ value }">
          <div class="flex items-center space-x-2">
            <span 
              v-for="(doc, index) in value" 
              :key="index"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="getDocumentStatusClass(doc.status)"
            >
              {{ doc.type }}
            </span>
          </div>
        </template>
        
        <template #cell-availability="{ value }">
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="(day, index) in value" 
              :key="index"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
            >
              {{ day.substring(0, 3) }}
            </span>
          </div>
        </template>
        
        <template #actions="{ item }">
          <div class="flex justify-end space-x-2">
            <button 
              @click="viewDriver(item)" 
              class="text-primary hover:text-primary-dark"
              title="View driver details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button 
              @click="editDriver(item)" 
              class="text-primary hover:text-primary-light"
              title="Edit driver"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button 
              v-if="item.status !== 'suspended'"
              @click="suspendDriver(item)" 
              class="text-yellow-600 hover:text-yellow-800"
              title="Suspend driver"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </button>
            
            <button 
              v-else
              @click="activateDriver(item)" 
              class="text-green-600 hover:text-green-800"
              title="Activate driver"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button 
              @click="confirmDeleteDriver(item)" 
              class="text-red-600 hover:text-red-800"
              title="Delete driver"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </template>
      </ReuseableDataTable>
      
      <!-- View Driver Modal -->
      <ReuseableModal
        v-model="showViewDriverModal"
        title="Driver Details"
        :show-close-button="true"
      >
        <template #content>
          <div v-if="selectedDriver" class="space-y-6">
            <!-- Driver profile header -->
            <div class="flex items-center space-x-4">
              <img 
                :src="selectedDriver.avatar || '/placeholder.svg?height=80&width=80'" 
                alt="Driver avatar" 
                class="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ selectedDriver.name }}</h3>
                <div class="mt-1 flex items-center">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(selectedDriver.status)"
                  >
                    {{ selectedDriver.status }}
                  </span>
                  <span class="mx-2 text-gray-500">•</span>
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-sm text-gray-600">{{ selectedDriver.rating }} ({{ selectedDriver.totalRides }} rides)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Driver details -->
            <div class="border-t border-gray-200 pt-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedDriver.email }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedDriver.phone }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Vehicle</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedDriver.vehicle }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">License Plate</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedDriver.licensePlate }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Joined</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(selectedDriver.joinedDate) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Last Active</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedDriver.lastActive }}</dd>
                </div>
              </dl>
            </div>
            
            <!-- Documents -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Documents</h4>
              <ul class="mt-2 divide-y divide-gray-200">
                <li v-for="(doc, index) in selectedDriver.documents" :key="index" class="py-2 flex justify-between">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm text-gray-900">{{ doc.type }}</span>
                  </div>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getDocumentStatusClass(doc.status)"
                  >
                    {{ doc.status }}
                  </span>
                </li>
              </ul>
            </div>
            
            <!-- Availability -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Availability</h4>
              <div class="mt-2 flex flex-wrap gap-2">
                <span 
                  v-for="(day, index) in selectedDriver.availability" 
                  :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {{ day }}
                </span>
              </div>
            </div>
            
            <!-- Recent rides -->
            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-sm font-medium text-gray-500">Recent Rides</h4>
              <ul class="mt-2 divide-y divide-gray-200 max-h-60 overflow-y-auto">
                <li v-for="(ride, index) in recentRides" :key="index" class="py-2">
                  <div class="flex justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ ride.from }} to {{ ride.to }}</p>
                      <p class="text-xs text-gray-500">{{ ride.date }} • {{ ride.passengers }} passenger(s)</p>
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
          </div>
        </template>
      </ReuseableModal>
      
      <!-- Add/Edit Driver Modal -->
      <ReuseableModal
        v-model="showAddDriverModal"
        :title="isEditing ? 'Edit Driver' : 'Add New Driver'"
        primary-button="Save"
        secondary-button="Cancel"
        @primary-click="saveDriver"
        @secondary-click="showAddDriverModal = false"
      >
        <template #content>
          <form @submit.prevent="saveDriver" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReuseableFormInput
                v-model="driverForm.name"
                label="Full Name"
                placeholder="John Doe"
                required
              />
              
              <ReuseableFormInput
                v-model="driverForm.email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                required
              />
              
              <ReuseableFormInput
                v-model="driverForm.phone"
                label="Phone"
                placeholder="+1 (555) 123-4567"
                required
              />
              
              <ReuseableFormSelect
                v-model="driverForm.status"
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
                v-model="driverForm.vehicle"
                label="Vehicle"
                placeholder="Toyota Camry 2020"
                required
              />
              
              <ReuseableFormInput
                v-model="driverForm.licensePlate"
                label="License Plate"
                placeholder="ABC-1234"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="day in weekdays"
                  :key="day"
                  type="button"
                  @click="toggleAvailability(day)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="driverForm.availability.includes(day) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ day.substring(0, 3) }}
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Documents</label>
              <div class="space-y-2">
                <div 
                  v-for="(doc, index) in driverForm.documents" 
                  :key="index"
                  class="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                >
                  <div>
                    <span class="text-sm font-medium text-gray-900">{{ doc.type }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <ReuseableFormSelect
                      v-model="doc.status"
                      :options="[
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' }
                      ]"
                      class="w-32"
                    />
                    <button 
                      type="button"
                      @click="removeDocument(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <ReuseableFormInput
                    v-model="newDocumentType"
                    placeholder="Document type (e.g., Driver's License)"
                    class="flex-1"
                  />
                  <button 
                    type="button"
                    @click="addDocument"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    :disabled="!newDocumentType"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </form>
        </template>
      </ReuseableModal>
      
      <!-- Delete Confirmation Modal -->
      <ReuseableModal
        v-model="showDeleteModal"
        title="Delete Driver"
        content="Are you sure you want to delete this driver? This action cannot be undone."
        primary-button="Delete"
        secondary-button="Cancel"
        type="danger"
        @primary-click="deleteDriver"
        @secondary-click="showDeleteModal = false"
      />
      
      <!-- Suspend Confirmation Modal -->
      <ReuseableModal
        v-model="showSuspendModal"
        title="Suspend Driver"
        content="Are you sure you want to suspend this driver? They will not be able to accept rides until reactivated."
        primary-button="Suspend"
        secondary-button="Cancel"
        type="warning"
        @primary-click="confirmSuspendDriver"
        @secondary-click="showSuspendModal = false"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import avatarImage from "@/assets/icons/avatar.svg"
  import { ref, computed, onMounted } from 'vue'
//   import ReuseableDataTable from '~/components/ReuseableDataTable.vue'
//   import Modal from '~/components/Modal.vue'
//   import ReuseableFormInput from '~/components/ReuseableFormInput.vue'
//   import ReuseableFormSelect from '~/components/ReuseableFormSelect.vue'
  
  // Mock data for drivers
  const drivers = ref([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar:  avatarImage,
      status: 'active',
      rating: 4.8,
      totalRides: 156,
      vehicle: 'Toyota Camry 2020',
      licensePlate: 'ABC-1234',
      joinedDate: '2022-03-15',
      lastActive: '2 hours ago',
      documents: [
        { type: "Driver's License", status: 'approved' },
        { type: 'Vehicle Insurance', status: 'approved' },
        { type: 'Background Check', status: 'approved' }
      ],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      avatar:  avatarImage,
      status: 'pending',
      rating: 0,
      totalRides: 0,
      vehicle: 'Honda Civic 2019',
      licensePlate: 'XYZ-7890',
      joinedDate: '2022-05-20',
      lastActive: 'Never',
      documents: [
        { type: "Driver's License", status: 'pending' },
        { type: 'Vehicle Insurance', status: 'pending' },
        { type: 'Background Check', status: 'pending' }
      ],
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 (555) 456-7890',
      avatar:  avatarImage,
      status: 'suspended',
      rating: 3.2,
      totalRides: 47,
      vehicle: 'Ford Focus 2018',
      licensePlate: 'DEF-5678',
      joinedDate: '2022-01-10',
      lastActive: '3 days ago',
      documents: [
        { type: "Driver's License", status: 'approved' },
        { type: 'Vehicle Insurance', status: 'rejected' },
        { type: 'Background Check', status: 'approved' }
      ],
      availability: ['Tuesday', 'Thursday', 'Saturday']
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 234-5678',
      avatar:  avatarImage,
      status: 'active',
      rating: 4.9,
      totalRides: 203,
      vehicle: 'Hyundai Sonata 2021',
      licensePlate: 'GHI-9012',
      joinedDate: '2021-11-05',
      lastActive: '5 minutes ago',
      documents: [
        { type: "Driver's License", status: 'approved' },
        { type: 'Vehicle Insurance', status: 'approved' },
        { type: 'Background Check', status: 'approved' }
      ],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    {
      id: 5,
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      phone: '+1 (555) 876-5432',
      avatar:  avatarImage,
      status: 'inactive',
      rating: 4.1,
      totalRides: 78,
      vehicle: 'Chevrolet Malibu 2017',
      licensePlate: 'JKL-3456',
      joinedDate: '2021-09-22',
      lastActive: '2 months ago',
      documents: [
        { type: "Driver's License", status: 'approved' },
        { type: 'Vehicle Insurance', status: 'expired' },
        { type: 'Background Check', status: 'approved' }
      ],
      availability: ['Monday', 'Wednesday', 'Friday']
    }
  ])
  
  // Mock data for recent rides
  const recentRides = ref([
    {
      id: 1,
      from: 'Downtown',
      to: 'Airport',
      date: 'Today, 10:30 AM',
      passengers: 2,
      status: 'completed'
    },
    {
      id: 2,
      from: 'Shopping Mall',
      to: 'Residential Area',
      date: 'Yesterday, 3:45 PM',
      passengers: 1,
      status: 'completed'
    },
    {
      id: 3,
      from: 'University',
      to: 'Business District',
      date: 'Yesterday, 9:15 AM',
      passengers: 3,
      status: 'completed'
    },
    {
      id: 4,
      from: 'Airport',
      to: 'Hotel Zone',
      date: '2 days ago, 11:20 PM',
      passengers: 2,
      status: 'cancelled'
    },
    {
      id: 5,
      from: 'Conference Center',
      to: 'Downtown',
      date: '3 days ago, 5:30 PM',
      passengers: 4,
      status: 'completed'
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
    { key: 'documents', label: 'Documents', sortable: false },
    { key: 'availability', label: 'Availability', sortable: false }
  ]
  
  // Filters
  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]
  
  // Tabs
  const tabs = [
    { name: 'All Drivers', value: 'all', count: drivers.value.length },
    { name: 'Active', value: 'active', count: drivers.value.filter(d => d.status === 'active').length },
    { name: 'Pending', value: 'pending', count: drivers.value.filter(d => d.status === 'pending').length },
    { name: 'Suspended', value: 'suspended', count: drivers.value.filter(d => d.status === 'suspended').length },
    { name: 'Inactive', value: 'inactive', count: drivers.value.filter(d => d.status === 'inactive').length }
  ]
  
  // State variables
  const loading = ref(false)
  const activeTab = ref('all')
  const showViewDriverModal = ref(false)
  const showAddDriverModal = ref(false)
  const showDeleteModal = ref(false)
  const showSuspendModal = ref(false)
  const selectedDriver = ref(null)
  const isEditing = ref(false)
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  // Form state
  const driverForm = ref({
    id: null,
    name: '',
    email: '',
    phone: '',
    status: 'pending',
    vehicle: '',
    licensePlate: '',
    documents: [],
    availability: []
  })
  
  const newDocumentType = ref('')
  
  // Filtered drivers based on active tab
  const filteredDrivers = computed(() => {
    if (activeTab.value === 'all') {
      return drivers.value
    } else {
      return drivers.value.filter(driver => driver.status === activeTab.value)
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
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }
  
  const getDocumentStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }
  
  // Action handlers
  const viewDriver = (driver: any) => {
    selectedDriver.value = driver
    showViewDriverModal.value = true
  }
  
  const editDriver = (driver: any) => {
    isEditing.value = true
    driverForm.value = {
      id: driver.id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      status: driver.status,
      vehicle: driver.vehicle,
      licensePlate: driver.licensePlate,
      documents: [...driver.documents],
      availability: [...driver.availability]
    }
    showAddDriverModal.value = true
  }
  
  const confirmDeleteDriver = (driver: any) => {
    selectedDriver.value = driver
    showDeleteModal.value = true
  }
  
  const deleteDriver = () => {
    if (selectedDriver.value) {
      drivers.value = drivers.value.filter(d => d.id !== selectedDriver.value.id)
      showDeleteModal.value = false
      selectedDriver.value = null
      // In a real app, would make an API call to delete the driver
    }
  }
  
  const suspendDriver = (driver: any) => {
    selectedDriver.value = driver
    showSuspendModal.value = true
  }
  
  const confirmSuspendDriver = () => {
    if (selectedDriver.value) {
      const index = drivers.value.findIndex(d => d.id === selectedDriver.value.id)
      if (index !== -1) {
        drivers.value[index].status = 'suspended'
      }
      showSuspendModal.value = false
      selectedDriver.value = null
      // In a real app, would make an API call to suspend the driver
    }
  }
  
  const activateDriver = (driver: any) => {
    const index = drivers.value.findIndex(d => d.id === driver.id)
    if (index !== -1) {
      drivers.value[index].status = 'active'
    }
    // In a real app, would make an API call to activate the driver
  }
  
  const toggleAvailability = (day: string) => {
    if (driverForm.value.availability.includes(day)) {
      driverForm.value.availability = driverForm.value.availability.filter(d => d !== day)
    } else {
      driverForm.value.availability.push(day)
    }
  }
  
  const addDocument = () => {
    if (newDocumentType.value) {
      driverForm.value.documents.push({
        type: newDocumentType.value,
        status: 'pending'
      })
      newDocumentType.value = ''
    }
  }
  
  const removeDocument = (index: number) => {
    driverForm.value.documents.splice(index, 1)
  }
  
  const saveDriver = () => {
    if (isEditing.value) {
      // Update existing driver
      const index = drivers.value.findIndex(d => d.id === driverForm.value.id)
      if (index !== -1) {
        drivers.value[index] = {
          ...drivers.value[index],
          ...driverForm.value
        }
      }
    } else {
      // Add new driver
      const newDriver = {
        id: drivers.value.length + 1,
        ...driverForm.value,
        avatar:  avatarImage,
        rating: 0,
        totalRides: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now'
      }
      drivers.value.push(newDriver)
    }
    
    // Reset form and close modal
    resetForm()
    showAddDriverModal.value = false
    // In a real app, would make an API call to save the driver
  }
  
  const resetForm = () => {
    driverForm.value = {
      id: null,
      name: '',
      email: '',
      phone: '',
      status: 'pending',
      vehicle: '',
      licensePlate: '',
      documents: [],
      availability: []
    }
    newDocumentType.value = ''
    isEditing.value = false
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