<template>
    <div class="bg-white p-5 rounded-lg shadow mb-6 animate-fadeIn">
      <div class="flex flex-col md:flex-row justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2 md:mb-0">Filters</h3>
        <button 
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
        >
          Reset Filters
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Auth Provider</label>
          <select 
            v-model="filters.authProvider"
            class="w-full rounded-md border-[0.5px] p-2.5 text-sm border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Providers</option>
            <option v-for="provider in authProviders" :key="provider" :value="provider">{{ provider }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
          <select 
            v-model="filters.verificationStatus"
            class="w-full rounded-md border-[0.5px] p-2.5 text-sm border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="created">Created</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
          <select 
            v-model="filters.emailVerified"
            class="w-full rounded-md border-[0.5px] p-2.5 text-sm border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
          <select 
            v-model="filters.sortBy"
            class="w-full rounded-md border-[0.5px] p-2.5 text-sm border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          >
            <option value="walletBalance">Wallet Balance (High to Low)</option>
            <option value="name">Name (A-Z)</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    initialFilters?: {
      authProvider: string;
      verificationStatus: string;
      emailVerified: string;
      sortBy: string;
    };
    authProviders: string[];
  }>();
  
  const emit = defineEmits<{
    (e: 'update:filters', filters: {
      authProvider: string;
      verificationStatus: string;
      emailVerified: string;
      sortBy: string;
    }): void;
  }>();
  
  const filters = ref({
    authProvider: props.initialFilters?.authProvider || '',
    verificationStatus: props.initialFilters?.verificationStatus || '',
    emailVerified: props.initialFilters?.emailVerified || '',
    sortBy: props.initialFilters?.sortBy || 'walletBalance'
  });
  
  const resetFilters = () => {
    filters.value = {
      authProvider: '',
      verificationStatus: '',
      emailVerified: '',
      sortBy: 'walletBalance'
    };
  };
  
  watch(filters, (newFilters) => {
    emit('update:filters', newFilters);
  }, { deep: true });
  </script>