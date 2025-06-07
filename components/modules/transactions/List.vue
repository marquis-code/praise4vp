<template>
    <div class="min-h-screen">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Transactions</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg p-6 shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Amount</p>
              <p class="text-2xl font-bold text-gray-900">₦{{ formatCurrency(stats.totalAmount) }}</p>
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
              <p class="text-sm text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
              <p class="text-xs text-green-600">+15% from last month</p>
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
              <p class="text-xs text-gray-500">-2% from last month</p>
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
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
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
            <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="payment">Payment</option>
              <option value="refund">Refund</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select v-model="filters.dateRange" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
            <select v-model="filters.amountRange" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Any Amount</option>
              <option value="0-1000">₦0 - ₦1,000</option>
              <option value="1000-10000">₦1,000 - ₦10,000</option>
              <option value="10000-100000">₦10,000 - ₦100,000</option>
              <option value="100000+">₦100,000+</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select v-model="filters.currency" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Currencies</option>
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
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
            Show Advanced Filters
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
              placeholder="Search transactions..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              class="bg-primary-light text-white px-4 py-2 rounded-md hover:bg-primary-light transition-colors duration-200 flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
  
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
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
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
                  {{ transaction.status }}
                </span>
              </div>
  
              <div class="space-y-2 mb-4">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Amount:</span>
                  <span class="text-sm font-medium">₦{{ formatCurrency(transaction.amount.priceInUserCurrency) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Type:</span>
                  <span class="text-sm font-medium capitalize">{{ transaction.type }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Reference:</span>
                  <span class="text-sm font-mono text-gray-500 truncate">{{ transaction.ref.slice(0, 8) }}...</span>
                </div>
              </div>
  
              <button 
                @click="viewTransaction(transaction)"
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
                    <div class="text-sm text-gray-500 font-mono">{{ transaction.ref.slice(0, 12) }}...</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">₦{{ formatCurrency(transaction.amount.priceInUserCurrency) }}</div>
                  <div class="text-sm text-gray-500">{{ transaction.amount.currencySymbol }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900 capitalize">{{ transaction.type }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="getStatusClass(transaction.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transaction.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button 
                    @click="viewTransaction(transaction)"
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

        <div v-else-if="!loading && !transactions?.length" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
        </div>

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
          class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
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
  
            <div class="space-y-6">
              <!-- Basic Info -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Reference ID</label>
                    <p class="mt-1 text-sm text-gray-900 font-mono">{{ selectedTransaction.ref }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">User ID</label>
                    <p class="mt-1 text-sm text-gray-900 font-mono">{{ selectedTransaction.userId }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.description }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <p class="mt-1 text-sm text-gray-900 capitalize">{{ selectedTransaction.type }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span 
                      :class="getStatusClass(selectedTransaction.status)"
                      class="mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ selectedTransaction.status }}
                    </span>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Created At</label>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTransaction.createdAt) }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Amount Details -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Amount Breakdown</h3>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Base Amount:</span>
                    <span class="text-sm font-medium">{{ selectedTransaction.amount.currencySymbol }}{{ formatCurrency(selectedTransaction.amount.priceInUserCurrency) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Processor Fee:</span>
                    <span class="text-sm font-medium">{{ selectedTransaction.paymentProcessorFee.currencySymbol }}{{ formatCurrency(selectedTransaction.paymentProcessorFee.priceInUserCurrency) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Discount:</span>
                    <span class="text-sm font-medium">{{ selectedTransaction.discount.currencySymbol }}{{ formatCurrency(selectedTransaction.discount.priceInUserCurrency) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Tax:</span>
                    <span class="text-sm font-medium">{{ selectedTransaction.tax.currencySymbol }}{{ formatCurrency(selectedTransaction.tax.priceInUserCurrency) }}</span>
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between">
                      <span class="text-base font-medium text-gray-900">Total Amount:</span>
                      <span class="text-base font-bold text-gray-900">{{ selectedTransaction.total.currencySymbol }}{{ formatCurrency(selectedTransaction.total.priceInUserCurrency) }}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Exchange Rate Info -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Exchange Rate Information</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Currency</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.amount.currencyName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Exchange Rate</label>
                    <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.amount.rate }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Rate Timestamp</label>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTransaction.amount.rateTimestamp) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">CAD Equivalent</label>
                    <p class="mt-1 text-sm text-gray-900">CAD {{ formatCurrency(selectedTransaction.total.priceInCAD) }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Timestamps -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Created:</span>
                    <span class="text-sm text-gray-900">{{ formatDate(selectedTransaction.createdAt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">Last Updated:</span>
                    <span class="text-sm text-gray-900">{{ formatDate(selectedTransaction.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="mt-8 flex justify-end">
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
  const { transactions, loading, pagination, changePage, fetchTransactions } = useGetTransactions()
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
    type: 'deposit' | 'withdrawal' | 'payment' | 'refund'
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
  
  const selectedTransaction = ref<Transaction | null>(null)
  const viewMode = ref<'grid' | 'list'>('list')
  const searchQuery = ref('')
  const showAdvancedFilters = ref(false)

  const props = defineProps({
    transactions: {
        type: Array,
        defauly: []
    },
    loading: {
        type: Boolean,
        default: false
    }
  })
  
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
  
  // Computed properties
  const stats = computed(() => {
    const total = props.transactions?.length
    const completed = props.transactions.filter(t => t.status === 'completed').length
    const pending = props.transactions.filter(t => t.status === 'pending').length
    const failed = props.transactions.filter(t => t.status === 'failed').length
    const totalAmount = props.transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.total.priceInUserCurrency, 0)
  
    return {
      total,
      completed,
      pending,
      failed,
      totalAmount
    }
  })
  
  const filteredTransactions = computed(() => {
    let filtered = [...transactions.value]
  
    // Apply search query
    if (searchQuery?.value) {
      const query = searchQuery?.value?.toLowerCase()
      filtered = filtered.filter(transaction =>
        transaction?.description?.toLowerCase()?.includes(query) ||
        transaction?.ref?.toLowerCase()?.includes(query) ||
        transaction?.userId?.toLowerCase()?.includes(query) ||
        transaction?.status?.toLowerCase()?.includes(query) ||
        transaction?.type?.toLowerCase()?.includes(query)
      )
    }
  
    // Apply filters
    if (filters.value.type) {
      filtered = filtered.filter(t => t?.type === filters?.value?.type)
    }
  
    if (filters.value.status) {
      filtered = filtered.filter(t => t?.status === filters?.value?.status)
    }
  
    if (filters.value.currency) {
      filtered = filtered.filter(t => t?.amount?.currencySymbol === filters?.value?.currency)
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
        const amount = t.total.priceInUserCurrency
        return amount >= min && (max === Infinity || amount <= max)
      })
    }
  
    if (filters.value.ref) {
      filtered = filtered.filter(t => 
        t.ref.toLowerCase().includes(filters.value.ref.toLowerCase())
      )
    }
  
    if (filters.value.userId) {
      filtered = filtered.filter(t => 
        t.userId.toLowerCase().includes(filters.value.userId.toLowerCase())
      )
    }
  
    if (filters.value.description) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(filters.value.description.toLowerCase())
      )
    }
  
    return filtered
  })


// Pagination handler
const handlePageChange = async (page: number) => {
  await changePage(page)
}
  
  // Methods
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG').format(amount / 100)
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
  
  const getStatusClass = (status: string): string => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
  }
  
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
  
  const exportTransactions = (): void => {
    const csvData = [
      // Header row
      [
        'Reference ID',
        'User ID',
        'Description',
        'Type',
        'Status',
        'Amount',
        'Currency',
        'Processor Fee',
        'Discount',
        'Tax',
        'Total',
        'Exchange Rate',
        'CAD Amount',
        'Created At',
        'Updated At'
      ],
      // Data rows
      ...filteredTransactions.value.map(transaction => [
        transaction.ref,
        transaction.userId,
        transaction.description,
        transaction.type,
        transaction.status,
        (transaction.amount.priceInUserCurrency / 100).toString(),
        transaction.amount.currencySymbol,
        (transaction.paymentProcessorFee.priceInUserCurrency / 100).toString(),
        (transaction.discount.priceInUserCurrency / 100).toString(),
        (transaction.tax.priceInUserCurrency / 100).toString(),
        (transaction.total.priceInUserCurrency / 100).toString(),
        transaction.amount.rate.toString(),
        (transaction.total.priceInCAD / 100).toString(),
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
    // Initialize any required data or API calls here
    console.log('Transaction Manager initialized with', transactions.value.length, 'transactions')
  })
  </script>