<template>
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">Referrer</th>
              <th class="table-header">Referree</th>
              <th class="table-header">Code</th>
              <th class="table-header">Date</th>
              <th class="table-header">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="referral in referrals" :key="referral._id" class="hover:bg-gray-50 transition-colors">
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                      {{ getInitials(referral.referrer.firstName, referral.referrer.lastName) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ referral.referrer.firstName }} {{ referral.referrer.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ referral.referrer.email }}</div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      {{ getInitials(referral.referree.firstName, referral.referree.lastName) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ referral.referree.firstName }} {{ referral.referree.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ referral.referree.email }}</div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ referral.referralCode }}
                </span>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900">{{ formatDate(referral.createdAt) }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(referral.createdAt) }}</div>
              </td>
              <td class="table-cell">
                <button
                  @click="$emit('view-details', referral)"
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="referrals.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">No referrals found</div>
        <div class="text-gray-500 text-sm">Try adjusting your search criteria</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Referral } from '~/types/referral'
  import { format } from 'date-fns'
  
  interface Props {
    referrals: Referral[]
  }
  
  defineProps<Props>()
  defineEmits<{
    'view-details': [referral: Referral]
  }>()
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy')
  }
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'hh:mm a')
  }
  </script>
  