<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>
    
    <!-- Sidebar Container -->
    <aside 
      class="fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transform transition-all duration-500 ease-in-out lg:translate-x-0 overflow-hidden"
      :class="{ '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
    >
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>

      <!-- Logo Section -->
      <div class="relative flex items-center justify-between h-16 px-4 border-b border-slate-700/50 backdrop-blur-sm">
        <div class="flex items-center">
          <!-- <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">CM</span>
          </div>
          <span class="ml-2 text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CoMiles
          </span> -->
          <img src="@/assets/img/logo-white.png" class="h-7 w-auto" />
        </div>
        <button 
          class="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-slate-700/50"
          @click="isSidebarOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Navigation Container -->
      <div class="relative h-full overflow-hidden">
        <!-- Main Navigation Layer -->
        <div 
          class="absolute inset-0 transition-all duration-700 ease-in-out transform"
          :class="{
            'translate-x-0 opacity-100': currentLayer === 'main',
            '-translate-x-full opacity-0': currentLayer !== 'main'
          }"
        >
          <nav class="mt-5 px-2 pb-20">
            <div class="space-y-2">
              <!-- Dashboard -->
              <NuxtLink 
                to="/dashboard" 
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard')"
                @click="handleNavClick('/dashboard')"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span class="flex-1">Dashboard Management</span>
                <div class="w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NuxtLink>

              <NuxtLink 
                to="/dashboard/documents" 
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/documents')"
                @click="handleNavClick('/dashboard/documents')"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 group-hover:from-blue-500/30 group-hover:to-blue-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span class="flex-1">Documents Management</span>
                <div class="w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NuxtLink>
              
              <!-- Section Header -->
              <div class="mt-6 mb-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                User Management
              </div>
              
              <!-- Drivers -->
              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/drivers')"
                @click="handleNavClick('/dashboard/drivers', navigationItems.find(item => item.path === '/dashboard/drivers'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Drivers Management</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/drivers')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Customer Support -->
              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/customer-support')"
                @click="handleNavClick('/dashboard/customer-support', navigationItems.find(item => item.path === '/dashboard/customer-support'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Customer Support Management</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/customer-support')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Transactions -->
              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/transactions')"
                @click="handleNavClick('/dashboard/transactions', navigationItems.find(item => item.path === '/dashboard/transactions'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Transactions Management</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/transactions')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <!-- Passengers -->
              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/passengers')"
                @click="handleNavClick('/dashboard/passengers', navigationItems.find(item => item.path === '/dashboard/passengers'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 group-hover:from-indigo-500/30 group-hover:to-indigo-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Passengers Management</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/passengers')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <!-- Package Delivery -->
              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/package-delivery')"
                @click="handleNavClick('/dashboard/package-delivery', navigationItems.find(item => item.path === '/dashboard/package-delivery'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/20 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.707.293h-3.172a1 1 0 00-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Package Delivery Management</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/package-delivery')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Trips -->
              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/trips')"
                @click="handleNavClick('/dashboard/trips', navigationItems.find(item => item.path === '/dashboard/trips'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Trips Management</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/trips')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/promo-code')"
                @click="handleNavClick('/dashboard/promo-code', navigationItems.find(item => item.path === '/dashboard/promo-code'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Promo Code</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/promo-code')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                class="w-full group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass('/dashboard/referrals')"
                @click="handleNavClick('/dashboard/referrals', navigationItems.find(item => item.path === '/dashboard/referrals'))"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-red-600/20 group-hover:from-red-500/30 group-hover:to-red-600/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span class="flex-1 text-left">Referral Code</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  v-if="navigationItems.find(item => item.path === '/dashboard/promo-code')?.children"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        <!-- Child Navigation Layer -->
        <div 
          class="absolute inset-0 transition-all duration-700 ease-in-out transform"
          :class="{
            'translate-x-0 opacity-100': currentLayer === 'child',
            'translate-x-full opacity-0': currentLayer !== 'child'
          }"
        >
          <div class="p-4 border-b border-slate-700/50 backdrop-blur-sm">
            <button 
              @click="goBackToMain"
              class="flex items-center text-slate-300 hover:text-white transition-colors duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="text-sm font-medium">Back to Main</span>
            </button>
            <h3 class="mt-2 text-lg font-semibold text-white">{{ currentParent?.title }}</h3>
          </div>
          
          <nav class="mt-5 px-2 pb-20" v-if="currentParent">
            <div class="space-y-2">
              <NuxtLink
                v-for="child in currentParent.children"
                :key="child.path"
                :to="child.path"
                class="group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 transform"
                :class="getNavItemClass(child.path)"
                @click="handleChildNavClick(child.path)"
              >
                <div class="mr-3 p-2 rounded-lg bg-gradient-to-r from-slate-600/20 to-slate-700/20 group-hover:from-slate-600/30 group-hover:to-slate-700/30 transition-all duration-300">
                  <component :is="child.icon" class="h-5 w-5" />
                </div>
                <span class="flex-1">{{ child.title }}</span>
                <div class="w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
      
      <!-- User Profile Section -->
      <div class="absolute bottom-0 w-full border-t border-slate-700/50 p-4 backdrop-blur-sm bg-slate-900/50">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-sm">{{ getUserInitials() }}</span>
          </div>
          <div class="ml-3 flex-1">
            <!-- {{user}} -->
            <p class="text-sm font-medium text-white">{{ user?.name || 'Admin User' }}</p>
            <button 
              @click="showLogoutModal = true" 
              class="text-xs text-slate-300 flex items-center mt-1 hover:text-white transition-colors duration-200 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="lg:pl-64 transition-all duration-300">
      <!-- Top navigation -->
      <header class="bg-white shadow-sm z-10 backdrop-blur-sm bg-white/95">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <button 
            class="p-2 rounded-lg text-gray-500 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-100 transition-all duration-200"
            @click="isSidebarOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Breadcrumb -->
          <div class="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center">
              <span v-if="index > 0" class="mx-2 text-gray-400">/</span>
              <span :class="{ 'text-blue-600 font-medium': index === breadcrumbs.length - 1 }">
                {{ crumb }}
              </span>
            </span>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button 
                @click="isNotificationsOpen = !isNotificationsOpen" 
                class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              </button>
              
              <!-- Notifications Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div 
                  v-if="isNotificationsOpen" 
                  class="absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div class="py-1">
                    <div class="px-4 py-3 border-b border-gray-200">
                      <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div class="max-h-60 overflow-y-auto">
                      <div v-if="notifications.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                        No new notifications
                      </div>
                      <a 
                        v-for="notification in notifications" 
                        :key="notification.id" 
                        href="#" 
                        class="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div class="flex items-start">
                          <div class="flex-shrink-0 mt-1">
                            <span 
                              class="inline-block h-2 w-2 rounded-full"
                              :class="{
                                'bg-blue-500': notification.type === 'info',
                                'bg-green-500': notification.type === 'success',
                                'bg-yellow-500': notification.type === 'warning',
                                'bg-red-500': notification.type === 'danger'
                              }"
                            ></span>
                          </div>
                          <div class="ml-3 w-0 flex-1">
                            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                            <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                            <p class="mt-1 text-xs text-gray-400">{{ notification.time }}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-2">
                      <a href="#" class="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150">
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main content area -->
      <main class="py-6 px-4 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>

    <!-- Logout confirmation modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showLogoutModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" @click="showLogoutModal = false"></div>
        
        <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div v-if="showLogoutModal" class="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Confirm Logout
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to logout? You will need to sign in again to access your account.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  @click="confirmLogout"
                >
                  Logout
                </button>
                <button 
                  type="button" 
                  class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
                  @click="showLogoutModal = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Types
