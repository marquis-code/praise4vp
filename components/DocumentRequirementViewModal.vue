<template>
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>
  
        <!-- Center the modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
  
        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              Document Requirement Details
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
  
          <!-- Content -->
          <div v-if="requirement" class="space-y-6">
            <!-- Document Name -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ requirement.name }}</h4>
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                  </svg>
                  {{ requirement.countryCode }}
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  {{ requirement.documentCode }}
                </span>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    requirement.required
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  ]"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      v-if="requirement.required"
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                    <path 
                      v-else
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ requirement.required ? 'Required' : 'Optional' }}
                </span>
              </div>
            </div>
  
            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                  </svg>
                  <h5 class="text-sm font-medium text-gray-700">Country Code</h5>
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ requirement.countryCode }}</p>
              </div>
  
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h5 class="text-sm font-medium text-gray-700">Document Code</h5>
                </div>
                <p class="text-lg font-semibold text-gray-900">{{ requirement.documentCode }}</p>
              </div>
  
              <div class="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h5 class="text-sm font-medium text-gray-700">Requirement Status</h5>
                </div>
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-3 h-3 rounded-full mr-3',
                      requirement.required ? 'bg-red-500' : 'bg-green-500'
                    ]"
                  ></div>
                  <span class="text-lg font-semibold text-gray-900">
                    {{ requirement.required ? 'Required Document' : 'Optional Document' }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  {{ requirement.required 
                    ? 'This document must be provided for verification.' 
                    : 'This document is optional and may be provided for additional verification.' 
                  }}
                </p>
              </div>
            </div>
  
            <!-- Timestamps -->
            <div v-if="requirement.createdAt || requirement.updatedAt" class="border-t border-gray-200 pt-4">
              <h5 class="text-sm font-medium text-gray-700 mb-3">Timestamps</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div v-if="requirement.createdAt" class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span class="font-medium mr-2">Created:</span>
                  {{ formatDate(requirement.createdAt) }}
                </div>
                <div v-if="requirement.updatedAt" class="flex items-center text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span class="font-medium mr-2">Updated:</span>
                  {{ formatDate(requirement.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
  
          <!-- Loading State -->
          <div v-else class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
  
          <!-- Actions -->
          <div class="flex justify-end pt-6 border-t border-gray-200">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface DocumentRequirement {
    id: string
    countryCode: string
    documentCode: string
    name: string
    required: boolean
    createdAt?: string
    updatedAt?: string
  }
  
  interface Props {
    show: boolean
    requirement?: DocumentRequirement | null
  }
  
  interface Emits {
    (e: 'update:show', value: boolean): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  // Methods
  const closeModal = () => {
    emit('update:show', false)
  }
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }
  
  // Handle escape key
  onMounted(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.show) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  })
  </script>