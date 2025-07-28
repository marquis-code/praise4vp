<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading document requirement...</p>
        </div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="!documentRequirement" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Document requirement not found</h3>
          <p class="text-gray-600 mb-4">The requested document requirement could not be found.</p>
          <NuxtLink
            to="/document-requirements"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Requirements
          </NuxtLink>
        </div>
      </div>
  
      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="bg-white shadow-sm border-b border-gray-200">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <NuxtLink
                to="/document-requirements"
                class="hover:text-gray-700 transition-colors"
              >
                Document Requirements
              </NuxtLink>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span class="text-gray-900">{{ documentRequirement.name }}</span>
            </nav>
  
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ documentRequirement.name }}</h1>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                    {{ documentRequirement.countryCode }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    {{ documentRequirement.documentCode }}
                  </span>
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      documentRequirement.required
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        v-if="documentRequirement.required"
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                      ></path>
                      <path 
                        v-else
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {{ documentRequirement.required ? 'Required' : 'Optional' }}
                  </span>
                </div>
              </div>
  
              <!-- Actions -->
              <div class="flex items-center space-x-3">
                <button
                  @click="editRequirement"
                  class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="confirmDelete"
                  class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Main Content -->
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Info -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Overview Card -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 class="text-lg font-semibold text-gray-900">Overview</h2>
                </div>
                <div class="p-6">
                  <div class="prose max-w-none">
                    <p class="text-gray-600 mb-4">
                      This {{ documentRequirement.required ? 'required' : 'optional' }} document is part of the verification process for {{ documentRequirement.countryCode }} region.
                    </p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-center mb-2">
                          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                          </svg>
                          <h3 class="font-medium text-blue-900">Country</h3>
                        </div>
                        <p class="text-2xl font-bold text-blue-900">{{ documentRequirement.countryCode }}</p>
                      </div>
                      
                      <div class="bg-purple-50 rounded-lg p-4">
                        <div class="flex items-center mb-2">
                          <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <h3 class="font-medium text-purple-900">Code</h3>
                        </div>
                        <p class="text-2xl font-bold text-purple-900">{{ documentRequirement.documentCode }}</p>
                      </div>
                    </div>
  
                    <div class="bg-gray-50 rounded-lg p-4">
                      <div class="flex items-center mb-2">
                        <div
                          :class="[
                            'w-4 h-4 rounded-full mr-2',
                            documentRequirement.required ? 'bg-red-500' : 'bg-green-500'
                          ]"
                        ></div>
                        <h3 class="font-medium text-gray-900">Requirement Status</h3>
                      </div>
                      <p class="text-gray-700 mb-2">
                        <strong>{{ documentRequirement.required ? 'Required Document' : 'Optional Document' }}</strong>
                      </p>
                      <p class="text-sm text-gray-600">
                        {{ documentRequirement.required 
                          ? 'This document must be provided during the verification process. Applications without this document will not be processed.' 
                          : 'This document is optional and can be provided for additional verification or enhanced processing.' 
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Quick Actions -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 class="text-sm font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div class="p-4 space-y-3">
                  <button
                    @click="editRequirement"
                    class="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Requirement
                  </button>
                  <button
                    @click="duplicateRequirement"
                    class="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Duplicate Requirement
                  </button>
                  <hr class="border-gray-200">
                  <button
                    @click="confirmDelete"
                    class="w-full flex items-center px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete Requirement
                  </button>
                </div>
              </div>
  
              <!-- Information -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 class="text-sm font-semibold text-gray-900">Information</h3>
                </div>
                <div class="p-4 space-y-4">
                  <div v-if="documentRequirement.createdAt">
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</dt>
                    <dd class="text-sm text-gray-900">{{ formatDate(documentRequirement.createdAt) }}</dd>
                  </div>
                  <div v-if="documentRequirement.updatedAt">
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</dt>
                    <dd class="text-sm text-gray-900">{{ formatDate(documentRequirement.updatedAt) }}</dd>
                  </div>
                  <div v-if="documentRequirement.id">
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">ID</dt>
                    <dd class="text-sm text-gray-900 font-mono">{{ documentRequirement.id }}</dd>
                  </div>
                </div>
              </div>
  
              <!-- Related Actions -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 class="text-sm font-semibold text-gray-900">Related</h3>
                </div>
                <div class="p-4 space-y-3">
                  <NuxtLink
                    :to="`/document-requirements?countryCode=${documentRequirement.countryCode}`"
                    class="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                    View {{ documentRequirement.countryCode }} Documents
                  </NuxtLink>
                  <NuxtLink
                    to="/document-requirements"
                    class="w-full flex items-center px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    All Requirements
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Modal -->
      <DocumentRequirementModal
        v-model:show="showEditModal"
        :requirement="documentRequirement"
        @saved="handleSaved"
      />
  
      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        v-model:show="showDeleteModal"
        title="Delete Document Requirement"
        :message="`Are you sure you want to delete '${documentRequirement?.name}'? This action cannot be undone.`"
        confirm-text="Delete"
        confirm-class="bg-red-600 hover:bg-red-700"
        @confirm="handleDelete"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGetDocumentById } from "@/composables/modules/documents/useGetDocumentById"
    import { useCreateDocumentRequirement } from "@/composables/modules/documents/useCreateDocumentRequirement"
  import { useUpdateDocumentRequirement } from "@/composables/modules/documents/useUpdateDocumentRequirement"
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
  const route = useRoute()
  const router = useRouter()
  const { documentRequirement, loading, fetchDocumentById } = useGetDocumentById()
  const { deleteDocumentRequirement } = useDeleteDocumentRequirement()
  const { createDocumentRequirement } = useCreateDocumentRequirement()
  
  // Reactive data
  const showEditModal = ref(false)
  const showDeleteModal = ref(false)
  
  // Methods
  const editRequirement = () => {
    showEditModal.value = true
  }
  
  const confirmDelete = () => {
    showDeleteModal.value = true
  }
  
  const handleDelete = async () => {
    if (!documentRequirement.value) return
    
    const success = await deleteDocumentRequirement(documentRequirement.value.id)
    if (success) {
      await router.push('/document-requirements')
    }
    showDeleteModal.value = false
  }
  
  const handleSaved = () => {
    showEditModal.value = false
    // Refresh the data
    fetchDocumentById(route.params.id as string)
  }
  
  const duplicateRequirement = async () => {
    if (!documentRequirement.value) return
  
    const payload = {
      countryCode: documentRequirement.value.countryCode,
      documentCode: `${documentRequirement.value.documentCode}-COPY`,
      name: `${documentRequirement.value.name} (Copy)`,
      required: documentRequirement.value.required
    }
  
    const result = await createDocumentRequirement(payload)
    if (result) {
      await router.push(`/document-requirements/${result.id}`)
    }
  }
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }
  
  // SEO
  useHead({
    title: computed(() => documentRequirement.value ? `${documentRequirement.value.name} - Document Requirements` : 'Document Requirement'),
    meta: [
      { 
        name: 'description', 
        content: computed(() => documentRequirement.value ? `Details for ${documentRequirement.value.name} document requirement` : 'Document requirement details') 
      }
    ]
  })
  
  // Handle case where document is not found
  watch(documentRequirement, (newVal) => {
    if (newVal === null && !loading.value) {
      // Document not found, redirect after a brief delay
      setTimeout(() => {
        router.push('/document-requirements')
      }, 3000)
    }
  })

  definePageMeta({
  layout: "dashboard",
});
  </script>