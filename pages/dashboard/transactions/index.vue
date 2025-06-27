<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
      <p class="text-gray-600 mt-2">Manage and monitor all payment transactions</p>
    </div>
    <!-- {{pagination}} -->

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Transactions</p>
            <p class="text-2xl font-bold text-gray-900">{{ pagination?.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Amount (NGN)</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrencyWithSymbol(stats.totalNGN, 'NGN') }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Amount (CAD)</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrencyWithSymbol(stats.totalCAD, 'CAD') }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
            <p class="text-xs text-green-600">{{ getCompletionRate() }}% completion rate</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
            <p class="text-xs text-gray-500">{{ stats.failed }} failed</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg p-6 shadow-sm border mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
        <button 
          @click="resetFilters"
          class="text-sm text-primary hover:text-primary font-medium flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Reset Filters
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
          <select v-model="filters.type" class="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Types</option>
            <option v-for="type in uniqueTypes" :key="type" :value="type">
              {{ formatTransactionType(type) }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.status" class="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Statuses</option>
            <option v-for="status in uniqueStatuses" :key="status" :value="status">
              {{ formatStatus(status) }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select v-model="filters.dateRange" class="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Amount Range (NGN)</label>
          <select v-model="filters.amountRange" class="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Any Amount</option>
            <option value="0-1000">₦0 - ₦1,000</option>
            <option value="1000-10000">₦1,000 - ₦10,000</option>
            <option value="10000-100000">₦10,000 - ₦100,000</option>
            <option value="100000+">₦100,000+</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select v-model="filters.currency" class="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Currencies</option>
            <option v-for="currency in uniqueCurrencies" :key="currency" :value="currency">
              {{ currency }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4">
        <button 
          @click="toggleAdvancedFilters"
          class="text-sm text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg 
            class="w-4 h-4 mr-1 transform transition-transform"
            :class="{ 'rotate-180': showAdvancedFilters }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
          {{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters
        </button>
      </div>

      <!-- Advanced Filters -->
      <div v-show="showAdvancedFilters" class="mt-4 pt-4 border-t border-gray-200">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reference ID</label>
            <input 
              v-model="filters.ref"
              type="text" 
              placeholder="Search by reference..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
            <input 
              v-model="filters.userId"
              type="text" 
              placeholder="Search by user ID..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input 
              v-model="filters.description"
              type="text" 
              placeholder="Search description..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Search and View Controls -->
    <div class="bg-white rounded-lg p-4 shadow-sm border mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search transactions by description, reference, or user..."
            class="w-full pl-10 pr-4 py-3 text-sm border border-primary  rounded-md focus:outline-none"
          >
        </div>

        <div class="flex items-center gap-3">
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button 
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm' : ''"
              class="p-2 rounded-md transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-white shadow-sm' : ''"
              class="p-2 rounded-md transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
          </div>

          <button 
            @click="exportTransactions"
            class="bg-primary text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !transactions?.length" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Transactions Display -->
    <div v-else-if="!loading && transactions?.length" class="bg-white rounded-lg shadow-sm border">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="transaction in filteredTransactions" 
            :key="transaction._id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="viewTransaction(transaction)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 truncate">{{ transaction.description }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ formatDate(transaction.createdAt) }}</p>
              </div>
              <span 
                :class="getStatusClass(transaction.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ formatStatus(transaction.status) }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Amount:</span>
                <span class="text-sm font-medium">
                  {{ formatTransactionAmount(transaction) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">CAD Equivalent:</span>
                <span class="text-sm text-gray-900 font-medium">
                  {{ formatCurrencyWithSymbol(transaction.total.priceInCAD, 'CAD') }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Type:</span>
                <span class="text-sm font-medium capitalize">{{ formatTransactionType(transaction.type) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Reference:</span>
                <span class="text-sm font-mono text-gray-500 truncate">{{ transaction.ref.slice(0, 8) }}...</span>
              </div>
              <div v-if="transaction.metadata?.tripId" class="flex justify-between">
                <span class="text-sm text-gray-600">Trip ID:</span>
                <span class="text-sm font-mono text-gray-500 truncate">{{ transaction.metadata.tripId.slice(-8) }}</span>
              </div>
            </div>

            <button 
              @click.stop="viewTransaction(transaction)"
              class="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="transaction in filteredTransactions" 
              :key="transaction._id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ transaction.description }}</div>
                  <div class="text-sm text-gray-500 font-mono">{{ transaction.ref.slice(0, 16) }}...</div>
                  <div v-if="transaction.metadata?.tripId" class="text-xs text-gray-400">
                    Trip: {{ transaction.metadata.tripId.slice(-8) }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 capitalize">
                 <span class="block"> {{ `${transaction?.userId?.firstName} ${transaction?.userId?.lastName}` }}</span>
                  <span>{{ transaction?.userId?.email }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatTransactionAmount(transaction) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatCurrencyWithSymbol(transaction.total.priceInCAD, 'CAD') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 capitalize">
                  {{ formatTransactionType(transaction.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(transaction.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ formatStatus(transaction.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button 
                  @click="viewTransaction(transaction)"
                  class="text-primary hover:text-primary text-sm font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !transactions?.length" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
    </div>

    <!-- Pagination -->
    <div class="mt-6">
      <CorePagination 
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        @page-change="handlePageChange"
      />
    </div>

    <!-- Transaction Detail Modal -->
    <div 
      v-if="selectedTransaction" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal"
    >
      <div 
        @click.stop
        class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Transaction Details</h2>
            <button 
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Basic Info -->
              <div>
                <h3 class="text-base font-medium text-gray-900 mb-4">Basic Information</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Reference ID:</span>
                    <span class="text-sm text-gray-900 font-mono">{{ selectedTransaction.ref }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">User:</span>
                    <span class="text-sm block text-gray-900 font-mono">{{ `${selectedTransaction?.userId?.firstName} ${selectedTransaction?.userId?.lastName}` }}</span>
                    <span class="text-sm text-gray-900 font-mono">{{ selectedTransaction?.userId?.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Description:</span>
                    <span class="text-sm text-gray-900">{{ selectedTransaction.description }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Type:</span>
                    <span class="text-sm text-gray-900 capitalize">{{ formatTransactionType(selectedTransaction.type) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Status:</span>
                    <span 
                      :class="getStatusClass(selectedTransaction.status)"
                      class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ formatStatus(selectedTransaction.status) }}
                    </span>
                  </div>
                  <div v-if="selectedTransaction.metadata?.tripId" class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Trip ID:</span>
                    <span class="text-sm text-gray-900 font-mono">{{ selectedTransaction.metadata.tripId }}</span>
                  </div>
                </div>
              </div>

              <!-- Timeline -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Created:</span>
                    <span class="text-sm text-gray-900">{{ formatDate(selectedTransaction.createdAt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Last Updated:</span>
                    <span class="text-sm text-gray-900">{{ formatDate(selectedTransaction.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Amount Breakdown -->
              <div>
                <h3 class="text-base font-medium text-gray-900 mb-4">Amount Breakdown</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Base Amount:</span>
                    <span class="text-sm font-medium">
                      {{ formatAmountWithCurrency(selectedTransaction.amount) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Processor Fee:</span>
                    <span class="text-sm font-medium">
                      {{ formatAmountWithCurrency(selectedTransaction.paymentProcessorFee) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Discount:</span>
                    <span class="text-sm font-medium text-green-600">
                      -{{ formatAmountWithCurrency(selectedTransaction.discount) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Tax:</span>
                    <span class="text-sm font-medium">
                      {{ formatAmountWithCurrency(selectedTransaction.tax) }}
                    </span>
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between">
                      <span class="text-base font-medium text-gray-900">Total Amount:</span>
                      <span class="text-base font-bold text-gray-900">
                        {{ formatAmountWithCurrency(selectedTransaction.total) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Exchange Rate Info -->
              <div>
                <h3 class="text-base font-medium text-gray-900 mb-4">Exchange Rate Information</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Currency:</span>
                    <span class="text-sm text-gray-900">{{ selectedTransaction.total.currencyName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Exchange Rate:</span>
                    <span class="text-sm text-gray-900">{{ formatNumber(selectedTransaction.total.rate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Rate Timestamp:</span>
                    <span class="text-sm text-gray-900">{{ formatDate(selectedTransaction.total.rateTimestamp) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">CAD Equivalent:</span>
                    <span class="text-sm text-gray-900 font-medium">
                      {{ formatCurrencyWithSymbol(selectedTransaction.total.priceInCAD, 'CAD') }}
                    </span>
                  </div>
                  <div v-if="selectedTransaction.total.attribution" class="flex justify-between">
                    <span class="text-sm font-medium text-gray-700">Rate Source:</span>
                    <a 
                      :href="selectedTransaction.total.attribution" 
                      target="_blank" 
                      class="text-sm text-primary hover:text-primary"
                    >
                      Exchange Rate API
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end space-x-3">
            <button 
              @click="exportSingleTransaction(selectedTransaction)"
              class="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Export Details
            </button>
            <button 
              @click="closeModal"
              class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGetTransactions } from "@/composables/modules/transactions/useGetTransactions"
import { definePageMeta, navigateTo } from '#imports'

// Types
interface Amount {
  priceInCAD: number
  priceInUserCurrency: number
  rate: number
  rateTimestamp: string
  currencySymbol: string
  currencyName: string
  attribution: string
}

interface Transaction {
  _id: string
  ref: string
  userId: string
  description: string
  amount: Amount
  paymentProcessorFee: Amount
  discount: Amount
  tax: Amount
  total: Amount
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  type: string
  metadata: any
  createdAt: string
  updatedAt: string
}

interface Filters {
  type: string
  status: string
  dateRange: string
  amountRange: string
  currency: string
  ref: string
  userId: string
  description: string
}

definePageMeta({
  layout: 'dashboard'
})

const { transactions, loading, pagination, changePage, fetchTransactions } = useGetTransactions()

// Reactive state
const selectedTransaction = ref<Transaction | null>(null)
const viewMode = ref<'grid' | 'list'>('list')
const searchQuery = ref('')
const showAdvancedFilters = ref(false)

// Filters
const filters = ref<Filters>({
  type: '',
  status: '',
  dateRange: '',
  amountRange: '',
  currency: '',
  ref: '',
  userId: '',
  description: ''
})

// Computed properties for unique values
const uniqueTypes = computed(() => {
  const types = new Set<string>()
  transactions.value?.forEach(transaction => {
    if (transaction.type) {
      types.add(transaction.type)
    }
  })
  return Array.from(types)
})

const uniqueStatuses = computed(() => {
  const statuses = new Set<string>()
  transactions.value?.forEach(transaction => {
    if (transaction.status) {
      statuses.add(transaction.status)
    }
  })
  return Array.from(statuses)
})

const uniqueCurrencies = computed(() => {
  const currencies = new Set<string>()
  transactions.value?.forEach(transaction => {
    if (transaction.total?.currencySymbol) {
      currencies.add(transaction.total.currencySymbol)
    }
  })
  return Array.from(currencies)
})

// Stats computed property
const stats = computed(() => {
  if (!transactions.value?.length) {
    return {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      totalNGN: 0,
      totalCAD: 0
    }
  }

  const total = transactions.value.length
  const completed = transactions.value.filter(t => t.status === 'completed').length
  const pending = transactions.value.filter(t => t.status === 'pending').length
  const failed = transactions.value.filter(t => t.status === 'failed').length
  
  const totalNGN = transactions.value
    .filter(t => t.status === 'completed' && t.total?.currencySymbol === 'NGN')
    .reduce((sum, t) => sum + (t.total?.priceInUserCurrency || 0), 0)
  
  const totalCAD = transactions.value
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.total?.priceInCAD || 0), 0)

  return {
    total,
    completed,
    pending,
    failed,
    totalNGN,
    totalCAD
  }
})

// Filtered transactions
const filteredTransactions = computed(() => {
  if (!transactions.value?.length) return []
  
  let filtered = [...transactions.value]

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(transaction =>
      transaction.description?.toLowerCase()?.includes(query) ||
      transaction.ref?.toLowerCase()?.includes(query) ||
      transaction.userId?.firstName?.toLowerCase()?.includes(query) ||
      transaction.userId?.lastName?.toLowerCase()?.includes(query) ||
      transaction.userId?.email?.toLowerCase()?.includes(query) ||
      transaction.status?.toLowerCase()?.includes(query) ||
      transaction.type?.toLowerCase()?.includes(query)
    )
  }

  // Apply filters
  if (filters.value.type) {
    filtered = filtered.filter(t => t.type === filters.value.type)
  }

  if (filters.value.status) {
    filtered = filtered.filter(t => t.status === filters.value.status)
  }

  if (filters.value.currency) {
    filtered = filtered.filter(t => t.total?.currencySymbol === filters.value.currency)
  }

  if (filters.value.dateRange) {
    const now = new Date()
    const filterDate = new Date()

    switch (filters.value.dateRange) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3)
        break
      default:
        filterDate.setFullYear(1970)
    }

    filtered = filtered.filter(t => new Date(t.createdAt) >= filterDate)
  }

  if (filters.value.amountRange) {
    const [min, max] = filters.value.amountRange.split('-').map(v => 
      v.includes('+') ? Infinity : parseInt(v)
    )
    
    filtered = filtered.filter(t => {
      const amount = t.total?.priceInUserCurrency || 0
      return amount >= min && (max === Infinity || amount <= max)
    })
  }

  if (filters.value.ref) {
    filtered = filtered.filter(t => 
      t.ref?.toLowerCase().includes(filters.value.ref.toLowerCase())
    )
  }

  if (filters.value.userId) {
    filtered = filtered.filter(t => 
      t.userId?.toLowerCase().includes(filters.value.userId.toLowerCase())
    )
  }

  if (filters.value.description) {
    filtered = filtered.filter(t => 
      t.description?.toLowerCase().includes(filters.value.description.toLowerCase())
    )
  }

  return filtered
})

// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}

// Helper methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG').format(amount)
}

const formatCurrencyWithSymbol = (amount: number, currency: string): string => {
  const currencyMap: { [key: string]: string } = {
    'NGN': 'en-NG',
    'CAD': 'en-CA',
    'USD': 'en-US',
    'EUR': 'en-EU'
  }
  
  const locale = currencyMap[currency] || 'en-US'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(num)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTransactionAmount = (transaction: Transaction): string => {
  const amount = transaction.total?.priceInUserCurrency || 0
  const symbol = transaction.total?.currencySymbol || 'NGN'
  return `${symbol} ${formatCurrency(amount)}`
}

const formatAmountWithCurrency = (amountObj: Amount): string => {
  if (!amountObj || amountObj.priceInUserCurrency === 0) return '0'
  const symbol = amountObj.currencySymbol || 'NGN'
  return `${symbol} ${formatCurrency(amountObj.priceInUserCurrency)}`
}

const formatTransactionType = (type: string): string => {
  return type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const formatStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = (status: string): string => {
  const statusClasses = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

const getCompletionRate = (): string => {
  if (!stats.value.total) return '0'
  return ((stats.value.completed / stats.value.total) * 100).toFixed(1)
}

// Action methods
const viewTransaction = (transaction: Transaction): void => {
  selectedTransaction.value = transaction
}

const closeModal = (): void => {
  selectedTransaction.value = null
}

const resetFilters = (): void => {
  filters.value = {
    type: '',
    status: '',
    dateRange: '',
    amountRange: '',
    currency: '',
    ref: '',
    userId: '',
    description: ''
  }
  searchQuery.value = ''
}

const toggleAdvancedFilters = (): void => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const exportSingleTransaction = (transaction: Transaction): void => {
  const data = [
    ['Field', 'Value'],
    ['Reference ID', transaction.ref],
    ['User ID', transaction.userId],
    ['Description', transaction.description],
    ['Type', formatTransactionType(transaction.type)],
    ['Status', formatStatus(transaction.status)],
    ['Base Amount', formatAmountWithCurrency(transaction.amount)],
    ['Processor Fee', formatAmountWithCurrency(transaction.paymentProcessorFee)],
    ['Discount', formatAmountWithCurrency(transaction.discount)],
    ['Tax', formatAmountWithCurrency(transaction.tax)],
    ['Total Amount', formatAmountWithCurrency(transaction.total)],
    ['CAD Equivalent', formatCurrencyWithSymbol(transaction.total.priceInCAD, 'CAD')],
    ['Exchange Rate', formatNumber(transaction.total.rate)],
    ['Created At', formatDate(transaction.createdAt)],
    ['Updated At', formatDate(transaction.updatedAt)]
  ]

  const csvContent = data.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transaction_${transaction.ref}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const exportTransactions = (): void => {
  const csvData = [
    // Header row
    [
      'Reference ID',
      'User ID',
      'Description',
      'Type',
      'Status',
      'Base Amount',
      'Currency',
      'Processor Fee',
      'Discount',
      'Tax',
      'Total Amount',
      'Exchange Rate',
      'CAD Amount',
      'Trip ID',
      'Created At',
      'Updated At'
    ],
    // Data rows
    ...filteredTransactions.value.map(transaction => [
      transaction.ref,
      transaction.userId,
      transaction.description,
      formatTransactionType(transaction.type),
      formatStatus(transaction.status),
      transaction.amount?.priceInUserCurrency?.toString() || '0',
      transaction.total?.currencySymbol || '',
      transaction.paymentProcessorFee?.priceInUserCurrency?.toString() || '0',
      transaction.discount?.priceInUserCurrency?.toString() || '0',
      transaction.tax?.priceInUserCurrency?.toString() || '0',
      transaction.total?.priceInUserCurrency?.toString() || '0',
      transaction.total?.rate?.toString() || '0',
      transaction.total?.priceInCAD?.toString() || '0',
      transaction.metadata?.tripId || '',
      transaction.createdAt,
      transaction.updatedAt
    ])
  ]

  const csvContent = csvData.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Lifecycle
onMounted(() => {
  console.log('Transaction Manager initialized with', transactions.value?.length || 0, 'transactions')
})
</script>