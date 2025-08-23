<!-- pages/referrals/index.vue -->
<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="pb-6">
      <div class="">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Referral Management</h1>
            <p class="text-slate-600 mt-1">Manage and track all referral activities</p>
          </div>
          <button
            @click="showStatsModal = true"
            class="inline-flex items-center text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            View Stats
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Total Referrals</p>
              <p class="text-2xl font-bold text-slate-900">{{ allStats?.totalReferrals || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Active Referrers</p>
              <p class="text-2xl font-bold text-slate-900">{{ allStats?.topReferrers?.length || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">This Month</p>
              <p class="text-2xl font-bold text-slate-900">{{ thisMonthReferrals }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-600">Top Referrer</p>
              <p class="text-lg font-bold text-slate-900">
                {{ topReferrerName || 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search referrals..."
                class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- User Filter -->
            <div class="relative">
              <select
                v-model="selectedUserId"
                @change="handleUserFilter"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Users</option>
                <option
                  v-for="user in uniqueUsers"
                  :key="user._id"
                  :value="user._id"
                >
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Referrals Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900">
            {{ selectedUserId ? 'User Referrals' : 'All Referrals' }}
          </h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading referrals...
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="displayedReferrals.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-slate-900">No referrals found</h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating your first referral.' }}
          </p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Referral Code
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Referee
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="referral in displayedReferrals"
                :key="referral._id"
                class="hover:bg-slate-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ referral.referralCode }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <NuxtLink :to="referral.referrer.hasDriverAccount  ? `/dashboard/drivers/${referral.referrer._id}` : `/dashboard/passengers/${referral.referrer._id}`" class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-white">
                          {{ getInitials(referral?.referrer?.firstName, referral?.referrer?.lastName) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-slate-900">
                        {{ referral.referrer.firstName }} {{ referral.referrer.lastName }}
                      </div>
                       <div class="text-sm text-slate-500">{{ referral?.referrer?.phone }}</div>
                      <div class="text-sm text-slate-500">{{ referral?.referrer?.email }}</div>
                    </div>
                  </NuxtLink>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <NuxtLink :to="referral.referree.hasDriverAccount ? `/dashboard/drivers/${referral.referree._id}` : `/dashboard/passengers/${referral.referree._id}`" class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-white">
                          {{ getInitials(referral?.referree?.firstName, referral?.referree?.lastName) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-slate-900">
                        {{ referral.referree.firstName }} {{ referral?.referree?.lastName }}
                      </div>
                       <div class="text-sm text-slate-500">{{ referral?.referree?.phone }}</div>
                      <div class="text-sm text-slate-500">{{ referral?.referree?.email }}</div>
                    </div>
                  </NuxtLink>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {{ formatDate(referral?.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewReferralDetails(referral._id)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    @click="showUserReferrals(referral.referrer._id)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    User Refs
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="!selectedUserId && pagination.totalPages > 1" class="px-6 py-4 border-t border-slate-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-700">
              Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
              {{ pagination.total }} results
            </div>
            <div class="flex space-x-2">
              <button
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page <= 1"
                class="px-3 py-1 text-sm bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="changePage(page)"
                  :class="[
                    'px-3 py-1 text-sm rounded-md',
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span v-else class="px-3 py-1 text-sm text-slate-500">...</span>
              </template>
              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages"
                class="px-3 py-1 text-sm bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- User Referrals Pagination -->
        <div v-if="selectedUserId && userPagination.totalPages > 1" class="px-6 py-4 border-t border-slate-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-700">
              Showing {{ ((userPagination.page - 1) * userPagination.limit) + 1 }} to 
              {{ Math.min(userPagination.page * userPagination.limit, userPagination.total) }} of 
              {{ userPagination.total }} results
            </div>
            <div class="flex space-x-2">
              <button
                @click="changeUserPage(userPagination.page - 1)"
                :disabled="userPagination.page <= 1"
                class="px-3 py-1 text-sm bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="changeUserPage(userPagination.page + 1)"
                :disabled="userPagination.page >= userPagination.totalPages"
                class="px-3 py-1 text-sm bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Referral Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeDetailsModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Referral Details</h3>
            <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedReferralLoading" class="text-center py-4">
            <svg class="animate-spin h-6 w-6 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <div v-else-if="selectedReferral" class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-sm font-medium text-blue-800">Referral Code</div>
              <div class="text-lg font-bold text-blue-900">{{ selectedReferral.referralCode }}</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm font-medium text-gray-600 mb-2">Referrer</div>
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(selectedReferral.referrer.firstName, selectedReferral.referrer.lastName) }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ selectedReferral.referrer.firstName }} {{ selectedReferral.referrer.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ selectedReferral.referrer.email }}</div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="text-sm font-medium text-gray-600 mb-2">Referee</div>
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mr-3">
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(selectedReferral.referree.firstName, selectedReferral.referree.lastName) }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ selectedReferral.referree.firstName }} {{ selectedReferral.referree.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ selectedReferral.referree.email }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm font-medium text-gray-600">Created At</div>
                <div class="text-gray-900">{{ formatDate(selectedReferral.createdAt) }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-600">Updated At</div>
                <div class="text-gray-900">{{ formatDate(selectedReferral.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Modal -->
    <div
      v-if="showStatsModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showStatsModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">Referral Statistics</h3>
            <button @click="showStatsModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="statsLoading" class="text-center py-8">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <div v-else-if="allStats" class="space-y-6">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <div class="text-center">
                <div class="text-3xl font-bold">{{ allStats.totalReferrals }}</div>
                <div class="text-blue-100">Total Referrals</div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">Top Referrers</h4>
              <div v-if="allStats.topReferrers && allStats.topReferrers.length > 0" class="space-y-3">
                <div
                  v-for="(referrer, index) in allStats.topReferrers"
                  :key="referrer.userId"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mr-3">
                      <span class="text-sm font-medium text-white">
                        {{ getInitials(referrer.firstName, referrer.lastName) }}
                      </span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ referrer.firstName }} {{ referrer.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">Rank #{{ index + 1 }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-gray-900">{{ referrer.count }}</div>
                    <div class="text-sm text-gray-500">referrals</div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500">
                No referrers found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer for Filters (if needed) -->
    <div
      v-if="showMobileDrawer"
      class="fixed inset-0 z-40 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showMobileDrawer = false"></div>
      <div class="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg p-6 transform transition-transform">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Filters</h3>
          <button @click="showMobileDrawer = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search referrals..."
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by User</label>
            <select
              v-model="selectedUserId"
              @change="handleUserFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All Users</option>
              <option
                v-for="user in uniqueUsers"
                :key="user._id"
                :value="user._id"
              >
                {{ user.firstName }} {{ user.lastName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGetReferrals } from '@/composables/modules/referrals/useGetReferrals'
import { useGetReferralById } from '@/composables/modules/referrals/useGetReferralById'
import { useGetReferralsByUserId } from '@/composables/modules/referrals/useGetReferralsByUserId'
import { useGetReferralStats } from '@/composables/modules/referrals/useGetReferralStats'

// Page metadata
definePageMeta({
  title: 'Referral Management',
  description: 'Manage and track all referral activities',
  layout: 'dashboard'
})

// Reactive data
const showDetailsModal = ref(false)
const showStatsModal = ref(false)
const showMobileDrawer = ref(false)
const searchQuery = ref('')
const selectedUserId = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Composables
const {
  loading,
  referrals,
  pagination,
  fetchReferrals,
  changePage,
  setSearch
} = useGetReferrals()

const {
  loading: selectedReferralLoading,
  referral: selectedReferral,
  fetchReferral
} = useGetReferralById()

const {
  loading: userReferralsLoading,
  referrals: userReferrals,
  pagination: userPagination,
  setUserId,
  changePage: changeUserPage
} = useGetReferralsByUserId()

const {
  loading: statsLoading,
  stats: allStats,
  fetchStats
} = useGetReferralStats()

// Computed properties
const displayedReferrals = computed(() => {
  return selectedUserId.value ? userReferrals.value : referrals.value
})

const uniqueUsers = computed(() => {
  const users = new Map()
  referrals.value.forEach(referral => {
    if (!users.has(referral.referrer._id)) {
      users.set(referral.referrer._id, referral.referrer)
    }
    if (!users.has(referral.referree._id)) {
      users.set(referral.referree._id, referral.referree)
    }
  })
  return Array.from(users.values())
})

const thisMonthReferrals = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return referrals.value.filter(referral => 
    new Date(referral.createdAt) >= startOfMonth
  ).length
})

const topReferrerName = computed(() => {
  if (allStats.value?.topReferrers && allStats.value.topReferrers.length > 0) {
    const top = allStats.value.topReferrers[0]
    return `${top.firstName} ${top.lastName}`
  }
  return 'N/A'
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    if (selectedUserId.value) {
      // If filtering by user, search within user referrals
      // Note: This would need backend support for search within user referrals
      // For now, we'll just clear the user filter and search globally
      selectedUserId.value = ''
    }
    setSearch(searchQuery.value)
  }, 500)
}

const handleUserFilter = async () => {
  if (selectedUserId.value) {
    await setUserId(selectedUserId.value)
  } else {
    // Clear search when switching back to all referrals
    searchQuery.value = ''
    await fetchReferrals()
  }
}

const viewReferralDetails = async (referralId: string) => {
  showDetailsModal.value = true
  await fetchReferral(referralId)
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
}

const showUserReferrals = async (userId: string) => {
  selectedUserId.value = userId
  await setUserId(userId)
}

const refreshData = async () => {
  if (selectedUserId.value) {
    await setUserId(selectedUserId.value)
  } else {
    await fetchReferrals()
  }
  await fetchStats()
}

// Lifecycle
onMounted(async () => {
  await fetchStats()
})

// Watchers
watch(showStatsModal, (newVal) => {
  if (newVal) {
    fetchStats()
  }
})
</script>

<style scoped>
/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile responsive table */
@media (max-width: 768px) {
  .min-w-full {
    min-width: 600px;
  }
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom button hover effects */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Modal backdrop blur effect */
.modal-backdrop {
  backdrop-filter: blur(4px);
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

/* Stats card animations */
.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.stats-card:hover::before {
  left: 100%;
}

/* Table row hover effect */
.table-row-hover {
  transition: all 0.2s ease;
}

.table-row-hover:hover {
  background-color: #f8fafc;
  transform: scale(1.01);
}

/* Badge animations */
.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Avatar hover effect */
.avatar {
  transition: all 0.2s ease;
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Search input focus effect */
.search-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

/* Pagination button effects */
.pagination-btn {
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Mobile drawer slide animation */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
}

/* Responsive utilities */
@media (max-width: 640px) {
  .mobile-hidden {
    display: none;
  }
  
  .mobile-stack {
    flex-direction: column;
    gap: 1rem;
  }
  
  .mobile-full {
    width: 100%;
  }
}

/* Dark mode support (if needed in future) */
@media (prefers-color-scheme: dark) {
  .dark-mode {
    /* Dark mode styles would go here */
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-full-width {
    width: 100% !important;
  }
}

/* Accessibility improvements */
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Performance optimizations */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Loading skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

.skeleton {
  animation: shimmer 1.2s ease-in-out infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%);
  background-size: 400% 100%;
}
</style>