<template>
  <div class="mb-6">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="$emit('update:activeTab', tab.value)"
          class="py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap"
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
    <div class="mt-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: Array<{ name: string; value: string }>;
  activeTab: string;
}>();

defineEmits<{
  (e: 'update:activeTab', value: string): void;
}>();
</script>