<template>
    <div>
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="$emit('update:activeTab', tab.value)"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="[
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
      
      <div class="py-6">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    tabs: { name: string; value: string }[];
    activeTab: string;
  }>();
  
  defineEmits<{
    (e: 'update:activeTab', value: string): void;
  }>();
  </script>