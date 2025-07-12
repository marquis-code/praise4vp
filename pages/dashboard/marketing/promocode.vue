<template>
    <div class="min-h-screen">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Promo Codes</h1>
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                @click="showNewRewardModal = true"
                class="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                New reward
              </button>
              <button
                @click="showCreatePromoModal = true"
                class="px-4 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Create Promo Code
              </button>
            </div>
          </div>
          
          <!-- Go back button -->
          <button
            @click="goBack"
            class="inline-flex items-center text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Go back
          </button>
        </div>
  
        <!-- Search and Download Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="search"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              @click="downloadReport"
              class="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download report
            </button>
          </div>
        </div>
  
        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Number of Uses</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(promo, index) in filteredPromos" :key="promo.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ promo.campaign }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-sm text-gray-900">{{ promo.code }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ promo.maxUses }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ promo.expiresAt }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        promo.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ promo.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Mobile Cards -->
          <div class="lg:hidden">
            <div v-for="(promo, index) in filteredPromos" :key="promo.id" class="p-4 border-b border-gray-200 last:border-b-0">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-500 mr-2">{{ index + 1 }}.</span>
                  <span class="text-lg font-semibold text-gray-900">{{ promo.campaign }}</span>
                </div>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    promo.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ promo.status }}
                </span>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-sm font-medium text-gray-900">{{ promo.code }}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500">Max Uses:</span>
                    <span class="ml-1 text-gray-900">{{ promo.maxUses }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Expires:</span>
                    <span class="ml-1 text-gray-900">{{ promo.expiresAt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredPromos.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No promo codes found</h3>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your search query</p>
          </div>
        </div>
      </div>
  
      <!-- Create Promo Code Modal -->
      <div v-if="showCreatePromoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Create Promo Code</h2>
          <form @submit.prevent="createPromoCode">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  v-model="newPromo.campaign"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <input
                  v-model="newPromo.code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter promo code"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                <input
                  v-model="newPromo.maxUses"
                  type="number"
                  required
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter max uses"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                <input
                  v-model="newPromo.expiresAt"
                  type="datetime-local"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showCreatePromoModal = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- New Reward Modal -->
      <div v-if="showNewRewardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Create New Reward</h2>
          <form @submit.prevent="createNewReward">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reward Name</label>
                <input
                  v-model="newReward.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reward name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  v-model="newReward.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reward description"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Reward Type</label>
                <select
                  v-model="newReward.type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="discount">Discount</option>
                  <option value="free-shipping">Free Shipping</option>
                  <option value="gift">Gift</option>
                  <option value="cashback">Cashback</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  v-model="newReward.value"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reward value"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showNewRewardModal = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Create Reward
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Toast Notifications -->
      <div v-if="showToast" class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        {{ toastMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  interface PromoCode {
    id: string
    campaign: string
    code: string
    maxUses: number
    expiresAt: string
    status: 'Active' | 'Inactive'
  }
  
  interface NewPromo {
    campaign: string
    code: string
    maxUses: number
    expiresAt: string
  }
  
  interface Reward {
    name: string
    description: string
    type: string
    value: string
  }
  
  // Reactive data
  const searchQuery = ref('')
  const showCreatePromoModal = ref(false)
  const showNewRewardModal = ref(false)
  const showToast = ref(false)
  const toastMessage = ref('')
  
  const newPromo = ref<NewPromo>({
    campaign: '',
    code: '',
    maxUses: 1,
    expiresAt: ''
  })
  
  const newReward = ref<Reward>({
    name: '',
    description: '',
    type: '',
    value: ''
  })

  definePageMeta({
    layout: "dashboard"
  })
  
  // Sample data matching the UI
  const promoCodes = ref<PromoCode[]>([
    {
      id: '1',
      campaign: 'test',
      code: 'TEST-CODE-SHFJEJ',
      maxUses: 2,
      expiresAt: 'Jul 14, 2025 1:00 AM',
      status: 'Active'
    },
    {
      id: '2',
      campaign: '',
      code: 'SHajafik-SHEYNAG1',
      maxUses: 0,
      expiresAt: 'May 7, 2025 1:00 AM',
      status: 'Inactive'
    },
    {
      id: '3',
      campaign: 'test',
      code: 'testit-SHTOMT',
      maxUses: 1,
      expiresAt: 'May 2, 2025 1:00 AM',
      status: 'Inactive'
    },
    {
      id: '4',
      campaign: 'Toal',
      code: 'OBI-SHJMOQ',
      maxUses: 3,
      expiresAt: 'Never',
      status: 'Active'
    },
    {
      id: '5',
      campaign: 'FCMB Codes',
      code: 'SHAJAQAQZ06',
      maxUses: 1,
      expiresAt: 'Never',
      status: 'Active'
    },
    {
      id: '6',
      campaign: 'FCMB Codes',
      code: 'SHAJAECF6H6',
      maxUses: 1,
      expiresAt: 'Never',
      status: 'Active'
    },
    {
      id: '7',
      campaign: 'FCMB Codes',
      code: 'SH*AJA*WZ9PCQ',
      maxUses: 1,
      expiresAt: 'Never',
      status: 'Active'
    }
  ])
  
  // Computed properties
  const filteredPromos = computed(() => {
    if (!searchQuery.value) return promoCodes.value
    
    const query = searchQuery.value.toLowerCase()
    return promoCodes.value.filter(promo => 
      promo.campaign.toLowerCase().includes(query) ||
      promo.code.toLowerCase().includes(query) ||
      promo.status.toLowerCase().includes(query)
    )
  })
  
  // Methods
  const goBack = () => {
    showToast.value = true
    toastMessage.value = 'Navigating back...'
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
  
  const downloadReport = () => {
    // Generate CSV content
    const headers = ['S/N', 'Campaign', 'Promo Code', 'Max Uses', 'Expires At', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredPromos.value.map((promo, index) => [
        index + 1,
        `"${promo.campaign}"`,
        `"${promo.code}"`,
        promo.maxUses,
        `"${promo.expiresAt}"`,
        promo.status
      ].join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'promo_codes_report.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast.value = true
    toastMessage.value = 'Report downloaded successfully!'
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
  
  const createPromoCode = () => {
    const newId = (promoCodes.value.length + 1).toString()
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
    
    const newPromoCode: PromoCode = {
      id: newId,
      campaign: newPromo.value.campaign,
      code: newPromo.value.code,
      maxUses: newPromo.value.maxUses,
      expiresAt: formatDate(newPromo.value.expiresAt),
      status: 'Active'
    }
    
    promoCodes.value.unshift(newPromoCode)
    
    // Reset form
    newPromo.value = {
      campaign: '',
      code: '',
      maxUses: 1,
      expiresAt: ''
    }
    
    showCreatePromoModal.value = false
    showToast.value = true
    toastMessage.value = 'Promo code created successfully!'
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
  
  const createNewReward = () => {
    // Reset form
    newReward.value = {
      name: '',
      description: '',
      type: '',
      value: ''
    }
    
    showNewRewardModal.value = false
    showToast.value = true
    toastMessage.value = 'New reward created successfully!'
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }
  
  // Close modals when clicking outside
  const closeModalOnOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('bg-black') && target.classList.contains('bg-opacity-50')) {
      showCreatePromoModal.value = false
      showNewRewardModal.value = false
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', closeModalOnOutsideClick)
  })
  </script>