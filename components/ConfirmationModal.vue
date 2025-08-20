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
          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
  
          <!-- Content -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              {{ message }}
            </p>
          </div>
  
          <!-- Actions -->
          <div class="flex flex-col mt-10 space-x-6 sm:flex-row gap-3">
            <button
              @click="closeModal"
              class="w-full  px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :disabled="loading"
              :class="[
                'w-full disabled:cursor-not-allowed disabled:opacity-25  px-4 py-3 text-white text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                confirmClass || 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              ]"
            >
              {{ loading ? 'processing..' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    show: boolean
    title: string
    loading: boolean
    message: string
    confirmText?: string
    cancelText?: string
    confirmClass?: string
  }
  
  interface Emits {
    (e: 'update:show', value: boolean): void
    (e: 'confirm'): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  })
  
  const emit = defineEmits<Emits>()
  
  // Methods
  const closeModal = () => {
    emit('update:show', false)
  }
  
  const handleConfirm = () => {
    emit('confirm')
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