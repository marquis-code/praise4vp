<template>
    <div class="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div class="p-5">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
              :class="getStatusClass(trip.status)"
            >
              {{ trip.status }}
            </span>
            <span 
              v-if="trip.isScheduled" 
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              Scheduled
            </span>
          </div>
          <span class="text-sm text-gray-500">{{ formatDate(trip.createdAt) }}</span>
        </div>
        
        <div class="flex items-center mb-4">
          <User class="h-5 w-5 text-gray-400 mr-2" />
          <span class="text-sm font-medium">{{ trip.driverId.firstName }} {{ trip.driverId.lastName }}</span>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin class="h-4 w-4 text-green-600" />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Pickup</p>
              <p class="text-sm text-gray-900 truncate max-w-xs">{{ getOriginAddress(trip) }}</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <Flag class="h-4 w-4 text-red-600" />
            </div>
            <div class="ml-3">
              <p class="text-xs text-gray-500">Dropoff</p>
              <p class="text-sm text-gray-900 truncate max-w-xs">{{ getDestinationAddress(trip) }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm font-medium text-gray-900">
            {{ formatCurrency(getTotalFare(trip)) }}
          </div>
          
          <button 
            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
            @click.stop="$emit('view-trip', trip._id)"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { User, MapPin, Flag } from 'lucide-vue-next';
  import { Trip } from '@/types/passenger';
  
  const props = defineProps<{
    trip: Trip;
  }>();
  
  defineEmits<{
    (e: 'view-trip', tripId: string): void;
  }>();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusClass = (status: string) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };
  
  const getOriginAddress = (trip: Trip) => {
    if (trip.passengers && trip.passengers.length > 0) {
      return trip.passengers[0].origin.properties.address;
    }
    return 'N/A';
  };
  
  const getDestinationAddress = (trip: Trip) => {
    if (trip.passengers && trip.passengers.length > 0) {
      return trip.passengers[0].destination.properties.address;
    }
    return 'N/A';
  };
  
  const getTotalFare = (trip: Trip) => {
    if (trip.passengers && trip.passengers.length > 0) {
      return trip.passengers.reduce((total, passenger) => total + passenger.totalFare, 0);
    }
    return 0;
  };
  </script>