<template>
    <button 
      @click="$emit('export')"
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
    >
      <IconDownload class="mr-2 h-4 w-4" />
      Export
    </button>
  </template>
  
  <script setup lang="ts">
  defineEmits<{
    (e: 'export'): void
  }>()
  </script>