<template>
    <div class="relative">
      <button 
        @click="isOpen = !isOpen"
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-150"
      >
        <IconMoreVertical class="h-5 w-5" />
      </button>
      
      <div 
        v-if="isOpen" 
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn"
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <button 
            @click="handleAction('view')"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <IconEye class="mr-2 h-4 w-4" />
            View Details
          </button>
          
          <button 
            v-if="trip.status === 'pending'"
            @click="handleAction('edit')"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <IconEdit class="mr-2 h-4 w-4" />
            Edit Trip
          </button>
          
          <button 
            v-if="trip.status === 'pending'"
            @click="handleAction('cancel')"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <IconXCircle class="mr-2 h-4 w-4" />
            Cancel Trip
          </button>
          
          <button 
            v-if="trip.status === 'pending' && trip.isScheduled"
            @click="handleAction('reschedule')"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <IconCalendar class="mr-2 h-4 w-4" />
            Reschedule
          </button>
          
          <button 
            v-if="trip.status === 'completed'"
            @click="handleAction('invoice')"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <IconFileText class="mr-2 h-4 w-4" />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  
  interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  
  interface Trip {
    _id: string
    primaryUserId: User
    driverId: User
    type: string
    isScheduled: boolean
    scheduledFor: string | null
    status: string
    passengers: any[]
    createdAt: string
    updatedAt: string
    isPrivate: boolean
  }
  
  const props = defineProps<{
    trip: Trip
  }>()
  
  const emit = defineEmits<{
    (e: 'action', action: string, trip: Trip): void
  }>()
  
  const isOpen = ref(false)
  
  const handleAction = (action: string) => {
    emit('action', action, props.trip)
    isOpen.value = false
  }
  
  const handleClickOutside = (event: MouseEvent) => {
    if (isOpen.value && !(event.target as Element).closest('.relative')) {
      isOpen.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>