<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
    >
      <div class="flex items-center justify-between h-16 px-4 border-b border-primary-light">
        <div class="flex items-center">
          <img src="@/assets/img/logo-white.png" alt="CoMiles Logo" class="h-8 mx-auto mb-4" />
        </div>
        <button 
          class="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-primary"
          @click="isSidebarOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <nav class="mt-5 px-2">
        <div class="space-y-1">
          <NuxtLink 
            to="/dashboard" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="{ 'bg-primary-light text-white': isActive('/dashboard'), 'text-gray-300 hover:bg-primary-light hover:text-white': !isActive('/dashboard') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </NuxtLink>
          
          <div class="mt-4 mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            User Management
          </div>
          
          <NuxtLink 
            to="/dashboard/drivers" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="{ 'bg-primary-light text-white': isActive('/dashboard/drivers'), 'text-gray-300 hover:bg-primary-light hover:text-white': !isActive('/dashboard/drivers') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Drivers
          </NuxtLink>

          <NuxtLink 
            to="/dashboard/drivers" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="{ 'bg-primary-light text-white': isActive('/dashboard/customer-support'), 'text-gray-300 hover:bg-primary-light hover:text-white': !isActive('/dashboard/customer-support') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Customer Support
          </NuxtLink>
          
          <NuxtLink 
            to="/dashboard/passengers" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="{ 'bg-primary-light text-white': isActive('/dashboard/passengers'), 'text-gray-300 hover:bg-primary-light hover:text-white': !isActive('/dashboard/passengers') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Passengers
          </NuxtLink>
          
          <NuxtLink 
            to="/dashboard/package-delivery" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="{ 'bg-primary-light text-white': isActive('/dashboard/package-delivery'), 'text-gray-300 hover:bg-primary-light hover:text-white': !isActive('/dashboard/package-delivery') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Package Delivery
          </NuxtLink>

          <NuxtLink 
            to="/dashboard/trips" 
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md"
            :class="{ 'bg-primary-light text-white': isActive('/dashboard/trips'), 'text-gray-300 hover:bg-primary-light hover:text-white': !isActive('/dashboard/trips') }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Trips
          </NuxtLink>
        </div>
      </nav>
      
      <div class="absolute bottom-0 w-full border-t border-primary-light p-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path></svg>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
            <button 
              @click="showLogoutModal = true" 
              class="text-xs text-gray-300 flex items-center mt-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top navigation -->
      <header class="bg-white shadow-sm z-10">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <button 
            class="p-1 rounded-md text-gray-500 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary"
            @click="isSidebarOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="w-full flex justify-end items-end">
            <div class="relative  w-full flex justify-end items-end">
              <button 
                @click="isNotificationsOpen = !isNotificationsOpen" 
                class="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span class="sr-only">View notifications</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
              </button>
              

              <div 
                v-if="isNotificationsOpen" 
                class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <div class="px-4 py-2 border-b border-gray-200">
                    <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div class="max-h-60 overflow-y-auto">
                    <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
                      No new notifications
                    </div>
                    <a 
                      v-for="notification in notifications" 
                      :key="notification.id" 
                      href="#" 
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div class="flex items-start">
                        <div class="flex-shrink-0">
                          <span 
                            class="inline-block h-2 w-2 rounded-full"
                            :class="{
                              'bg-primary': notification.type === 'info',
                              'bg-success': notification.type === 'success',
                              'bg-warning': notification.type === 'warning',
                              'bg-danger': notification.type === 'danger'
                            }"
                          ></span>
                        </div>
                        <div class="ml-3 w-0 flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                          <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                          <p class="mt-1 text-xs text-gray-400">{{ notification.time }}</p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class="border-t border-gray-200 px-4 py-2">
                    <a href="#" class="text-xs font-medium text-primary hover:text-primary-dark">View all notifications</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main content area -->
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>

    <!-- Logout confirmation modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showLogoutModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Background overlay with blur -->
        <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" @click="showLogoutModal = false"></div>
        
        <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
          <!-- Modal panel -->
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="showLogoutModal" class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Confirm Logout
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to logout? You will need to sign in again to access your account.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="confirmLogout"
                >
                  Logout
                </button>
                <button 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                  @click="showLogoutModal = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const isSidebarOpen = ref(false)
const isNotificationsOpen = ref(false)
const showLogoutModal = ref(false)

// Mock notifications data
const notifications = ref([
  {
    id: 1,
    type: 'info',
    title: 'New driver application',
    message: 'John Doe has applied to become a driver',
    time: '5 minutes ago'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Passenger complaint',
    message: 'Jane Smith has reported an issue with their ride',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'success',
    title: 'Package delivered',
    message: 'Package #12345 has been successfully delivered',
    time: '3 hours ago'
  }
])

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const confirmLogout = async () => {
  await logout()
  showLogoutModal.value = false
  router.push('/login')
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.notifications-dropdown')) {
      isNotificationsOpen.value = false
    }
  })
})
</script>