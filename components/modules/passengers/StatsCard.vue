<template>
    <div class="bg-white rounded-lg shadow p-5 transition-all duration-300 hover:shadow-md">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ title }}</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900">{{ value }}</p>
        </div>
        <div :class="`rounded-full p-3 bg-${color}-100`">
          <component :is="iconComponent" class="h-6 w-6" :class="`text-${color}-600`" />
        </div>
      </div>
      <div v-if="change !== undefined" class="mt-4">
        <span 
          :class="change >= 0 ? 'text-green-600' : 'text-red-600'"
          class="text-sm font-medium"
        >
          {{ change >= 0 ? '+' : '' }}{{ change }}%
        </span>
        <span class="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { User, Star, Wallet, Users } from 'lucide-vue-next';
  import { computed } from 'vue';
  
  const props = defineProps<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
    change?: number;
  }>();
  
  const iconComponent = computed(() => {
    const icons = {
      user: User,
      star: Star,
      wallet: Wallet,
      users: Users
    };
    return icons[props.icon] || User;
  });
  </script>