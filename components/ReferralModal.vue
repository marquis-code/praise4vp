<template>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>
            
            <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Referral Details</h3>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div v-if="referral" class="p-6 space-y-6">
                <!-- Referral Code -->
                <div class="text-center">
                  <div class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                    <span class="text-sm font-medium text-blue-600 mr-2">Referral Code:</span>
                    <span class="text-lg font-bold text-blue-800">{{ referral.referralCode }}</span>
                  </div>
                </div>
                
                <!-- Referrer Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Referrer Information</h4>
                  <div class="flex items-center space-x-4">
                    <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {{ getInitials(referral.referrer.firstName, referral.referrer.lastName) }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ referral.referrer.firstName }} {{ referral.referrer.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ referral.referrer.email }}</div>
                      <div class="text-xs text-gray-400">ID: {{ referral.referrer._id }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Referree Info -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Referree Information</h4>
                  <div class="flex items-center space-x-4">
                    <div class="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      {{ getInitials(referral.referree.firstName, referral.referree.lastName) }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ referral.referree.firstName }} {{ referral.referree.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ referral.referree.email }}</div>
                      <div class="text-xs text-gray-400">ID: {{ referral.referree._id }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Timestamps -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Created At</h4>
                    <div class="text-sm text-gray-900">{{ formatDateTime(referral.createdAt) }}</div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Updated At</h4>
                    <div class="text-sm text-gray-900">{{ formatDateTime(referral.updatedAt) }}</div>
                  </div>
                </div>
                
                <!-- Referral ID -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Referral ID</h4>
                  <div class="text-sm text-gray-900 font-mono">{{ referral._id }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import type { Referral } from '~/types/referral'
  import { format } from 'date-fns'
  
  interface Props {
    isOpen: boolean
    referral: Referral | null
  }
  
  defineProps<Props>()
  defineEmits<{
    close: []
  }>()
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy at hh:mm a')
  }
  </script>
  