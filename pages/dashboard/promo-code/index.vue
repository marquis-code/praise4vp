<template>
  <div class="min-h-screen">
    <div class="">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Promo Codes</h1>
            <p class="text-gray-600 mt-1">
              Manage your promotional campaigns and discount codes
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              @click="showCreatePromoModal = true"
              class="px-6 py-3 bg-gradient-to-r bg-primary text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg
                class="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Create Promo Code
            </button>
          </div>
        </div>

        <!-- Go back button -->
        <button
          @click="goBack"
          class="inline-flex items-center text-sm px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 rounded-lg font-medium transition-colors shadow-sm border border-gray-200"
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

      <!-- Search and Actions Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div class="relative w-full flex-1 max-w-md">
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
              placeholder="Search promo codes..."
              class="w-full pl-10 w-full pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <button
            @click="downloadReport"
            class="flex items-center px-4 text-sm py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors shadow-sm"
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
            Download report
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="allLoading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
      </div>

      <!-- Promo Codes Grid -->
      <div
        v-else-if="filteredPromoCodes.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="promo in filteredPromoCodes"
          :key="promo._id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ promo.name }}
              </h3>
              <p class="text-sm text-gray-600">{{ promo.description }}</p>
            </div>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                !promo.hasPromotionExpired
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ !promo.hasPromotionExpired ? "Active" : "Expired" }}
            </span>
          </div>

          <div class="space-y-3">
            <div
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-400 mr-2"
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
                <span class="text-sm font-mono font-medium text-gray-900">{{
                  promo.promoCode
                }}</span>
              </div>
              <button
                @click="copyToClipboard(promo.promoCode)"
                class="text-primary hover:text-primary transition-colors"
                title="Copy to clipboard"
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

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Reward:</span>
                <div class="font-medium text-gray-900">
                  {{ promo.rewardAmount }}%
                  {{ promo?.rewardKind?.replace(/_/g, " ") }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Service Type:</span>
                <div class="font-medium text-gray-900">
                  {{ promo.serviceType }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Max Amount Per User:</span>
                <div class="font-medium text-gray-900">
                  {{ promo.maxAmountPerUser }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Max Uses:</span>
                <div class="font-medium text-gray-900">
                  {{ promo.maxNumberOfUses || "Unlimited" }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Per User:</span>
                <div class="font-medium text-gray-900">
                  {{ promo.maxAmountPerUser }}
                </div>
              </div>
              <div>
                <span class="text-gray-500">Used:</span>
                <div class="font-medium text-gray-900">
                  {{ promo.numberOfUsages || 0 }}
                </div>
              </div>
            </div>

            <div class="text-xs text-gray-500">
              Created: {{ formatDate(promo.createdAt) }}
            </div>
          </div>

          <div
            class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100"
          >
            <button
              @click="viewPromoCode(promo._id)"
              class="text-primary text-sm font-medium transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z"></path></svg>
            </button>
            <div class="flex space-x-2">
              <button
                @click="editPromoCode(promo)"
                class="p-2 text-primary transition-colors"
                title="Edit"
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
                @click="confirmDelete(promo)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 class="text-xl font-medium text-gray-900 mb-2">
            No promo codes found
          </h3>
          <p class="text-gray-500 mb-6">
            Get started by creating your first promotional campaign
          </p>
          <button
            @click="showCreatePromoModal = true"
            class="px-6 py-3 bg-primary text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Create Your First Promo Code
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Promo Code Modal -->
    <div
      v-if="showCreatePromoModal || showEditPromoModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <h2 class="text-lg font-bold mb-6">
          {{ showEditPromoModal ? "Edit" : "Create" }} Promo Code
        </h2>
        <form
          @submit.prevent="
            showEditPromoModal ? updatePromo() : createPromoCode()
          "
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Campaign Name</label
              >
              <input
                v-model="promoForm.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Description</label
              >
              <textarea
                v-model="promoForm.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter description"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Promo Code</label
              >
              <input
                v-model="promoForm.promoCode"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter promo code"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Max Uses</label
                >
                <input
                  v-model.number="promoForm.maxNumberOfUses"
                  type="number"
                  min="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="0 for unlimited"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Max Uses Per User</label
                >
                <input
                  v-model.number="promoForm.maxNumberOfUsesPerUser"
                  type="number"
                  required
                  min="1"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter max uses per user"
                />
              </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Maximum Amount Per User</label
                >
                <input
                  v-model.number="promoForm.maxAmountPerUser"
                  type="number"
                  required
                  min="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter amount"
                />
              </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Reward Amount</label
                >
                <input
                  v-model.number="promoForm.rewardAmount"
                  type="number"
                  required
                  min="0"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Reward Type</label
                >
                <select
                  v-model="promoForm.rewardKind"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select type</option>
                  <option value="percentage_discount">
                    Percentage Discount on Trips
                  </option>
                  <option value="amount_discount">
                    Amount Discount on Trips
                  </option>
                </select>
              </div>
            </div>


              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Service Type</label
                >
                <select
                  v-model="promoForm.serviceType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select type</option>
                  <option value="trips">
                    Trips
                  </option>
                  <option value="delivery">
                    Delivery
                  </option>
                  <option value="all">All</option>
                </select>
              </div>

          </div>

          <div class="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              @click="closeModals"
              class="px-6 py-3 text-gray-600 text-sm bg-gray-50 font-bold rounded-xl hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="createLoading || updateLoading"
              class="px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                v-if="createLoading || updateLoading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ showEditPromoModal ? "Update" : "Create" }} Promo Code
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Promo Code Modal -->
    <div
      v-if="showViewModal && selectedPromoCode"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-lg font-bold">Promo Code Details</h2>
          <button
            @click="showViewModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="singleLoading" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          ></div>
        </div>

        <div v-else-if="selectedPromoCode" class="space-y-6">
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ selectedPromoCode.name }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ selectedPromoCode.description }}
                </p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  !selectedPromoCode.has_promotion_expired
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{
                  !selectedPromoCode.hasPromotionExpired ? "Active" : "Expired"
                }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <span class="text-sm text-gray-500">Promo Code</span>
                <div class="font-mono font-medium text-lg">
                  {{ selectedPromoCode.promoCode }}
                </div>
              </div>
              <button
                @click="copyToClipboard(selectedPromoCode.promoCode)"
                class="p-2 text-primary hover:text-primary transition-colors"
                title="Copy to clipboard"
              >
                <svg
                  class="w-5 h-5"
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

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="text-sm text-gray-500">Reward Amount</span>
                <div class="font-medium text-lg">
                  {{ selectedPromoCode.rewardAmount }}%
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="text-sm text-gray-500">Reward Type</span>
                <div class="font-medium">
                  {{ selectedPromoCode.rewardKind?.replace(/_/g, " ") }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="text-sm text-gray-500">Max Uses</span>
                <div class="font-medium text-lg">
                  {{ selectedPromoCode.maxNumberOfUses || "Unlimited" }}
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <span class="text-sm text-gray-500">Max Per User</span>
                <div class="font-medium text-lg">
                  {{ selectedPromoCode.maxNumberOfUsesPerUser }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-500">Usage Statistics</span>
              <div class="font-medium text-lg">
                {{ selectedPromoCode.numberOfUsages || 0 }} times used
              </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-500">Service Type</span>
              <div class="font-medium text-lg">
                {{ selectedPromoCode.serviceType}}
              </div>
            </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-500">Max Amount Per User</span>
              <div class="font-medium text-lg">
                {{ selectedPromoCode.maxAmountPerUser}}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span>Created:</span>
                <div class="font-medium text-gray-900">
                  {{ formatDate(selectedPromoCode.createdAt) }}
                </div>
              </div>
              <div>
                <span>Updated:</span>
                <div class="font-medium text-gray-900">
                  {{ formatDate(selectedPromoCode.updatedAt) }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              @click="editPromoCode(selectedPromoCode)"
              class="px-6 py-3 border-[0.5px] border-gray-200 text-sm rounded-2xl text-primary hover:text-primary font-medium transition-colors"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(selectedPromoCode)"
              class="px-6 py-3 border-[0.5px] border-gray-200 text-sm rounded-2xl text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <div class="flex justify-center flex-col space-y-3 items-center mb-4">
          <div
            class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 text-center">End Promotion</h3>
            <p class="text-sm text-gray-500 text-center">This action cannot be undone.</p>
          </div>
        </div>

        <p class="text-gray-700 text-center mb-6">
          Are you sure you want to end the usage of the promo code
          <strong>{{ promoToDelete?.promoCode }}</strong
          >?
        </p>

        <div class="flex justify-end pt-6 space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-3 text-center text-gray-600 w-full text-sm bg-gray-100 border-[0.5px] border-gray-100 rounded-full hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deletePromoCode"
            :disabled="endLoading"
            class="px-4 py-3 text-center flex justify-center items-center bg-red-600 w-full text-sm border-[0.5px] border-gray-100 rounded-full hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="endLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="showToast" class="fixed top-4 right-4 z-50">
      <div
        :class="[
          'px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform',
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500',
        ]"
      >
        <div class="flex items-center">
          <svg
            v-if="toastType === 'success'"
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCreatePromoCode } from "@/composables/modules/promo-codes/useCreatePromoCode";
import { useGetAllPromoCodes } from "@/composables/modules/promo-codes/useGetAllPromoCodes";
import { useGetPromoCodeById } from "@/composables/modules/promo-codes/useGetPromoCodeById";
import { useUpdatePromoCode } from "@/composables/modules/promo-codes/useUpdatePromoCode";
import { useEndPromotion } from "@/composables/modules/promo-codes/useEndPromotion";

// Composable instances
const { loading: createLoading, createPromoCode: createPromo } =
  useCreatePromoCode();
const {
  loading: allLoading,
  promoCodes,
  fetchAllPromoCodes,
} = useGetAllPromoCodes();
const {
  loading: singleLoading,
  promoCode,
  fetchPromoCodeById,
} = useGetPromoCodeById();
const { loading: updateLoading, handleUpdatePromo } = useUpdatePromoCode();
const { loading: endLoading, endPromotion } = useEndPromotion();

// Reactive data
const searchQuery = ref("");
const showCreatePromoModal = ref(false);
const showEditPromoModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref<"success" | "error">("success");
const selectedPromoCode = ref<any>(null);
const promoToDelete = ref<any>(null);
const editingPromoId = ref<string | null>(null);

// Form data
const promoForm = ref({
  name: "",
  description: "",
  promoCode: "",
  maxNumberOfUses: 0,
  maxNumberOfUsesPerUser: 1,
  rewardAmount: 0,
  rewardKind: "",
  serviceType: "",
  maxAmountPerUser: 0
});

// Computed
const filteredPromoCodes = computed(() => {
  if (!searchQuery.value) return promoCodes.value;

  const query = searchQuery.value.toLowerCase();
  return promoCodes.value.filter(
    (promo: any) =>
      promo.name?.toLowerCase().includes(query) ||
      promo.description?.toLowerCase().includes(query) ||
      promo.promoCode?.toLowerCase().includes(query) ||
      promo.rewardKind?.toLowerCase().includes(query) ||
      promo.serviceType?.toLowerCase().includes(query)
  );
});

// Methods
const showToastMessage = (
  message: string,
  type: "success" | "error" = "success"
) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const resetForm = () => {
  promoForm.value = {
    name: "",
    description: "",
    promoCode: "",
    maxNumberOfUses: 0,
    maxNumberOfUsesPerUser: 1,
    rewardAmount: 0,
    maxAmountPerUser: 0,
    rewardKind: "",
    serviceType: "",
  };
};

const closeModals = () => {
  showCreatePromoModal.value = false;
  showEditPromoModal.value = false;
  showViewModal.value = false;
  editingPromoId.value = null;
  resetForm();
};

const createPromoCode = async () => {
  try {
    console.log(promoForm.value, "hereo feom");
    // const payloadObj = { ...promoForm.value, serviceType: promoForm.value.rewardKind, maxAmountPerUser: promoForm.value.rewardAmount}
    await createPromo(promoForm.value);
    showToastMessage("Promo code created successfully!");
    closeModals();
    await fetchAllPromoCodes();
  } catch (error: any) {
    showToastMessage(error.message || "Failed to create promo code", "error");
  }
};

const editPromoCode = (promo: any) => {
  editingPromoId.value = promo._id;
  promoForm.value = {
    name: promo.name,
    description: promo.description,
    promoCode: promo.promoCode,
    maxNumberOfUses: promo.maxNumberOfUses,
    maxNumberOfUsesPerUser: promo.maxNumberOfUsesPerUser,
    rewardAmount: promo.rewardAmount,
    maxAmountPerUser: promo.maxAmountPerUser,
    rewardKind: promo.rewardKind,
    serviceType: promo.serviceType,
  };
  showViewModal.value = false;
  showEditPromoModal.value = true;
};

const updatePromo = async () => {
  if (!editingPromoId.value) return;

  try {
    await handleUpdatePromo(editingPromoId.value, promoForm.value);
    showToastMessage("Promo code updated successfully!");
    closeModals();
    await fetchAllPromoCodes();
  } catch (error: any) {
    showToastMessage(error.message || "Failed to update promo code", "error");
  }
};

const viewPromoCode = async (id: string) => {
  try {
    await fetchPromoCodeById(id);
    selectedPromoCode.value = promoCode.value;
    showViewModal.value = true;
  } catch (error: any) {
    showToastMessage(
      error.message || "Failed to fetch promo code details",
      "error"
    );
  }
};

const confirmDelete = (promo: any) => {
  promoToDelete.value = promo;
  showViewModal.value = false;
  showDeleteModal.value = true;
};

const deletePromoCode = async () => {
  if (!promoToDelete.value) return;

  try {
    await endPromotion(promoToDelete.value._id);
    showToastMessage("Promo code deleted successfully!");
    showDeleteModal.value = false;
    promoToDelete.value = null;
    await fetchAllPromoCodes();
  } catch (error: any) {
    showToastMessage(error.message || "Failed to delete promo code", "error");
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToastMessage("Copied to clipboard!");
  } catch (error) {
    showToastMessage("Failed to copy to clipboard", "error");
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const goBack = () => {
  // Navigate back or to dashboard
  window.history.back();
};

const downloadReport = () => {
  // Implement download functionality
  showToastMessage("Download feature coming soon!");
};

// Lifecycle
onMounted(() => {
  fetchAllPromoCodes();
});

definePageMeta({
  layout: "dashboard",
});
</script>
