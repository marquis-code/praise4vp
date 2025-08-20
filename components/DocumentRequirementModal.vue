<!-- <template>
    <div
      v-if="show"
      class="fixed inset-0 backdrop-blur-md z-50 overflow-y-auto"
      @click="closeModal"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>
  
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
  
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          @click.stop
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEditing ? 'Edit Document Requirement' : 'Create Document Requirement' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
  
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Country Code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.countryCode"
                type="text"
                required
                placeholder="e.g., NG, US, UK"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-300': errors.countryCode }"
              />
              <p v-if="errors.countryCode" class="mt-1 text-sm text-red-600">{{ errors.countryCode }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Document Code <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.documentCode"
                type="text"
                required
                placeholder="e.g., NG-02, US-01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-300': errors.documentCode }"
              />
              <p v-if="errors.documentCode" class="mt-1 text-sm text-red-600">{{ errors.documentCode }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Document Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g., National ID Card, Passport"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :class="{ 'border-red-300': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>
  
            <div>
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Document Requirement
                  </label>
                  <p class="text-sm text-gray-500">
                    Is this document required for verification?
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="form.required"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900">
                    {{ form.required ? 'Required' : 'Optional' }}
                  </span>
                </label>
              </div>
            </div>
  
            <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
                class="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="createLoading || updateLoading"
                class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <svg
                  v-if="createLoading || updateLoading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEditing ? 'Update Requirement' : 'Create Requirement' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCreateDocumentRequirement } from "@/composables/modules/documents/useCreateDocumentRequirement"
  import { useUpdateDocumentRequirement } from "@/composables/modules/documents/useUpdateDocumentRequirement"
  interface DocumentRequirement {
    id?: string
    countryCode: string
    documentCode: string
    name: string
    required: boolean
  }
  
  interface Props {
    show: boolean
    requirement?: DocumentRequirement | null
  }
  
  interface Emits {
    (e: 'update:show', value: boolean): void
    (e: 'saved'): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  // Composables
  const { createDocumentRequirement, loading: createLoading } = useCreateDocumentRequirement()
  const { updateDocumentRequirement, loading: updateLoading } = useUpdateDocumentRequirement()
  
  // Reactive data
  const form = reactive({
    countryCode: '',
    documentCode: '',
    name: '',
    required: false
  })
  
  const errors = reactive({
    countryCode: '',
    documentCode: '',
    name: ''
  })
  
  // Computed
  const isEditing = computed(() => !!props.requirement?.id)
  
  // Methods
  const resetForm = () => {
    form.countryCode = ''
    form.documentCode = ''
    form.name = ''
    form.required = false
    
    errors.countryCode = ''
    errors.documentCode = ''
    errors.name = ''
  }
  
  const validateForm = () => {
    let isValid = true
    
    // Reset errors
    errors.countryCode = ''
    errors.documentCode = ''
    errors.name = ''
  
    // Country Code validation
    if (!form.countryCode.trim()) {
      errors.countryCode = 'Country code is required'
      isValid = false
    } else if (!/^[A-Z]{2,3}$/.test(form.countryCode.trim().toUpperCase())) {
      errors.countryCode = 'Country code must be 2-3 uppercase letters'
      isValid = false
    }
  
    // Document Code validation
    if (!form.documentCode.trim()) {
      errors.documentCode = 'Document code is required'
      isValid = false
    } else if (!/^[A-Z]{2,3}-\d{2,3}$/.test(form.documentCode.trim().toUpperCase())) {
      errors.documentCode = 'Document code must follow format: XX-XX (e.g., NG-02)'
      isValid = false
    }
  
    // Name validation
    if (!form.name.trim()) {
      errors.name = 'Document name is required'
      isValid = false
    } else if (form.name.trim().length < 3) {
      errors.name = 'Document name must be at least 3 characters'
      isValid = false
    }
  
    return isValid
  }
  
  const handleSubmit = async () => {
    if (!validateForm()) return
  
    const payload = {
      countryCode: form.countryCode.trim().toUpperCase(),
      documentCode: form.documentCode.trim().toUpperCase(),
      name: form.name.trim(),
      required: form.required
    }
  
    let success = false
  
    if (isEditing.value && props.requirement?.id) {
      const result = await updateDocumentRequirement(props.requirement.id, payload)
      success = !!result
    } else {
      const result = await createDocumentRequirement(payload)
      success = !!result
    }
  
    if (success) {
      emit('saved')
      closeModal()
    }
  }
  
  const closeModal = () => {
    emit('update:show', false)
    setTimeout(resetForm, 300) // Reset after modal transition
  }
  
  // Watchers
  watch(() => props.show, (newVal) => {
    if (newVal && props.requirement) {
      // Populate form with existing data for editing
      form.countryCode = props.requirement.countryCode || ''
      form.documentCode = props.requirement.documentCode || ''
      form.name = props.requirement.name || ''
      form.required = props.requirement.required || false
    } else if (newVal) {
      // Reset form for new creation
      resetForm()
    }
  })
  
  // Handle escape key
  onMounted(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.show) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  })
  </script> -->



  <template>
  <div
    v-if="show"
    class="fixed inset-0 backdrop-blur-md z-50 overflow-y-auto"
    @click="closeModal"
  >
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Center the modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ requirement ? 'Edit Document Requirement' : 'Create Document Requirement' }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Country Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Country <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.countryCode"
              required
              class="select-field"
              :class="{ 'border-red-300': errors.countryCode }"
              @change="onCountryChange"
            >
              <option value="">Select a country</option>
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }} ({{ country.code }})
              </option>
            </select>
            <p v-if="errors.countryCode" class="mt-1 text-sm text-red-600">{{ errors.countryCode }}</p>
          </div>

          <!-- State Selection -->
          <div v-if="availableStates.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              State/Province <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.state"
              required
              class="select-field"
              :class="{ 'border-red-300': errors.state }"
            >
              <option value="">Select a state/province</option>
              <option v-for="state in availableStates" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
            <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state }}</p>
          </div>

          <!-- Document Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Document Code <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.documentCode"
              type="text"
              required
              placeholder="e.g., NG-02, US-01"
              class="input-field"
              :class="{ 'border-red-300': errors.documentCode }"
            />
            <p v-if="errors.documentCode" class="mt-1 text-sm text-red-600">{{ errors.documentCode }}</p>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Document Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g., National ID Card, Passport"
              class="input-field"
              :class="{ 'border-red-300': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Required Toggle -->
          <div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Document Requirement
                </label>
                <p class="text-sm text-gray-500">
                  Is this document required for verification?
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="form.required"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900">
                  {{ form.required ? 'Required' : 'Optional' }}
                </span>
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row space-x-10 text-sm w-full gap-3 pt-6 border-t border-gray-200">
            <div class="w-full">
              <button
              type="button"
              @click="closeModal"
              class="w-full py-2.5 bg-gray-200 rounded-lg text-sm"
            >
              Cancel
            </button>
            </div>
           <div class="w-full">
             <button
              type="submit"
              :disabled="loading"
              class="bg-primary text-white text-sm px-6 py-2.5 rounded-lg w-full flex items-center justify-center"
            >
              <div
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></div>
              {{ requirement ? 'Update Requirement' : 'Create Requirement' }}
            </button>
           </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { countries, getStatesByCountryCode } from '~/utils/countries-states'
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useCreateDocumentRequirement } from "@/composables/modules/documents/useCreateDocumentRequirement"
  import { useUpdateDocumentRequirement } from "@/composables/modules/documents/useUpdateDocumentRequirement"
    // Composables
  const { createDocumentRequirement, loading: createLoading } = useCreateDocumentRequirement()
  const { updateDocumentRequirement, loading: updateLoading } = useUpdateDocumentRequirement()

