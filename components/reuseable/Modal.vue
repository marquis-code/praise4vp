<template>
    <Teleport to="body">
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              @click="closeOnBackdrop && $emit('update:modelValue', false)"
            ></div>
  
            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
            <transition
              enter-active-class="ease-out duration-300"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div 
                v-if="modelValue" 
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                :class="[size === 'lg' ? 'sm:max-w-4xl' : size === 'xl' ? 'sm:max-w-6xl' : 'sm:max-w-lg']"
              >
                <!-- Modal header -->
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <!-- Icon (if provided) -->
                    <div v-if="icon" class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" :class="iconClass">
                      <component :is="icon" class="h-6 w-6" :class="iconColorClass" />
                    </div>
                    
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                        {{ title }}
                      </h3>
                      <div class="mt-2">
                        <slot name="content">
                          <p class="text-sm text-gray-500">
                            {{ content }}
                          </p>
                        </slot>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Modal footer -->
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <slot name="footer">
                    <button 
                      v-if="primaryButton"
                      type="button" 
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      :class="primaryButtonClass"
                      @click="$emit('primary-click')"
                    >
                      {{ primaryButton }}
                    </button>
                    <button 
                      v-if="secondaryButton"
                      type="button" 
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      @click="$emit('secondary-click')"
                    >
                      {{ secondaryButton }}
                    </button>
                    <button 
                      v-if="showCloseButton"
                      type="button" 
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                      @click="$emit('update:modelValue', false)"
                    >
                      Close
                    </button>
                  </slot>
                </div>
                
                <!-- Close button (X) -->
                <button 
                  v-if="showCloseIcon"
                  type="button" 
                  class="absolute top-0 right-0 p-2 m-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  @click="$emit('update:modelValue', false)"
                >
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    modelValue: boolean
    title: string
    content?: string
    primaryButton?: string
    secondaryButton?: string
    showCloseButton?: boolean
    showCloseIcon?: boolean
    closeOnBackdrop?: boolean
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    icon?: any
  }
  
  const props = withDefaults(defineProps<Props>(), {
    content: '',
    showCloseButton: true,
    showCloseIcon: true,
    closeOnBackdrop: true,
    type: 'default',
    size: 'md'
  })
  
  defineEmits(['update:modelValue', 'primary-click', 'secondary-click'])
  
  const iconClass = computed(() => {
    const classes = {
      default: 'bg-primary-light',
      success: 'bg-green-100',
      warning: 'bg-yellow-100',
      danger: 'bg-red-100',
      info: 'bg-blue-100'
    }
    return classes[props.type]
  })
  
  const iconColorClass = computed(() => {
    const classes = {
      default: 'text-white',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      danger: 'text-red-600',
      info: 'text-blue-600'
    }
    return classes[props.type]
  })
  
  const primaryButtonClass = computed(() => {
    const classes = {
      default: 'bg-primary hover:bg-primary-dark text-primary-foreground focus:ring-primary',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
    }
    return classes[props.type]
  })
  </script>