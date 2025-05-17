<template>
    <div class="bg-white p-4 rounded-lg shadow mb-6 animate-fadeIn">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
          <select 
            :value="type"
            @input="$emit('update:type', ($event.target as HTMLSelectElement).value)"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Types</option>
            <option value="local">Local</option>
            <option value="airport">Airport</option>
            <option value="intercity">Intercity</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            :value="status"
            @input="$emit('update:status', ($event.target as HTMLSelectElement).value)"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Scheduling</label>
          <select 
            :value="scheduled"
            @input="$emit('update:scheduled', ($event.target as HTMLSelectElement).value)"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Trips</option>
            <option value="scheduled">Scheduled</option>
            <option value="immediate">Immediate</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="$emit('reset')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    type: string
    status: string
    scheduled: string
  }>()
  
  defineEmits<{
    (e: 'update:type', value: string): void
    (e: 'update:status', value: string): void
    (e: 'update:scheduled', value: string): void
    (e: 'reset'): void
  }>()
  </script>