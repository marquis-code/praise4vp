<template>
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Table header with search and filters -->
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ title }}</h3>
          
          <div class="mt-3 md:mt-0 flex flex-col sm:flex-row gap-3">
            <!-- Search input -->
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                v-model="searchQuery" 
                class="focus:ring-primary p-3 outline-none border focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md" 
                :placeholder="searchPlaceholder || 'Search...'"
                @input="handleSearch"
              />
            </div>
            
            <!-- Filter dropdown -->
            <div v-if="filters && filters.length" class="relative inline-block text-left">
              <div>
                <button 
                  type="button" 
                  @click="isFilterOpen = !isFilterOpen"
                  class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Filters
                  <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div 
                v-if="isFilterOpen" 
                class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div class="py-1" role="menu" aria-orientation="vertical">
                  <div v-for="filter in filters" :key="filter.key" class="px-4 py-2">
                    <label :for="filter.key" class="block text-sm font-medium text-gray-700">{{ filter.label }}</label>
                    <select 
                      :id="filter.key" 
                      v-model="activeFilters[filter.key]" 
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      @change="applyFilters"
                    >
                      <option value="">All</option>
                      <option v-for="option in filter.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="border-t border-gray-100 mt-2 pt-2 px-4 py-2">
                    <button 
                      @click="resetFilters" 
                      class="w-full text-left text-sm text-primary hover:text-primary-dark"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action button (if provided) -->
            <button 
              v-if="actionButton" 
              @click="$emit('action-click')" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {{ actionButton }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Table content -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                :class="column.class"
              >
                <div class="flex items-center">
                  {{ column.label }}
                  <button 
                    v-if="column.sortable" 
                    @click="toggleSort(column.key)"
                    class="ml-1 focus:outline-none"
                  >
                    <svg 
                      v-if="sortKey === column.key && sortOrder === 'asc'" 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4 text-primary" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      v-else-if="sortKey === column.key && sortOrder === 'desc'" 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4 text-primary" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      v-else 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
              </th>
              <th v-if="hasActions" scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td :colspan="hasActions ? columns.length + 1 : columns.length" class="px-6 py-4">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="ml-2 text-sm text-gray-500">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredData.length === 0" class="hover:bg-gray-50">
              <td :colspan="hasActions ? columns.length + 1 : columns.length" class="px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
            <tr 
              v-for="(item, index) in paginatedData" 
              :key="item.id || index" 
              class="hover:bg-gray-50"
            >
              <td 
                v-for="column in columns" 
                :key="column.key" 
                class="px-6 py-4 whitespace-nowrap text-sm"
                :class="column.cellClass"
              >
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  <template v-if="column.type === 'status'">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(item[column.key])"
                    >
                      {{ item[column.key] }}
                    </span>
                  </template>
                  <template v-else-if="column.type === 'date'">
                    {{ formatDate(item[column.key]) }}
                  </template>
                  <template v-else-if="column.type === 'image'">
                    <img 
                      :src="item[column.key] || '/placeholder.svg?height=40&width=40'" 
                      :alt="`${column.label} image`"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                  </template>
                  <template v-else>
                    {{ item[column.key] }}
                  </template>
                </slot>
              </td>
              <td v-if="hasActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <slot name="actions" :item="item">
                  <button 
                    @click="$emit('view', item)" 
                    class="text-primary hover:text-primary-dark mr-3"
                  >
                    View
                  </button>
                  <button 
                    @click="$emit('edit', item)" 
                    class="text-primary hover:text-primary-light mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    @click="$emit('delete', item)" 
                    class="text-danger hover:text-red-700"
                  >
                    Delete
                  </button>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && filteredData.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startItem }}</span>
              to
              <span class="font-medium">{{ endItem }}</span>
              of
              <span class="font-medium">{{ filteredData.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">First</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="currentPage > 1 ? currentPage-- : null"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  currentPage === page ? 'z-10 bg-primary border-primary text-primary-foreground' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click="currentPage < totalPages ? currentPage++ : null"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Last</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  
  interface Column {
    key: string
    label: string
    sortable?: boolean
    type?: 'text' | 'date' | 'status' | 'image'
    class?: string
    cellClass?: string
  }
  
  interface Props {
    title: string
    columns: Column[]
    data: any[]
    loading?: boolean
    pagination?: boolean
    itemsPerPage?: number
    searchPlaceholder?: string
    filters?: Array<{
      key: string
      label: string
      options: Array<{ value: string, label: string }>
    }>
    actionButton?: string
    hasActions?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    pagination: true,
    itemsPerPage: 10,
    hasActions: true
  })
  
  const emit = defineEmits(['search', 'filter', 'sort', 'view', 'edit', 'delete', 'action-click'])
  
  // Search
  const searchQuery = ref('')
  const handleSearch = () => {
    emit('search', searchQuery.value)
  }
  
  // Sorting
  const sortKey = ref('')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  
  const toggleSort = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
    emit('sort', { key: sortKey.value, order: sortOrder.value })
  }
  
  // Filtering
  const isFilterOpen = ref(false)
  const activeFilters = ref<Record<string, string>>({})
  
  const resetFilters = () => {
    activeFilters.value = {}
    applyFilters()
  }
  
  const applyFilters = () => {
    emit('filter', activeFilters.value)
  }
  
  // Pagination
  const currentPage = ref(1)
  
  const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / props.itemsPerPage)
  })
  
  const startItem = computed(() => {
    return (currentPage.value - 1) * props.itemsPerPage + 1
  })
  
  const endItem = computed(() => {
    return Math.min(currentPage.value * props.itemsPerPage, filteredData.value.length)
  })
  
  const displayedPages = computed(() => {
    const pages = []
    const maxPagesToShow = 5
    
    if (totalPages.value <= maxPagesToShow) {
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1
      
      if (endPage > totalPages.value) {
        endPage = totalPages.value
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  })
  
  // Filtered and paginated data
  const filteredData = computed(() => {
    let result = [...props.data]
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item => {
        return props.columns.some(column => {
          const value = item[column.key]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(query)
        })
      })
    }
    
    // Apply active filters
    Object.entries(activeFilters.value).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => String(item[key]) === value)
      }
    })
    
    // Apply sorting
    if (sortKey.value) {
      result.sort((a, b) => {
        const aValue = a[sortKey.value]
        const bValue = b[sortKey.value]
        
        if (aValue === bValue) return 0
        
        const comparison = aValue > bValue ? 1 : -1
        return sortOrder.value === 'asc' ? comparison : -comparison
      })
    }
    
    return result
  })
  
  const paginatedData = computed(() => {
    if (!props.pagination) return filteredData.value
    
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    
    return filteredData.value.slice(start, end)
  })
  
  // Reset pagination when data changes
  watch(() => filteredData.value.length, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  })
  
  // Helper functions
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  
  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-red-100 text-red-800'
    }
    
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }
  </script>