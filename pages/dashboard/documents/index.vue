<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <!-- Header Section -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Document Requirements</h1>
              <p class="text-sm text-gray-600 mt-1">Manage country-specific document requirements</p>
            </div>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add New Requirement
            </button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Filters Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
              <input
                v-model="filters.countryCode"
                type="text"
                placeholder="e.g., NG, US"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                @input="debouncedSearch"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Document Code</label>
              <input
                v-model="filters.documentCode"
                type="text"
                placeholder="e.g., NG-02"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                @input="debouncedSearch"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
  
        <!-- Document Requirements Grid -->
        <div v-else-if="documentRequirements.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="requirement in documentRequirements"
            :key="requirement.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ requirement.name }}</h3>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ requirement.countryCode }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {{ requirement.documentCode }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      requirement.required
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ requirement.required ? 'Required' : 'Optional' }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  @click="viewRequirement(requirement)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editRequirement(requirement)"
                    class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(requirement)"
                    class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No document requirements found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new document requirement.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add New Requirement
            </button>
          </div>
        </div>
  
        <!-- Pagination -->
        <div v-if="totalCount > documentRequirements.length" class="mt-8 flex justify-center">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {{ currentPage }}
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage * pageSize >= totalCount"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <DocumentRequirementModal
        v-model:show="showCreateModal"
        :requirement="selectedRequirement"
        @saved="handleSaved"
      />
  
      <!-- View Modal -->
      <DocumentRequirementViewModal
        v-model:show="showViewModal"
        :requirement="selectedRequirement"
      />
  
      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        v-model:show="showDeleteModal"
        title="Delete Document Requirement"
        :message="`Are you sure you want to delete '${selectedRequirement?.name}'? This action cannot be undone.`"
        confirm-text="Delete"
        confirm-class="bg-red-600 hover:bg-red-700"
        @confirm="handleDelete"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGetAllCountryDocumentRequirements } from "@/composables/modules/documents/useGetAllCountryDocumentRequirements"
  import { useDeleteDocumentRequirement } from "@/composables/modules/documents/useDeleteDocumentRequirement"
  interface DocumentRequirement {
    id: string
    countryCode: string
    documentCode: string
    name: string
    required: boolean
    createdAt?: string
    updatedAt?: string
  }
  
  // Composables
  const { documentRequirements, totalCount, loading, fetchAllDocumentRequirements } = useGetAllCountryDocumentRequirements()
  const { deleteDocumentRequirement, loading: deleteLoading } = useDeleteDocumentRequirement()
  
  // Reactive data
  const showCreateModal = ref(false)
  const showViewModal = ref(false)
  const showDeleteModal = ref(false)
  const selectedRequirement = ref<DocumentRequirement | null>(null)
  const currentPage = ref(1)
  const pageSize = ref(12)
  
  const filters = reactive({
    countryCode: '',
    documentCode: ''
  })
  
  // Methods
  const debouncedSearch = useDebounceFn(() => {
    currentPage.value = 1
    fetchAllDocumentRequirements({
      page: currentPage.value,
      limit: pageSize.value,
      ...filters
    })
  }, 300)
  
  const clearFilters = () => {
    filters.countryCode = ''
    filters.documentCode = ''
    currentPage.value = 1
    fetchAllDocumentRequirements({
      page: currentPage.value,
      limit: pageSize.value
    })
  }
  
  const changePage = (page: number) => {
    currentPage.value = page
    fetchAllDocumentRequirements({
      page: currentPage.value,
      limit: pageSize.value,
      ...filters
    })
  }
  
  const viewRequirement = (requirement: DocumentRequirement) => {
    selectedRequirement.value = requirement
    showViewModal.value = true
  }
  
  const editRequirement = (requirement: DocumentRequirement) => {
    selectedRequirement.value = requirement
    showCreateModal.value = true
  }
  
  const confirmDelete = (requirement: DocumentRequirement) => {
    selectedRequirement.value = requirement
    showDeleteModal.value = true
  }
  
  const handleDelete = async () => {
    if (!selectedRequirement.value) return
    
    const success = await deleteDocumentRequirement(selectedRequirement.value.id)
    if (success) {
      await fetchAllDocumentRequirements({
        page: currentPage.value,
        limit: pageSize.value,
        ...filters
      })
    }
    showDeleteModal.value = false
    selectedRequirement.value = null
  }
  
  const handleSaved = () => {
    showCreateModal.value = false
    selectedRequirement.value = null
    fetchAllDocumentRequirements({
      page: currentPage.value,
      limit: pageSize.value,
      ...filters
    })
  }
  
  // Watchers
  watch(() => showCreateModal.value, (newVal) => {
    if (!newVal) {
      selectedRequirement.value = null
    }
  })
  
  // SEO
  useHead({
    title: 'Document Requirements',
    meta: [
      { name: 'description', content: 'Manage country-specific document requirements' }
    ]
  })

  definePageMeta({
  layout: "dashboard",
});
  </script>