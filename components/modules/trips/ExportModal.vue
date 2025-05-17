<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
  
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-light sm:mx-0 sm:h-10 sm:w-10">
                <IconDownload class="h-6 w-6 text-primary" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Export Trips Data
                </h3>
                <div class="mt-4">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                    <div class="flex space-x-4">
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="exportFormat" value="csv" class="form-radio h-4 w-4 text-primary" />
                        <span class="ml-2">CSV</span>
                      </label>
                      <label class="inline-flex items-center">
                        <input type="radio" v-model="exportFormat" value="pdf" class="form-radio h-4 w-4 text-primary" />
                        <span class="ml-2">PDF</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Select Columns to Export</label>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                      <label v-for="column in availableColumns" :key="column.value" class="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          :value="column.value" 
                          v-model="selectedColumns" 
                          class="form-checkbox h-4 w-4 text-primary rounded"
                        />
                        <span class="ml-2 text-sm">{{ column.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="handleExport"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="selectedColumns.length === 0"
            >
              Export
            </button>
            <button 
              type="button" 
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  defineProps<{
    show: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'export', format: string, options: any): void
  }>()
  
  const exportFormat = ref('csv')
  const selectedColumns = ref(['passenger', 'driver', 'status', 'type', 'fare', 'date'])
  
  const availableColumns = [
    { label: 'Passenger', value: 'passenger' },
    { label: 'Driver', value: 'driver' },
    { label: 'Status', value: 'status' },
    { label: 'Trip Type', value: 'type' },
    { label: 'Fare', value: 'fare' },
    { label: 'Date', value: 'date' },
    { label: 'Origin', value: 'origin' },
    { label: 'Destination', value: 'destination' }
  ]
  
  const handleExport = () => {
    if (selectedColumns.value.length === 0) {
      return
    }
    
    emit('export', exportFormat.value, {
      columns: selectedColumns.value
    })
  }
  </script>