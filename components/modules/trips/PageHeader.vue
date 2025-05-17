<template>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
      <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    description?: string
  }>()
  </script>