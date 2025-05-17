<template>
    <div 
      class="bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
      @click="navigateToPassengerDetails"
    >
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img 
              :src="passenger.photoURL || avatarImage" 
              alt="Passenger photo" 
              class="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">{{ passenger.firstName }} {{ passenger.lastName }}</h3>
            <div class="flex items-center mt-1">
              <div class="flex items-center">
                <Star class="h-4 w-4 text-yellow-400" />
                <span class="ml-1 text-sm text-gray-600">{{ passenger.rating || 'N/A' }}</span>
              </div>
              <span class="mx-2 text-gray-300">•</span>
              <span class="text-sm text-gray-600">{{ formatDate(passenger.createdAt) }}</span>
            </div>
          </div>
          <div class="ml-auto">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getVerificationStatusClass(passenger.IDVerificationStatus)"
            >
              {{ formatVerificationStatus(passenger.IDVerificationStatus) }}
            </span>
          </div>
        </div>
        
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-500">Email</p>
            <p class="text-sm font-medium text-gray-900">{{ passenger.email }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Email Verified</p>
            <p class="text-sm font-medium text-gray-900">{{ passenger.emailIsVerified ? 'Yes' : 'No' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Auth Provider</p>
            <p class="text-sm font-medium text-gray-900 capitalize">{{ passenger.authProvider }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Wallet Balance</p>
            <p class="text-sm font-medium text-gray-900">{{ formatCurrency(passenger.walletBalance) }}</p>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between items-center">
        <span class="text-xs text-gray-500">
          Joined {{ formatTimeAgo(passenger.createdAt) }}
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
  import { Passenger } from '@/types/passenger';
  
  const props = defineProps<{
    passenger: Passenger;
  }>();
  
  const router = useRouter();
  
  const navigateToPassengerDetails = () => {
    router.push(`/dashboard/passengers/${props.passenger._id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
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