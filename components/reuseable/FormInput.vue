<template>
    <div>
      <label :for="id" class="block text-sm font-medium text-gray-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div 
          v-if="icon" 
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <component :is="icon" class="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          :id="id"
          :type="type"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="block w-full rounded-md border-gray-300 outline-none focus:ring-primary focus:border-primary p-3 border sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          :class="[
            icon ? 'pl-10' : '',
            error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : ''
          ]"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          :readonly="readonly"
          :min="min"
          :max="max"
          :maxlength="maxlength"
          :pattern="pattern"
        />
        
        <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
      <p v-if="helpText" class="mt-2 text-sm text-gray-500">{{ helpText }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    modelValue: string | number
    label: string
    id?: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    min?: number | string
    max?: number | string
    maxlength?: number
    pattern?: string
    error?: string
    helpText?: string
    icon?: any
  }
  
  const props = withDefaults(defineProps<Props>(), {
    id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    readonly: false
  })
  
  defineEmits(['update:modelValue'])
  </script>