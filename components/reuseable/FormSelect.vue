<template>
    <div>
      <label :for="id" class="block text-sm font-medium text-gray-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div class="mt-1 relative">
        <select
          :id="id"
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="block w-full pl-3 pr-10 text-base border-gray-300 p-3 outline-none border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
          :class="{ 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500': error }"
          :required="required"
          :disabled="disabled"
        >
          <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        
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
  interface Option {
    value: string | number
    label: string
  }
  
  interface Props {
    modelValue: string | number
    label: string
    options: Option[]
    id?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
    helpText?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    id: () => `select-${Math.random().toString(36).substring(2, 9)}`,
    placeholder: 'Select an option',
    required: false,
    disabled: false
  })
  
  defineEmits(['update:modelValue'])
  </script>