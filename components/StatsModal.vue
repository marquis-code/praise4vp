<template>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
            
            <div class="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Referral Statistics</h3>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div class="p-6">
                <!-- Date Filter -->
                <div class="mb-6 flex flex-wrap gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      v-model="startDate"
                      type="date"
                      class="input-field"
                      @change="loadStats"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      v-model="endDate"
                      type="date"
                      class="input-field"
                      @change="loadStats"
                    />
                  </div>
                  <div class="flex items-end">
                    <button
                      @click="clearFilters"
                      class="btn-secondary"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
                
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div class="text-gray-500 mt-2">Loading statistics...</div>
                </div>
                
                <!-- Stats Content -->
                <div v-else-if="stats" class="space-y-6">
                  <!-- Overview Cards -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div class="flex items-center">
                        <div class="flex-1">
                          <div class="text-blue-100 text-sm font-medium">Total Referrals</div>
                          <div class="text-3xl font-bold">{{ stats.totalReferrals.toLocaleString() }}</div>
                        </div>
                        <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div class="flex items-center">
                        <div class="flex-1">
                          <div class="text-green-100 text-sm font-medium">Total Users</div>
                          <div class="text-3xl font-bold">{{ stats.totalUsers.toLocaleString() }}</div>
                        </div>
                        <div class="bg-green-400 bg-opacity-30 rounded-full p-3">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                      <div class="flex items-center">
                        <div class="flex-1">
                          <div class="text-indigo-100 text-sm font-medium">Recent Referrals</div>
                          <div class="text-3xl font-bold">{{ stats.recentReferrals.toLocaleString() }}</div>
                        </div>
                        <div class="bg-indigo-400 bg-opacity-30 rounded-full p-3">
                          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Top Referrers -->
                  <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h4>
                    <div class="space-y-4">
                      <div
                        v-for="(referrer, index) in stats.topReferrers"
                        :key="referrer.user._id"
                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div class="flex items-center space-x-4">
                          <div class="flex-shrink-0">
                            <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                              {{ getInitials(referrer.user.firstName, referrer.user.lastName) }}
                            </div>
                          </div>
                          <div>
                            <div class="font-medium text-gray-900">
                              {{ referrer.user.firstName }} {{ referrer.user.lastName }}
                            </div>
                            <div class="text-sm text-gray-500">{{ referrer.user.email }}</div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {{ referrer.count }} referrals
                          </span>
                          <div class="text-2xl font-bold text-gray-400">
                            #{{ index + 1 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { ReferralStats } from '~/types/referral'
  import { useReferrals } from '~/composables/useReferrals'
  
  interface Props {
    isOpen: boolean
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<{
    close: []
  }>()
  
  const { getReferralStats, loading } = useReferrals()
  
  const stats = ref<ReferralStats | null>(null)
  const startDate = ref('')
  const endDate = ref('')
  
  const loadStats = async () => {
    try {
      stats.value = await getReferralStats(startDate.value, endDate.value)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }
  
  const clearFilters = () => {
    startDate.value = ''
    endDate.value = ''
    loadStats()
  }
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  
  // Load stats when modal opens
  watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
      loadStats()
    }
  }, { immediate: true })
  </script>
  