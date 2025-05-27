<template>
    <div 
      class="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
      @click="navigateToDriverDetails"
    >
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- <img 
              :src="driver.photoURL || avatarImage" 
              alt="Driver photo" 
              class="h-12 w-12 rounded-full object-cover border border-gray-200"
            /> -->
            <img 
              src="@/assets/img/avatar-male.svg" 
              alt="Driver photo" 
              class="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
          </div>
          <div class="ml-4">
            <div class="text-xs text-gray-500 font-mono mb-3">ID: {{ driver._id || 'Nil' }}</div>
            <h3 class="text-lg font-medium text-gray-900">{{ driver?.firstName }} {{ driver?.lastName }}</h3>
            <div class="flex items-center mt-1">
              <div class="flex items-center">
                <Star class="h-4 w-4 text-yellow-400" />
                <span class="ml-1 text-sm text-gray-600">{{ driver?.rating.toFixed(1) }}</span>
              </div>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-sm text-gray-600">{{ formatDate(driver?.createdAt) }}</span>
            </div>
          </div>
          <div class="ml-auto">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getVerificationStatusClass(driver?.IDVerificationStatus)"
            >
              {{ formatVerificationStatus(driver?.IDVerificationStatus) }}
            </span>
          </div>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-500">Car</p>
            <p class="text-sm font-medium text-gray-900">{{ driver?.driverData?.carBrand }} {{ driver?.driverData?.carModel }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Plate Number</p>
            <p class="text-sm font-medium text-gray-900">{{ driver?.driverData?.plateNumber }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Phone</p>
            <p class="text-sm font-medium text-gray-900">{{ driver?.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Wallet Balance</p>
            <p class="text-sm font-medium text-gray-900">{{ formatCurrency(driver?.driverData?.walletBalance) }}</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between items-center">
        <span class="text-xs text-gray-500">
          {{ driver.driverData.carColor }} {{ driver?.driverData?.carYear }} • {{ driver?.driverData?.seats }} seats
        </span>
        <button 
          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
        >
          View Details
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Star } from 'lucide-vue-next';
  import { useRouter } from 'vue-router';
  import avatarImage from "@/assets/icons/avatar.svg";
  import { Driver } from '@/types';
  
  const props = defineProps<{
    driver: Driver;
  }>();
  
  const router = useRouter();
  
  const navigateToDriverDetails = () => {
    router.push(`/dashboard/drivers/${props.driver._id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
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
  
  const getVerificationStatusClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatVerificationStatus = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Created';
    }
  };
  </script>