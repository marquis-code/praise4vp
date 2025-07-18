<template>
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Referral Management
              </h1>
              <p class="text-gray-600">
                Grow your rider community with strategic referral campaigns
              </p>
            </div>
          </div>
  
          <!-- Go back button -->
          <button
            @click="router.back()"
            class="inline-flex items-center text-sm px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition-colors border border-gray-300"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Go back
          </button>
        </div>
  
        <!-- Filters and Search Section -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="relative flex-1 max-w-md">
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search referrers, codes, or campaigns..."
                class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
  
            <div class="flex flex-col sm:flex-row gap-3">
              <select
                v-model="statusFilter"
                class="px-4 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
  
              <select
                v-model="campaignFilter"
                class="px-4 py-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Campaigns</option>
                <option value="New Rider Bonus">New Rider Bonus</option>
                <option value="Driver Recruitment">Driver Recruitment</option>
                <option value="Holiday Special">Holiday Special</option>
                <option value="Student Discount">Student Discount</option>
              </select>
  
              <button
                @click="downloadReport"
                class="flex items-center text-sm px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>
  
        <!-- Table -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Desktop Table -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Referrer
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Referral Code
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Campaign
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Successful Referrals
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Earnings
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="referral in filteredReferrals"
                  :key="referral.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      v-model="selectedReferrals"
                      :value="referral.id"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          class="h-10 w-10 rounded-full"
                          :src="`https://ui-avatars.com/api/?name=${referral.referrerName}&background=3B82F6&color=fff`"
                          :alt="referral.referrerName"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ referral.referrerName }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ referral.referrerEmail }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span
                        class="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900"
                        >{{ referral.code }}</span
                      >
                      <button
                        @click="copyCode(referral.code)"
                        class="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                    >
                      {{ referral.campaign }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex items-center">
                      <span class="font-semibold">{{
                        referral.successfulReferrals
                      }}</span>
                      <span class="text-gray-500 ml-1"
                        >/ {{ referral.totalReferrals }}</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="font-semibold text-green-600"
                      >₦{{ referral.totalEarnings.toLocaleString() }}</span
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        referral.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : referral.status === 'Inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ referral.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewReferralDetails(referral)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        @click="editReferral(referral)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        @click="toggleReferralStatus(referral)"
                        class="text-gray-600 hover:text-gray-900"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Mobile Cards -->
          <div class="lg:hidden">
            <div
              v-for="referral in filteredReferrals"
              :key="referral.id"
              class="p-4 border-b border-gray-200 last:border-b-0"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="selectedReferrals"
                    :value="referral.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                  />
                  <div class="flex-shrink-0 h-10 w-10 mr-3">
                    <img
                      class="h-10 w-10 rounded-full"
                      :src="`https://ui-avatars.com/api/?name=${referral.referrerName}&background=3B82F6&color=fff`"
                      :alt="referral.referrerName"
                    />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ referral.referrerName }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ referral.referrerEmail }}
                    </div>
                  </div>
                </div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    referral.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : referral.status === 'Inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ referral.status }}
                </span>
              </div>
  
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{{
                    referral.code
                  }}</span>
                  <button
                    @click="copyCode(referral.code)"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </button>
                </div>
  
                <div class="flex items-center justify-between">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                  >
                    {{ referral.campaign }}
                  </span>
                  <span class="text-sm font-semibold text-green-600"
                    >₦{{ referral.totalEarnings.toLocaleString() }}</span
                  >
                </div>
  
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Referrals:</span>
                  <span class="font-medium"
                    >{{ referral.successfulReferrals }} /
                    {{ referral.totalReferrals }}</span
                  >
                </div>
  
                <div class="flex space-x-2 pt-2">
                  <button
                    @click="viewReferralDetails(referral)"
                    class="flex-1 px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                  >
                    View Details
                  </button>
                  <button
                    @click="editReferral(referral)"
                    class="flex-1 px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleReferralStatus(referral)"
                    class="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredReferrals.length === 0" class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No referral codes found
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      </div>
  
      <!-- Create Referral Code Modal -->
      <div
        v-if="showCreateReferralModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <h2 class="text-xl font-bold mb-4">Create Referral Code</h2>
          <form @submit.prevent="createReferralCode">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Referrer Name</label
                >
                <input
                  v-model="newReferral.referrerName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter referrer name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Referrer Email</label
                >
                <input
                  v-model="newReferral.referrerEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter referrer email"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Referral Code</label
                >
                <div class="flex">
                  <input
                    v-model="newReferral.code"
                    type="text"
                    required
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter or generate code"
                  />
                  <button
                    type="button"
                    @click="generateReferralCode"
                    class="px-3 py-2 bg-gray-200 hover:bg-gray-300 border border-l-0 border-gray-300 rounded-r-lg"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Campaign</label
                >
                <select
                  v-model="newReferral.campaign"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select campaign</option>
                  <option value="New Rider Bonus">New Rider Bonus</option>
                  <option value="Driver Recruitment">Driver Recruitment</option>
                  <option value="Holiday Special">Holiday Special</option>
                  <option value="Student Discount">Student Discount</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Referrer Reward (₦)</label
                >
                <input
                  v-model="newReferral.referrerReward"
                  type="number"
                  required
                  min="0"
                  step="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Referee Reward (₦)</label
                >
                <input
                  v-model="newReferral.refereeReward"
                  type="number"
                  required
                  min="0"
                  step="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Max Referrals</label
                >
                <input
                  v-model="newReferral.maxReferrals"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Expires At</label
                >
                <input
                  v-model="newReferral.expiresAt"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Special Conditions</label
              >
              <textarea
                v-model="newReferral.conditions"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., First-time riders only, minimum trip value ₦500"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showCreateReferralModal = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                Create Referral Code
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Referral Details Modal -->
      <!-- <div v-if="showDetailsModal && selectedReferralForDetails" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-xl font-bold">Referral Details</h2>
              <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap -->
    </div>
  </template>
  
  <script setup lang="ts">
  // Types
  interface Referral {
    id: number;
    referrerName: string;
    referrerEmail: string;
    code: string;
    campaign: string;
    successfulReferrals: number;
    totalReferrals: number;
    totalEarnings: number;
    status: "Active" | "Inactive" | "Suspended";
    referrerReward: number;
    refereeReward: number;
    maxReferrals: number | null;
    expiresAt: string;
    conditions: string;
    createdAt: string;
    lastUsed: string | null;
  }
  
  definePageMeta({
    layout: "dashboard",
  });
  
  interface NewReferral {
    id?: number;
    referrerName: string;
    referrerEmail: string;
    code: string;
    campaign: string;
    referrerReward: number;
    refereeReward: number;
    maxReferrals: number | null;
    expiresAt: string;
    conditions: string;
  }
  
  // Reactive state
  const showCreateReferralModal = ref(false);
  const showDetailsModal = ref(false);
  const showBulkActionsModal = ref(false);
  
  // Selection states
  const selectAll = ref(false);
  const selectedReferrals = ref<number[]>([]);
  const selectedReferralForDetails = ref<Referral | null>(null);
  
  // Filter states
  const searchQuery = ref("");
  const statusFilter = ref("");
  const campaignFilter = ref("");
  
  // Form data for new referral
  const newReferral = ref<NewReferral>({
    referrerName: "",
    referrerEmail: "",
    code: "",
    campaign: "",
    referrerReward: 500,
    refereeReward: 200,
    maxReferrals: null,
    expiresAt: "",
    conditions: "",
  });
  
  // Sample referral data
  const referrals = ref<Referral[]>([
    {
      id: 1,
      referrerName: "John Doe",
      referrerEmail: "john@example.com",
      code: "JOHN2024",
      campaign: "New Rider Bonus",
      successfulReferrals: 15,
      totalReferrals: 20,
      totalEarnings: 7500,
      status: "Active",
      referrerReward: 500,
      refereeReward: 200,
      maxReferrals: 50,
      expiresAt: "2024-12-31",
      conditions: "First-time riders only",
      createdAt: "2024-01-15",
      lastUsed: "2024-07-10",
    },
    {
      id: 2,
      referrerName: "Jane Smith",
      referrerEmail: "jane@example.com",
      code: "JANE50",
      campaign: "Driver Recruitment",
      successfulReferrals: 8,
      totalReferrals: 12,
      totalEarnings: 4000,
      status: "Active",
      referrerReward: 500,
      refereeReward: 200,
      maxReferrals: 25,
      expiresAt: "2024-10-31",
      conditions: "New drivers only",
      createdAt: "2024-02-01",
      lastUsed: "2024-07-08",
    },
    {
      id: 3,
      referrerName: "Mike Johnson",
      referrerEmail: "mike@example.com",
      code: "MIKE100",
      campaign: "Holiday Special",
      successfulReferrals: 25,
      totalReferrals: 30,
      totalEarnings: 12500,
      status: "Inactive",
      referrerReward: 500,
      refereeReward: 200,
      maxReferrals: 100,
      expiresAt: "2024-08-31",
      conditions: "Minimum trip value ₦500",
      createdAt: "2024-03-15",
      lastUsed: "2024-06-20",
    },
    {
      id: 4,
      referrerName: "Sarah Wilson",
      referrerEmail: "sarah@example.com",
      code: "SARAH25",
      campaign: "Student Discount",
      successfulReferrals: 12,
      totalReferrals: 18,
      totalEarnings: 6000,
      status: "Active",
      referrerReward: 500,
      refereeReward: 200,
      maxReferrals: 30,
      expiresAt: "2024-09-30",
      conditions: "Students only, valid ID required",
      createdAt: "2024-04-01",
      lastUsed: "2024-07-11",
    },
    {
      id: 5,
      referrerName: "David Brown",
      referrerEmail: "david@example.com",
      code: "DAVID75",
      campaign: "New Rider Bonus",
      successfulReferrals: 5,
      totalReferrals: 8,
      totalEarnings: 2500,
      status: "Suspended",
      referrerReward: 500,
      refereeReward: 200,
      maxReferrals: 20,
      expiresAt: "2024-11-30",
      conditions: "First-time riders only",
      createdAt: "2024-05-01",
      lastUsed: "2024-06-15",
    },
  ]);
  
  // Computed properties
  const filteredReferrals = computed(() => {
    let filtered = referrals.value;
  
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (referral) =>
          referral.referrerName.toLowerCase().includes(query) ||
          referral.referrerEmail.toLowerCase().includes(query) ||
          referral.code.toLowerCase().includes(query) ||
          referral.campaign.toLowerCase().includes(query)
      );
    }
  
    // Apply status filter
    if (statusFilter.value) {
      filtered = filtered.filter(
        (referral) => referral.status === statusFilter.value
      );
    }
  
    // Apply campaign filter
    if (campaignFilter.value) {
      filtered = filtered.filter(
        (referral) => referral.campaign === campaignFilter.value
      );
    }
  
    return filtered;
  });
  
  const totalActiveReferrers = computed(() => {
    return referrals.value.filter((referral) => referral.status === "Active")
      .length;
  });
  
  const totalReferrals = computed(() => {
    return referrals.value.reduce(
      (sum, referral) => sum + referral.totalReferrals,
      0
    );
  });
  
  // Watchers
  watch(selectAll, (newValue) => {
    if (newValue) {
      selectedReferrals.value = filteredReferrals.value.map(
        (referral) => referral.id
      );
    } else {
      selectedReferrals.value = [];
    }
  });
  
  watch(
    selectedReferrals,
    (newValue) => {
      if (newValue.length === 0) {
        selectAll.value = false;
      } else if (newValue.length === filteredReferrals.value.length) {
        selectAll.value = true;
      } else {
        selectAll.value = false;
      }
    },
    { deep: true }
  );
  
  // Methods
  const goBack = () => {
    // Use Nuxt router
    navigateTo(-1);
  };
  
  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedReferrals.value = filteredReferrals.value.map(
        (referral) => referral.id
      );
    } else {
      selectedReferrals.value = [];
    }
  };
  
  const generateReferralCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    newReferral.value.code = result;
  };
  
  const createReferralCode = () => {
    // Validate form
    if (
      !newReferral.value.referrerName ||
      !newReferral.value.referrerEmail ||
      !newReferral.value.code ||
      !newReferral.value.campaign
    ) {
      alert("Please fill in all required fields");
      return;
    }
  
    // Check if code already exists (skip if editing)
    if (!newReferral.value.id) {
      const existingCode = referrals.value.find(
        (r) => r.code === newReferral.value.code
      );
      if (existingCode) {
        alert(
          "This referral code already exists. Please choose a different code."
        );
        return;
      }
    }
  
    if (newReferral.value.id) {
      // Update existing referral
      const index = referrals.value.findIndex(
        (r) => r.id === newReferral.value.id
      );
      if (index !== -1) {
        referrals.value[index] = {
          ...referrals.value[index],
          referrerName: newReferral.value.referrerName,
          referrerEmail: newReferral.value.referrerEmail,
          code: newReferral.value.code,
          campaign: newReferral.value.campaign,
          referrerReward: newReferral.value.referrerReward,
          refereeReward: newReferral.value.refereeReward,
          maxReferrals: newReferral.value.maxReferrals,
          expiresAt: newReferral.value.expiresAt,
          conditions: newReferral.value.conditions,
        };
        alert("Referral code updated successfully!");
      }
    } else {
      // Create new referral
      const newReferralObj: Referral = {
        id: Math.max(...referrals.value.map((r) => r.id)) + 1,
        referrerName: newReferral.value.referrerName,
        referrerEmail: newReferral.value.referrerEmail,
        code: newReferral.value.code,
        campaign: newReferral.value.campaign,
        successfulReferrals: 0,
        totalReferrals: 0,
        totalEarnings: 0,
        status: "Active",
        referrerReward: newReferral.value.referrerReward,
        refereeReward: newReferral.value.refereeReward,
        maxReferrals: newReferral.value.maxReferrals,
        expiresAt: newReferral.value.expiresAt,
        conditions: newReferral.value.conditions,
        createdAt: new Date().toISOString().split("T")[0],
        lastUsed: null,
      };
  
      referrals.value.unshift(newReferralObj);
      alert("Referral code created successfully!");
    }
  
    // Reset form and close modal
    resetNewReferralForm();
    showCreateReferralModal.value = false;
  };
  
  const resetNewReferralForm = () => {
    newReferral.value = {
      referrerName: "",
      referrerEmail: "",
      code: "",
      campaign: "",
      referrerReward: 500,
      refereeReward: 200,
      maxReferrals: null,
      expiresAt: "",
      conditions: "",
    };
  };
  
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You can replace this with a toast notification
      alert("Referral code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy code:", err);
      alert("Failed to copy code. Please try again.");
    }
  };
  
  const viewReferralDetails = (referral: Referral) => {
    selectedReferralForDetails.value = referral;
    showDetailsModal.value = true;
  };
  
  const editReferral = (referral: Referral) => {
    // Populate form with existing data
    newReferral.value = {
      id: referral.id,
      referrerName: referral.referrerName,
      referrerEmail: referral.referrerEmail,
      code: referral.code,
      campaign: referral.campaign,
      referrerReward: referral.referrerReward,
      refereeReward: referral.refereeReward,
      maxReferrals: referral.maxReferrals,
      expiresAt: referral.expiresAt,
      conditions: referral.conditions,
    };
  
    showCreateReferralModal.value = true;
  };
  
  const toggleReferralStatus = (referral: Referral) => {
    const newStatus = referral.status === "Active" ? "Inactive" : "Active";
  
    if (
      confirm(
        `Are you sure you want to ${newStatus.toLowerCase()} this referral code?`
      )
    ) {
      const index = referrals.value.findIndex((r) => r.id === referral.id);
      if (index !== -1) {
        referrals.value[index].status = newStatus;
        alert(`Referral code ${newStatus.toLowerCase()} successfully!`);
      }
    }
  };
  
  const performBulkAction = (action: string) => {
    if (selectedReferrals.value.length === 0) {
      alert("Please select at least one referral code");
      return;
    }
  
    switch (action) {
      case "activate":
        bulkUpdateStatus("Active");
        break;
      case "deactivate":
        bulkUpdateStatus("Inactive");
        break;
      case "suspend":
        bulkUpdateStatus("Suspended");
        break;
      case "delete":
        bulkDelete();
        break;
      default:
        console.log("Unknown bulk action:", action);
    }
  };
  
  const bulkUpdateStatus = (status: "Active" | "Inactive" | "Suspended") => {
    if (
      confirm(
        `Are you sure you want to ${status.toLowerCase()} ${
          selectedReferrals.value.length
        } referral code(s)?`
      )
    ) {
      selectedReferrals.value.forEach((id) => {
        const index = referrals.value.findIndex((r) => r.id === id);
        if (index !== -1) {
          referrals.value[index].status = status;
        }
      });
  
      const count = selectedReferrals.value.length;
      selectedReferrals.value = [];
      selectAll.value = false;
      alert(`Successfully ${status.toLowerCase()}d ${count} referral code(s)!`);
    }
  };
  
  const bulkDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedReferrals.value.length} referral code(s)? This action cannot be undone.`
      )
    ) {
      const count = selectedReferrals.value.length;
      referrals.value = referrals.value.filter(
        (referral) => !selectedReferrals.value.includes(referral.id)
      );
      selectedReferrals.value = [];
      selectAll.value = false;
      alert(`${count} referral codes deleted successfully!`);
    }
  };
  
  const downloadReport = () => {
    // Create CSV content
    const headers = [
      "Referrer Name",
      "Email",
      "Code",
      "Campaign",
      "Successful Referrals",
      "Total Referrals",
      "Earnings",
      "Status",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredReferrals.value.map((referral) =>
        [
          `"${referral.referrerName}"`,
          `"${referral.referrerEmail}"`,
          referral.code,
          `"${referral.campaign}"`,
          referral.successfulReferrals,
          referral.totalReferrals,
          referral.totalEarnings,
          referral.status,
          referral.createdAt,
        ].join(",")
      ),
    ].join("\n");
  
    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `referral_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getConversionRate = (referral: Referral): number => {
    if (referral.totalReferrals === 0) return 0;
    return Math.round(
      (referral.successfulReferrals / referral.totalReferrals) * 100
    );
  };
  
  // Meta
  useHead({
    title: "CoMiles Referral Management",
    meta: [
      {
        name: "description",
        content: "Manage your referral campaigns and track performance",
      },
    ],
  });
  
  // Lifecycle
  onMounted(() => {
    console.log("Referral Management component mounted");
  });
  </script>
  