interface NavigationChild {
  title: string
  path: string
  icon: any
}

interface NavigationItem {
  title: string
  path: string
  icon?: any
  children?: NavigationChild[]
}

// Composables
const route = useRoute()
const router = useRouter()

// Reactive state
const isSidebarOpen = ref(false)
const isNotificationsOpen = ref(false)
const showLogoutModal = ref(false)
const currentLayer = ref<'main' | 'child'>('main')
const currentParent = ref<NavigationItem | null>(null)

// Mock user data
const user = ref({ name: 'Admin User' })

// Navigation structure with children
const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard Management',
    path: '/dashboard',
  },
  // {
  //   title: 'Documents mgt',
  //   path: '/dashboard/documents',
  // },
  {
    title: 'Marketing Management',
    path: '/dashboard/marketing/promocode',
    children: [
      {
        title: 'PromoCode Management',
        path: '/dashboard/marketing/promocode',
        icon: 'svg'
      },
      {
        title: 'Referral Codes Management',
        path: '/dashboard/marketing/referrals',
        icon: 'svg'
      }
    ]
  },
  {
    title: 'Drivers Management',
    path: '/dashboard/drivers',
    children: [
      {
        title: 'All Drivers',
        path: '/dashboard/drivers',
        icon: 'svg'
      },
      // {
      //   title: 'Driver Applications',
      //   path: '/dashboard/drivers/applications',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Driver Verification',
      //   path: '/dashboard/drivers/verification',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Driver Performance',
      //   path: '/dashboard/drivers/performance',
      //   icon: 'svg'
      // }
    ]
  },
  {
    title: 'Customer Support Management',
    path: '/dashboard/customer-support',
    children: [
      {
        title: 'Support Tickets',
        path: '/dashboard/customer-support',
        icon: 'svg'
      },
      // {
      //   title: 'Live Chat',
      //   path: '/dashboard/customer-support/chat',
      //   icon: 'svg'
      // },
      // {
      //   title: 'FAQ Management',
      //   path: '/dashboard/customer-support/faq',
      //   icon: 'svg'
      // }
    ]
  },
  {
    title: 'Transactions Management',
    path: '/dashboard/transactions',
    children: [
      {
        title: 'All Transactions',
        path: '/dashboard/transactions',
        icon: 'svg'
      },
      // {
      //   title: 'Payment Methods',
      //   path: '/dashboard/transactions/payment-methods',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Refunds',
      //   path: '/dashboard/transactions/refunds',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Financial Reports',
      //   path: '/dashboard/transactions/reports',
      //   icon: 'svg'
      // }
    ]
  },
  {
    title: 'Passengers Management',
    path: '/dashboard/passengers',
    children: [
      {
        title: 'All Passengers',
        path: '/dashboard/passengers',
        icon: 'svg'
      },
      // {
      //   title: 'Passenger Feedback',
      //   path: '/dashboard/passengers/feedback',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Loyalty Program',
      //   path: '/dashboard/passengers/loyalty',
      //   icon: 'svg'
      // }
    ]
  },
  {
    title: 'Package Delivery Management',
    path: '/dashboard/package-delivery',
    children: [
      {
        title: 'All Deliveries',
        path: '/dashboard/package-delivery',
        icon: 'svg'
      },
      // {
      //   title: 'Delivery Tracking',
      //   path: '/dashboard/package-delivery/tracking',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Delivery Reports',
      //   path: '/dashboard/package-delivery/reports',
      //   icon: 'svg'
      // }
    ]
  },
  {
    title: 'Trips Management',
    path: '/dashboard/trips',
    children: [
      {
        title: 'All Trips',
        path: '/dashboard/trips',
        icon: 'svg'
      },
      {
        title: 'Trip Offers',
        path: '/dashboard/trips/offers',
        icon: 'svg'
      },
      // {
      //   title: 'Trip Analytics',
      //   path: '/dashboard/trips/analytics',
      //   icon: 'svg'
      // },
      // {
      //   title: 'Route Optimization',
      //   path: '/dashboard/trips/routes',
      //   icon: 'svg'
      // }
    ]
  },
  {
    title: 'Documents Management',
    path: '/dashboard/documents',
    children: [
      {
        title: 'All Documents',
        path: '/dashboard/documents',
        icon: 'svg'
      }
    ]
  },
]

