<template>
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <!-- Stats cards -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, index) in stats" :key="index" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900">{{ stat.value }}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-5 py-3">
            <div class="text-sm">
              <a :href="stat.href" class="font-medium text-primary hover:text-primary-dark">
                View all
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts section -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent activity -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div class="p-4 max-h-96 overflow-y-auto">
            <ul class="divide-y divide-gray-200">
              <li v-for="(activity, index) in recentActivities" :key="index" class="py-4">
                <div class="flex space-x-3">
                  <div class="flex-shrink-0">
                    <span 
                      class="inline-flex items-center justify-center h-10 w-10 rounded-full"
                      :class="getActivityIconClass(activity.type)"
                    >
                      <component :is="getActivityIcon(activity.type)" class="h-5 w-5" />
                    </span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-sm text-gray-500">{{ activity.description }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Upcoming rides -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Upcoming Rides</h3>
          </div>
          <div class="p-4 max-h-96 overflow-y-auto">
            <ul class="divide-y divide-gray-200">
              <li v-for="(ride, index) in upcomingRides" :key="index" class="py-4">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img 
                      :src="ride.driverAvatar || '/placeholder.svg?height=40&width=40'" 
                      alt="Driver avatar" 
                      class="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">
                      {{ ride.driverName }} → {{ ride.passengerCount }} passenger(s)
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ ride.from }} to {{ ride.to }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">{{ ride.time }}</p>
                  </div>
                  <div>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': ride.status === 'confirmed',
                        'bg-yellow-100 text-yellow-800': ride.status === 'pending',
                        'bg-red-100 text-red-800': ride.status === 'cancelled'
                      }"
                    >
                      {{ ride.status }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import avatar from '@/assets/icons/avatar.svg'
  import { ref } from 'vue'
  
  // Mock data for stats
  const stats = ref([
    {
      name: 'Total Drivers',
      value: '245',
      icon: 'svg-icon-drivers',
      href: '/dashboard/drivers'
    },
    {
      name: 'Total Passengers',
      value: '1,892',
      icon: 'svg-icon-passengers',
      href: '/dashboard/passengers'
    },
    {
      name: 'Rides Today',
      value: '38',
      icon: 'svg-icon-rides',
      href: '#'
    },
    {
      name: 'Package Deliveries',
      value: '24',
      icon: 'svg-icon-packages',
      href: '/dashboard/package-delivery'
    }
  ])
  
  // Mock data for recent activities
  const recentActivities = ref([
    {
      type: 'driver',
      title: 'New Driver Registration',
      description: 'John Doe has registered as a new driver',
      time: '10 minutes ago'
    },
    {
      type: 'passenger',
      title: 'New Passenger',
      description: 'Jane Smith has created a passenger account',
      time: '25 minutes ago'
    },
    {
      type: 'ride',
      title: 'Ride Completed',
      description: 'Ride #12345 has been completed successfully',
      time: '1 hour ago'
    },
    {
      type: 'package',
      title: 'Package Delivered',
      description: 'Package #54321 has been delivered to the recipient',
      time: '2 hours ago'
    },
    {
      type: 'complaint',
      title: 'New Complaint',
      description: 'A passenger has reported an issue with their ride',
      time: '3 hours ago'
    }
  ])
  
  // Mock data for upcoming rides
  const upcomingRides = ref([
    {
      driverName: 'John Doe',
      driverAvatar: avatar,
      passengerCount: 3,
      from: 'Downtown',
      to: 'Airport',
      time: 'Today, 2:30 PM',
      status: 'confirmed'
    },
    {
      driverName: 'Jane Smith',
      driverAvatar: avatar,
      passengerCount: 2,
      from: 'University',
      to: 'Shopping Mall',
      time: 'Today, 4:15 PM',
      status: 'pending'
    },
    {
      driverName: 'Robert Johnson',
      driverAvatar: avatar,
      passengerCount: 1,
      from: 'Residential Area',
      to: 'Business District',
      time: 'Tomorrow, 8:00 AM',
      status: 'confirmed'
    },
    {
      driverName: 'Emily Davis',
      driverAvatar: avatar,
      passengerCount: 4,
      from: 'Suburbs',
      to: 'City Center',
      time: 'Tomorrow, 9:30 AM',
      status: 'confirmed'
    },
    {
      driverName: 'Michael Wilson',
      driverAvatar: avatar,
      passengerCount: 2,
      from: 'Train Station',
      to: 'Conference Center',
      time: 'Tomorrow, 11:45 AM',
      status: 'cancelled'
    }
  ])
  
  // Helper functions for activity icons
  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      driver: 'svg-icon-driver',
      passenger: 'svg-icon-passenger',
      ride: 'svg-icon-ride',
      package: 'svg-icon-package',
      complaint: 'svg-icon-complaint'
    }
    
    return icons[type] || 'svg-icon-default'
  }
  
  const getActivityIconClass = (type: string) => {
    const classes: Record<string, string> = {
      driver: 'bg-primary-light text-white',
      passenger: 'bg-blue-100 text-blue-600',
      ride: 'bg-green-100 text-green-600',
      package: 'bg-purple-100 text-purple-600',
      complaint: 'bg-red-100 text-red-600'
    }
    
    return classes[type] || 'bg-gray-100 text-gray-600'
  }

  definePageMeta({
      layout: 'dashboard'
  })
  </script>
  
  <script lang="ts">
  // SVG icons components
  export default {
    components: {
      'svg-icon-drivers': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        `
      },
      'svg-icon-passengers': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        `
      },
      'svg-icon-rides': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        `
      },
      'svg-icon-packages': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        `
      },
      'svg-icon-driver': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        `
      },
      'svg-icon-passenger': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        `
      },
      'svg-icon-ride': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        `
      },
      'svg-icon-package': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        `
      },
      'svg-icon-complaint': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        `
      },
      'svg-icon-default': {
        template: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `
      }
    }
  }
  </script>