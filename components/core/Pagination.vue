<template>
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ startIndex }}</span> to 
        <span class="font-medium">{{ endIndex }}</span> of 
        <span class="font-medium">{{ total }}</span> results
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Previous Button -->
        <button 
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="h-4 w-4 mr-1" />
          Previous
        </button>
        
        <!-- Page Numbers -->
        <div class="flex items-center space-x-1">
          <!-- First page -->
          <button 
            v-if="showFirstPage"
            @click="goToPage(1)"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
            :class="currentPage === 1 ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            1
          </button>
          
          <!-- First ellipsis -->
          <span v-if="showFirstEllipsis" class="px-2 py-2 text-gray-500">...</span>
          
          <!-- Visible page numbers -->
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
            :class="currentPage === page ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
          
          <!-- Last ellipsis -->
          <span v-if="showLastEllipsis" class="px-2 py-2 text-gray-500">...</span>
          
          <!-- Last page -->
          <button 
            v-if="showLastPage"
            @click="goToPage(totalPages)"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150"
            :class="currentPage === totalPages ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            {{ totalPages }}
          </button>
        </div>
        
        <!-- Next Button -->
        <button 
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight class="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  
  interface Props {
    currentPage: number
    totalPages: number
    total: number
    limit: number
  }
  
  interface Emits {
    (e: 'page-change', page: number): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const startIndex = computed(() => {
    return ((props.currentPage - 1) * props.limit) + 1
  })
  
  const endIndex = computed(() => {
    const end = props.currentPage * props.limit
    return end > props.total ? props.total : end
  })
  
  const visiblePages = computed(() => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []
    
    for (let i = Math.max(2, props.currentPage - delta); 
         i <= Math.min(props.totalPages - 1, props.currentPage + delta); 
         i++) {
      range.push(i)
    }
    
    return range
  })
  
  const showFirstPage = computed(() => {
    return props.totalPages > 1 && !visiblePages.value.includes(1)
  })
  
  const showLastPage = computed(() => {
    return props.totalPages > 1 && !visiblePages.value.includes(props.totalPages)
  })
  
  const showFirstEllipsis = computed(() => {
    return visiblePages.value.length > 0 && visiblePages.value[0] > 2
  })
  
  const showLastEllipsis = computed(() => {
    return visiblePages.value.length > 0 && 
           visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
  })
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
      emit('page-change', page)
    }
  }
  </script>
  