// Mock notifications
const notifications = ref([
  {
    id: 1,
    type: 'info',
    title: 'New driver application',
    message: 'John Doe has applied to become a driver',
    time: '5 minutes ago'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Passenger complaint',
    message: 'Jane Smith has reported an issue with their ride',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'success',
    title: 'Package delivered',
    message: 'Package #12345 has been successfully delivered',
    time: '3 hours ago'
  }
])

// Computed properties
const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment)
  const crumbs = ['Dashboard']
  
  if (pathSegments.length > 1) {
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      const formatted = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      crumbs.push(formatted)
    }
  }
  
  return crumbs
})

// Methods
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const getNavItemClass = (path: string) => {
  const isCurrentlyActive = isActive(path)
  return {
    'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-500/20': isCurrentlyActive,
    'text-slate-300 hover:text-white hover:bg-slate-700/50': !isCurrentlyActive
  }
}

const handleNavClick = (path: string, item?: NavigationItem) => {
  if (item?.children && item.children.length > 0) {
    // Show children navigation
    currentParent.value = item
    currentLayer.value = 'child'
  } else {
    // Navigate directly
    router.push(path)
    isSidebarOpen.value = false
  }
}

const handleChildNavClick = (path: string) => {
  router.push(path)
  isSidebarOpen.value = false
}

const goBackToMain = () => {
  currentLayer.value = 'main'
  currentParent.value = null
}

const getUserInitials = () => {
  const name = user.value?.name || 'Admin User'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const confirmLogout = async () => {
  // Add logout logic here
  showLogoutModal.value = false
  router.push('/login')
}

// Watch for route changes to update active states
watch(() => route.path, () => {
  // Auto-close mobile sidebar on navigation
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
  
  // Reset to main layer if navigating to a different section
  if (currentLayer.value === 'child') {
    const currentPath = route.path
    const parentPath = currentParent.value?.path
    
    if (parentPath && !currentPath.startsWith(parentPath)) {
      currentLayer.value = 'main'
      currentParent.value = null
    }
  }
})

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.notifications-dropdown')) {
      isNotificationsOpen.value = false
    }
  })
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Smooth animations */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient text animation */
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
</style>