interface DocumentRequirement {
  _id?: string
  countryCode: string
  documentCode: string
  name: string
  required: boolean
  state?: string
}

interface Props {
  show: boolean
  requirement?: DocumentRequirement | null
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = computed(() => createLoading.value || updateLoading.value)

const form = reactive({
  countryCode: '',
  state: '',
  documentCode: '',
  name: '',
  required: false
})

const errors = reactive({
  countryCode: '',
  state: '',
  documentCode: '',
  name: ''
})

const availableStates = computed(() => {
  return form.countryCode ? getStatesByCountryCode(form.countryCode) : []
})

const onCountryChange = () => {
  form.state = '' 
}

const resetForm = () => {
  form.countryCode = ''
  form.state = ''
  form.documentCode = ''
  form.name = ''
  form.required = false
  
  errors.countryCode = ''
  errors.state = ''
  errors.documentCode = ''
  errors.name = ''
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.countryCode = ''
  errors.state = ''
  errors.documentCode = ''
  errors.name = ''

  // Country Code validation
  if (!form.countryCode.trim()) {
    errors.countryCode = 'Country is required'
    isValid = false
  }

  // State validation
  if (availableStates.value.length > 0 && !form.state.trim()) {
    errors.state = 'State/Province is required'
    isValid = false
  }

  // Document Code validation
  if (!form.documentCode.trim()) {
    errors.documentCode = 'Document code is required'
    isValid = false
  }

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Document name is required'
    isValid = false
  } else if (form.name.trim().length < 3) {
    errors.name = 'Document name must be at least 3 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  const payload: DocumentRequirement = {
    countryCode: form.countryCode.trim(),
    documentCode: form.documentCode.trim(),
    name: form.name.trim(),
    required: form.required
  }

  if (form.state.trim()) {
    payload.state = form.state.trim()
  }

  try {
    if (props.requirement?._id) {
      payload.id = props.requirement._id
      await updateDocumentRequirement(props.requirement._id, payload)
    } else {
      await createDocumentRequirement(payload)
    }
    
    emit('saved')
    closeModal()
  } catch (error) {
    console.error('Error saving document:', error)
  }
}

const closeModal = () => {
  emit('update:show', false)
  setTimeout(resetForm, 300)
}

watch(() => props.show, (newVal) => {
  if (newVal && props.requirement) {
    // Populate form with existing data for editing
    form.countryCode = props.requirement.countryCode || ''
    form.state = props.requirement.state || ''
    form.documentCode = props.requirement.documentCode || ''
    form.name = props.requirement.name || ''
    form.required = props.requirement.required || false
  } else if (newVal) {
    resetForm()
  }
})

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
