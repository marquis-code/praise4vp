<template>
  <div class="min-h-screen">
    <div class="">
      <!-- Header -->
<section class="flex justify-between items-center pb-6">
        <div class="">
        <h1 class="text-2xl font-bold text-gray-900">Document Requirements Manager</h1>
        <p class="mt-2 text-gray-600">Manage document requirements by country and state</p>
      </div>

   <div>
        <button @click="openCreateModal" class="text-sm flex items-center space-x-2 py-2.5 px-3 bg-primary text-white rounded-lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Document
          </button>
   </div>
</section>

      <!-- Controls -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex flex-col sm:flex-row gap-4 flex-1">
          <!-- Search -->
          <div class="relative flex-1 max-w-md">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search documents, codes, countries, or states..."
              class="pl-10 text-sm input-field"
            />
          </div>

          <!-- Filters -->
          <div class="flex gap-2">
            <select v-model="filters.countryCode" class="select-field text-sm min-w-[140px]">
              <option value="">All Countries</option>
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>

            <select v-model="filters.state" class="select-field text-sm min-w-[140px]" :disabled="!filters.countryCode">
              <option value="">All States</option>
              <option v-for="state in availableStates" :key="state" :value="state">
                {{ state }}
              </option>
            </select>

            <button @click="clearFilters" class="btn-secondary text-sm whitespace-nowrap">
              Clear Filters
            </button>
          </div>
        </div>

        <!-- View Toggle and Add Button -->
        <div class="flex gap-2">
          <div class="flex bg-gray-200 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredDocuments.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || filters.countryCode || filters.state ? 'Try adjusting your search or filters.' : 'Get started by creating a new document requirement.' }}
        </p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="document in filteredDocuments"
          :key="document.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          @click="viewDocument(document)"
        >
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 truncate">{{ document.name }}</h3>
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              document.required ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ document.required ? 'Required' : 'Optional' }}
            </span>
          </div>
          
          <div class="space-y-2 text-sm text-gray-600">
            <p><span class="font-medium">Code:</span> {{ document.documentCode }}</p>
            <p><span class="font-medium">Country:</span> {{ getCountryName(document.countryCode) }}</p>
            <p><span class="font-medium">State:</span> {{ document.state }}</p>
          </div>

          <div class="mt-4 flex justify-end space-x-2">
            <button
              @click.stop="editDocument(document)"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              @click.stop="deleteDocument(document)"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
              :disabled="deleteLoading"
            >
              {{ deleteLoading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
              <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th class="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
              <th class="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="document in filteredDocuments"
              :key="document.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="viewDocument(document)"
            >
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ document.name }}</div>
              </td>
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ document.documentCode }}</div>
              </td>
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getCountryName(document.countryCode) }}</div>
              </td>
              <td class="px-6 py-6 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ document.state }}</div>
              </td>
              <td class="px-6 py-6 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  document.required ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ document.required ? 'Required' : 'Optional' }}
                </span>
              </td>
              <td class="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click.stop="editDocument(document)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click.stop="deleteDocument(document)"
                  class="text-red-600 hover:text-red-900"
                  :disabled="deleteLoading"
                >
                  {{ deleteLoading ? 'Deleting...' : 'Delete' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modals -->
      <DocumentRequirementModal
        :show="modals.create || modals.edit"
        :requirement="modals.edit ? selectedDocument : null"
        @update:show="(value) => { if (!value) closeModals() }"
        @saved="handleDocumentSaved"
      />

      <DocumentRequirementViewModal
        :is-open="modals.view"
        :document="selectedDocument"
        @close="closeModals"
        @edit="editDocument"
      />

      <ConfirmationModal
        :show="modals.delete"
        title="Delete Document Requirement"
        message="Are you sure you want to delete this document requirement? This action cannot be undone."
        confirm-text="Delete"
        :loading="deleteLoading"
        @close="closeModals"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useGetAllCountryDocumentRequirements } from "@/composables/modules/documents/useGetAllCountryDocumentRequirements"
import { useDeleteDocumentRequirement } from "@/composables/modules/documents/useDeleteDocumentRequirement"
  // Composables
  const { documentRequirements, totalCount, loading, fetchAllDocumentRequirements } = useGetAllCountryDocumentRequirements()
  const { deleteDocumentRequirement, loading: deleteLoading } = useDeleteDocumentRequirement()
import { countries, getStatesByCountryCode } from '~/utils/countries-states'

interface DocumentRequirement {
  id: string
  countryCode: string
  documentCode: string
  name: string
  required: boolean
  state?: string
  createdAt?: string
  updatedAt?: string
}

const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('list')
const selectedDocument = ref<DocumentRequirement | null>(null)

const filters = reactive({
  countryCode: '',
  state: ''
})

definePageMeta({
  layout: 'dashboard'
})

const modals = reactive({
  create: false,
  edit: false,
  view: false,
  delete: false
})

const availableStates = computed(() => {
  return filters.countryCode ? getStatesByCountryCode(filters.countryCode) : []
})

const filteredDocuments = computed(() => {
  let filtered = documentRequirements.value || []

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(query) ||
      doc.documentCode.toLowerCase().includes(query) ||
      getCountryName(doc.countryCode).toLowerCase().includes(query) ||
      (doc.state && doc.state.toLowerCase().includes(query))
    )
  }

  // Country filter
  if (filters.countryCode) {
    filtered = filtered.filter(doc => doc.countryCode === filters.countryCode)
  }

  // State filter
  if (filters.state) {
    filtered = filtered.filter(doc => doc.state === filters.state)
  }

  return filtered
})

const getCountryName = (countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode)
  return country ? country.name : countryCode
}

const openCreateModal = () => {
  selectedDocument.value = null
  modals.create = true
  modals.edit = false
}

const viewDocument = (document: DocumentRequirement) => {
  selectedDocument.value = document
  modals.view = true
}

const editDocument = (document: DocumentRequirement) => {
  selectedDocument.value = document
  modals.view = false
  modals.create = false
  modals.edit = true
}

const deleteDocument = (document: DocumentRequirement) => {
  selectedDocument.value = document
  modals.delete = true
}

const closeModals = () => {
  modals.create = false
  modals.edit = false
  modals.view = false
  modals.delete = false
  selectedDocument.value = null
}

const handleDocumentSaved = async (documentData: DocumentRequirement) => {
  try {
    if (modals.edit && documentData.id) {
      // Update existing document
      const index = documentRequirements.value.findIndex(doc => doc.id === documentData.id)
      if (index !== -1) {
        documentRequirements.value[index] = { ...documentData, updatedAt: new Date().toISOString() }
      }
    } else {
      // Create new document
      const newDocument = {
        ...documentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      documentRequirements.value.push(newDocument)
    }
    await fetchAllDocumentRequirements()
    closeModals()
  } catch (error) {
    console.error('Error saving document:', error)
  }
}

const confirmDelete = async () => {
  if (selectedDocument.value?._id) {
    try {
      await deleteDocumentRequirement(selectedDocument.value._id)
      await fetchAllDocumentRequirements()
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }
  closeModals()
}

const clearFilters = () => {
  filters.countryCode = ''
  filters.state = ''
  searchQuery.value = ''
}

let searchTimeout: NodeJS.Timeout | null = null
watch(searchQuery, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    // Debounced search logic here if needed
  }, 300)
})

watch(() => filters.countryCode, () => {
  filters.state = ''
})

onMounted(() => {
  fetchAllDocumentRequirements()
})
</script>
