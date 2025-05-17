<template>
    <div class="bg-white rounded-lg shadow p-5 transform hover:scale-105 transition-all duration-300">
      <div class="flex items-center">
        <div class="flex-shrink-0 rounded-md p-3" :class="`bg-${color}-100`">
          <component 
            :is="`Icon${capitalizeFirstLetter(icon)}`" 
            class="h-6 w-6" 
            :class="`text-${color}-600`" 
          />
        </div>
        <div class="ml-5">
          <div class="text-sm font-medium text-gray-500">{{ title }}</div>
          <div class="mt-1 text-3xl font-semibold text-gray-900">{{ value }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    title: string
    value: number | string
    icon: string
    color: string
  }>()
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  </script>