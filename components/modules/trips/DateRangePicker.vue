<template>
    <div class="flex space-x-2">
      <div class="w-1/2">
        <input
          type="date"
          :value="startDate ? formatDateForInput(startDate) : ''"
          @input="updateStartDate"
          class="w-full rounded-md border-gray-300 shadow-sm border-[0.5px] p-3 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          placeholder="Start date"
        />
      </div>
      <div class="w-1/2">
        <input
          type="date"
          :value="endDate ? formatDateForInput(endDate) : ''"
          @input="updateEndDate"
          class="w-full rounded-md border-gray-300 shadow-sm border-[0.5px] p-3 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          placeholder="End date"
          :min="startDate ? formatDateForInput(startDate) : ''"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    startDate: Date | null
    endDate: Date | null
  }>()
  
  const emit = defineEmits<{
    (e: 'update:startDate', value: Date | null): void
    (e: 'update:endDate', value: Date | null): void
  }>()
  
  const formatDateForInput = (date: Date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }
  
  const updateStartDate = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value
    
    if (value) {
      const date = new Date(value)
      emit('update:startDate', date)
      
      // If end date is before start date, update end date
      if (props.endDate && props.endDate < date) {
        emit('update:endDate', date)
      }
    } else {
      emit('update:startDate', null)
    }
  }
  
  const updateEndDate = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = target.value
    
    if (value) {
      emit('update:endDate', new Date(value))
    } else {
      emit('update:endDate', null)
    }
  }
  </script>