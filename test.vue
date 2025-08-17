<template>
    <div>
      <!-- Mobile Overlay -->
      <Transition
        enter-active-class="transition-opacity ease-linear duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-linear duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMobileOpen" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-gray-900/80" aria-hidden="true" @click="closeMobile"></div>
          
          <div class="fixed inset-0 flex">
            <Transition
              enter-active-class="transition ease-in-out duration-300 transform"
              enter-from-class="-translate-x-full"
              enter-to-class="translate-x-0"
              leave-active-class="transition ease-in-out duration-300 transform"
              leave-from-class="translate-x-0"
              leave-to-class="-translate-x-full"
            >
              <div v-if="isMobileOpen" class="relative mr-16 flex w-full max-w-xs flex-1">
                <!-- Close Button -->
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button @click="closeMobile" type="button" class="-m-2.5 p-2.5">
                    <span class="sr-only">Close sidebar</span>
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
  
                <!-- Mobile Sidebar Content -->
                <div class="flex grow flex-col gap-y-5 bg-[#FFFFFF] px-6 pb-4 relative overflow-hidden">
                  <!-- Logo Section -->
                  <div class="flex h-16 shrink-0 items-center">
                    <img class="h-8 w-auto" src="@/assets/img/logo.png" alt="Your Company">
                  </div>
  
                  <div class="flex-1 relative overflow-hidden">
                    <Transition
                      :name="transitionName"
                      mode="out-in"
                      @enter="onEnter"
                      @leave="onLeave"
                    >
                      <nav :key="currentLevel" class="flex flex-1 flex-col h-full overflow-hidden">
                        <!-- Back Button for Children Levels -->
                        <div v-if="currentLevel !== 'main'" class="mb-4 shrink-0">
                          <button
                            @click="handleBackClick"
                            class="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-[#687181]  hover:text-gray-900 transition-all duration-300 w-full group transform hover:translate-x-1"
                          >
                            <svg class="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            <span class="transition-all duration-300">Back to Main</span>
                          </button>
                        </div>
  
                        <!-- Level Title -->
                        <div v-if="currentLevel !== 'main'" class="mb-4 shrink-0">
                          <h3 class="text-lg font-semibold text-gray-900 capitalize transition-all duration-300 transform hover:scale-105">
                            {{ currentLevel }} Menu
                          </h3>
                        </div>
  
                        <!-- Scrollable Content Area -->
                        <div class="flex-1 overflow-y-auto overflow-x-hidden">
                          <ul role="list" class="flex flex-col gap-y-7 pr-2">
                            <!-- Main Items -->
                            <li class="animate-fadeInUp" :style="{ animationDelay: '0.1s' }">
                              <ul role="list" class="-mx-2 space-y-1">
                                <li 
                                  v-for="(item, idx) in currentSidebarItems.main" 
                                  :key="`${currentLevel}-main-${idx}`"
                                  class="animate-slideInLeft"
                                  :style="{ animationDelay: `${0.1 + idx * 0.05}s` }"
                                >
                                  <component
                                    :is="item.url && !item.children ? 'NuxtLink' : 'button'"
                                    :to="item.url && !item.children ? item.url : undefined"
                                    @click="handleItemClick(item)"
                                    class="group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-[#687181]  hover:text-gray-900 transition-all duration-300 w-full text-left transform hover:scale-[1.02] hover:shadow-sm border relative overflow-hidden"
                                    :class="{ 
                                      'cursor-pointer': item.children || item.action,
                                      'before:absolute before:left-0 before:top-0 before:rounded-full hover:rounded-full before:h-full before:w-1 before:bg-gradient-to-b before:from-[#274C77] before:to-blue-600 before:transform before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100': true,
                                      'active-item': isActiveRoute(item.url)
                                    }"
                                  >
                                    <img
                                      :src="dynamicIcons(item.icon)"
                                      :alt="item.name"
                                      class="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0"
                                      :class="{ 'filter-white': isActiveRoute(item.url) }"
                                    />
                                    <span class="flex justify-between items-center w-full min-w-0">
                                      <span class="truncate">{{ item.name }}</span>
                                      <svg 
                                        v-if="item.children && item.children.length > 0"
                                        class="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 shrink-0 ml-2"
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke-width="1.5" 
                                        stroke="currentColor"
                                      >
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                      </svg>
                                    </span>
                                  </component>
                                </li>
                              </ul>
                            </li>
  
                            <!-- Config Items -->
                            <li 
                              v-if="currentSidebarItems.config.length > 0" 
                              class="animate-fadeInUp" 
                              :style="{ animationDelay: `${0.2 + currentSidebarItems.main.length * 0.05}s` }"
                            >
                              <div class="relative mb-4">
                                <div class="absolute inset-0 flex items-center">
                                  <div class="w-full border-t border-gray-200"></div>
                                </div>
                                <div class="relative flex justify-center">
                                  <span class="bg-white px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Settings</span>
                                </div>
                              </div>
                              <ul role="list" class="mx-2 space-y-3">
                                <li 
                                  v-for="(item, idx) in currentSidebarItems.config" 
                                  :key="`${currentLevel}-config-${idx}`"
                                   class="animate-slideInLeft cursor-pointer"
                                  :style="{ animationDelay: `${0.1 + idx * 0.05}s` }"
                                >
                                  <component
                                    :is="item.url ? 'NuxtLink' : 'button'"
                                    :to="item.url"
                                    @click="handleItemClick(item)" 
                                    class="group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-[#687181] hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 hover:text-gray-900 transition-all duration-300 w-full text-left transform hover:scale-[1.02] hover:shadow-sm border border-transparent hover:border-orange-100 relative overflow-hidden"
                                    :class="{ 'active-item': isActiveRoute(item.url) }"
                                  >
                                    <img
                                      :src="dynamicIcons(item.icon)"
                                      :alt="item.name"
                                     class="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0"
                                      :class="{ 'filter-white': isActiveRoute(item.url) }"
                                    />
                                    <span class="truncate">{{ item.name }}</span>
                                  </component>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </nav>
                    </Transition>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
  
      <!-- Desktop Sidebar -->
      <div class="hidden lg:fixed lg:inset-y-0 border-r bg-white lg:z-50 lg:flex lg:w-64 lg:flex-col overflow-hidden">
        <div class="flex grow flex-col gap-y-5 bg-[#FFFFFF] px-3 pb-4 relative overflow-hidden">
          <!-- Logo Section -->
          <div class="flex h-16 shrink-0 items-center">
            <img class="h-8 w-auto" src="@/assets/img/logo.png" alt="Your Company">
          </div>
  
          <div class="flex-1 relative overflow-hidden">
            <Transition
              :name="transitionName"
              mode="out-in"
              @enter="onEnter"
              @leave="onLeave"
            >
              <nav :key="currentLevel" class="flex flex-1 flex-col h-full overflow-hidden">
                <!-- Back Button for Children Levels -->
                <div v-if="currentLevel !== 'main'" class="mb-4 shrink-0">
                  <button
                    @click="handleBackClick"
                    class="flex items-center gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-[#687181] hover:text-gray-900 transition-all duration-300 w-full group transform hover:translate-x-1"
                  >
                    <svg class="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span class="transition-all duration-300">Back to Main</span>
                  </button>
                </div>
  
                <!-- Level Title -->
                <div v-if="currentLevel !== 'main'" class="mb-4 shrink-0">
                  <h3 class="text-lg font-semibold text-gray-900 capitalize transition-all duration-300 transform hover:scale-105">
                    {{ currentLevel }} Menu
                  </h3>
                </div>
  
                <!-- Scrollable Content Area -->
                <div class="flex-1 overflow-y-auto overflow-x-hidden">
                  <ul role="list" class="flex flex-col gap-y-7 pr-2">
                    <!-- Main Items -->
                    <li class="animate-fadeInUp" :style="{ animationDelay: '0.1s' }">
                      <ul role="list" class="mx-2 space-y-3">
                        <li 
                          v-for="(item, idx) in currentSidebarItems.main" 
                          :key="`${currentLevel}-main-${idx}`"
                          class="animate-slideInLeft cursor-pointer"
                          :style="{ animationDelay: `${0.1 + idx * 0.05}s` }"
                        >
                          <component
                            :is="item.url && !item.children ? 'NuxtLink' : 'button'"
                            :to="item.url && !item.children ? item.url : undefined"
                            @click="handleItemClick(item)"
                            class="group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 text-[#687181]  hover:text-gray-900 transition-all duration-300 w-full text-left transform hover:scale-[1.02] hover:shadow-sm relative overflow-hidden"
                            :class="{ 
                              'cursor-pointer': item.children || item.action,
                              'before:absolute before:left-0 before:top-0 hover:rounded-full before:rounded-full before:h-full before:w-1 before:bg-gradient-to-b before:from-[#274C77] before:to-blue-600 before:transform before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100': true,
                              'active-item': isActiveRoute(item.url)
                            }"
                          >
                            <img
                              :src="dynamicIcons(item.icon)"
                              :alt="item.name"
                              class="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0"
                              :class="{ 'filter-white': isActiveRoute(item.url) }"
                            />
                            <span class="flex justify-between items-center w-full min-w-0">
                              <span class="truncate">{{ item.name }}</span>
                              <svg 
                                v-if="item.children && item.children.length > 0"
                                class="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 shrink-0 ml-2"
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke-width="1.5" 
                                stroke="currentColor"
                              >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            </span>
                          </component>
                        </li>
                      </ul>
                    </li>
  
                    <!-- Config Items -->
                    <li 
                      v-if="currentSidebarItems.config.length > 0" 
                      class="animate-fadeInUp" 
                      :style="{ animationDelay: `${0.2 + currentSidebarItems.main.length * 0.05}s` }"
                    >
                      <div class="relative mb-4">
                        <div class="absolute inset-0 flex items-center">
                          <div class="w-full border-t border-gray-200"></div>
                        </div>
                        <div class="relative flex justify-center">
                          <span class="bg-white px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Settings</span>
                        </div>
                      </div>
                      <ul role="list" class="mx-2 space-y-3">
                        <li 
                          v-for="(item, idx) in currentSidebarItems.config" 
                          :key="`${currentLevel}-config-${idx}`"
                          class="animate-slideInLeft cursor-pointer"
                          :style="{ animationDelay: `${0.3 + currentSidebarItems.main.length * 0.05 + idx * 0.05}s` }"
                        >
                          <component
                            :is="item.url ? 'NuxtLink' : 'button'"
                            :to="item.url"
                            @click="handleItemClick(item)"
                            class="group flex gap-x-3 rounded-full hover:rounded-full p-3 text-sm font-medium leading-6 text-[#687181] hover:text-gray-900 transition-all duration-300 w-full text-left transform hover:scale-[1.02] hover:shadow-sm relative overflow-hidden"
                            :class="{ 'active-item': isActiveRoute(item.url) }"
                          >
                            <img
                              :src="dynamicIcons(item.icon)"
                              :alt="item.name"
                              class="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 shrink-0"
                              :class="{ 'filter-white': isActiveRoute(item.url) }"
                            />
                            <span class="truncate">{{ item.name }}</span>
                          </component>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </nav>
            </Transition>
          </div>
        </div>
      </div>
  
      <!-- Main Content Area -->
      <div class="lg:pl-64">
        <!-- Mobile Header -->
      <header class="bg-white hidden lg:block border-b border-gray-50 px-4 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search"
              class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#274C77] focus:border-transparent"
            />
            <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div class="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
  
          <div class="ml-4">
            <!-- <img
              src="@/assets/img/avatar.png"
              alt="User Avatar"
              class="w-12 h-12 rounded-full object-cover"
            /> -->
            <!-- {{ profileInfoObj }} -->
            <img
              v-if="displayAvatar"
              :src="displayAvatar"
              :alt="`${profileInfoObj.profile.firstName} ${profileInfoObj.profile.lastName}`"
               class="w-12 h-12 rounded-full object-cover"
            />
            <!-- User initials fallback -->
            <div v-else class="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <span class="text-2xl font-light text-white">
                {{ userInitials }}
              </span>
            </div>
          </div>
        </div>
      </header>
        <div class="sticky lg:hidden top-0 z-40 flex shrink-0 justify-between items-center gap-x-4 border-gray-200 bg-[#FFFFFF] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div class="flex h-16 shrink-0 items-center">
            <img class="h-7 w-auto" src="@/assets/img/logo.png" alt="Your Company">
          </div>
          <button @click="openMobile" type="button" class="p-2.5 text-gray-700 lg:hidden">
            <span class="sr-only">Open sidebar</span>
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
  
        <!-- Page Content -->
        <main class="">
          <div class="">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import { useRoute, navigateTo } from '#app'
  import { useFetchStats } from "@/composables/modules/dashboard/fetchStats"
  
  interface SidebarItem {
    name: string
    icon: string
    url?: string
    children?: SidebarItem[]
    action?: () => void
  }
  
  const route = useRoute()
  const isMobileOpen = ref(false)
  const currentLevel = ref<string>('main')
  const transitionDirection = ref<'forward' | 'backward'>('forward')
  const { loading, profileInfoObj } = useFetchStats()
  
  // Sidebar items data
  const mainSidebarItems = ref<SidebarItem[]>([
    {
      name: "Home",
      icon: "home",
      url: "/dashboard",
    },
    {
      name: "Invest",
      icon: "invest",
      url: "/dashboard/investments",
    },
    {
      name:  "Learning",
      icon: "learn",
      url: "/dashboard/course-mgt",
    },
    {
      name: "Payments",
      icon: "payments",
      url: "/dashboard/payments",
    },
    {
      name: "Accounts",
      icon: "accounts",
      url: "/dashboard/account",
    },
  ])
  
  const configSidebarItems = ref<SidebarItem[]>([
    {
      name: "Support",
      icon: "support",
      url: "/dashboard/support",
    },
    {
      name: "Logout",
      icon: "logout",
      action: () => {
        // Add your logout logic here
        console.log('Logout clicked')
      },
    }
  ])
  
  const transitionName = computed(() => {
    return transitionDirection.value === 'forward' ? 'slide-left' : 'slide-right'
  })
  
  const currentSidebarItems = computed(() => {
    if (currentLevel.value === 'main') {
      return {
        main: mainSidebarItems.value,
        config: configSidebarItems.value
      }
    }
    
    // Find the parent item and return its children
    const parentItem = mainSidebarItems.value.find(item => 
      item.name.toLowerCase() === currentLevel.value.toLowerCase()
    )
    
    return {
      main: parentItem?.children || [],
      config: []
    }
  })
  
  const openMobile = () => {
    isMobileOpen.value = true
  }
  
  const closeMobile = () => {
    isMobileOpen.value = false
  }
  
  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      transitionDirection.value = 'forward'
      currentLevel.value = item.name.toLowerCase()
    } else if (item.url) {
      navigateTo(item.url)
      closeMobile()
    } else if (item.action) {
      item.action()
      closeMobile()
    }
  }
  
  const handleBackClick = () => {
    transitionDirection.value = 'backward'
    currentLevel.value = 'main'
  }
  
  // Dynamic icon helper
  const dynamicIcons = (iconName: string) => {
    try {
      return new URL(`/assets/icons/${iconName}.svg`, import.meta.url).href
    } catch {
      return `/assets/icons/${iconName}.svg`
    }
  }
  
  // Check if current route matches item URL
  const isActiveRoute = (itemUrl?: string) => {
    if (!itemUrl) return false
    return route.path === itemUrl || route.path.startsWith(itemUrl + '/')
  }
  
  const onEnter = async (el: Element) => {
    await nextTick()
    const items = el.querySelectorAll('.animate-slideInLeft, .animate-fadeInUp')
    items.forEach((item, index) => {
      const element = item as HTMLElement
      element.style.animationDelay = `${index * 0.05}s`
      element.classList.add('animation-running')
    })
  }
  
  const onLeave = (el: Element) => {
    // Optional leave animations
  }
  
  // Watch for back navigation
  watch(() => currentLevel.value, (newLevel, oldLevel) => {
    if (newLevel === 'main' && oldLevel !== 'main') {
      transitionDirection.value = 'backward'
    }
  })
  
  // Form data reactive object
  const formData = ref({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bvn: '',
    nin: '',
    userReferralCode: '',
    avatar: ''
  })
  
  // Computed properties
  const displayAvatar = computed(() => {
    return formData.value.avatar || profileInfoObj.value?.profile?.avatar || null
  })
  
  const userInitials = computed(() => {
    if (!profileInfoObj.value?.profile) return 'U'
    
    const firstName = profileInfoObj.value.profile.firstName || ''
    const lastName = profileInfoObj.value.profile.lastName || ''
    
    const firstInitial = firstName.charAt(0).toUpperCase()
    const lastInitial = lastName.charAt(0).toUpperCase()
    
    return firstInitial + lastInitial || 'U'
  })
  
  
  // Watch for profile data changes and populate form
  watch(
    () => profileInfoObj.value?.profile,
    (newProfile) => {
      if (newProfile) {
        formData.value = {
          fullName: `${newProfile.firstName || ''} ${newProfile.lastName || ''}`.trim(),
          email: newProfile.email || '',
          phoneNumber: newProfile.phoneNumber || '',
          dateOfBirth: newProfile.dateOfBirth || '',
          gender: newProfile.gender || '',
          bvn: newProfile.bvn || '',
          nin: newProfile.nin || '',
          userReferralCode: newProfile.referralCode || '',
          avatar: newProfile.avatar || ''
        }
      }
    },
    { immediate: true }
  )
  
  
  </script>
  
  <style scoped>
  /* Slide Left Animation (Forward) */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .slide-left-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  
  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
  
  /* Slide Right Animation (Backward) */
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .slide-right-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  
  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  
  /* Custom animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.4s ease-out forwards;
    opacity: 0;
  }
  
  /* Active state styles with #274C77 */
  .active-item {
    background-color: #274C77 !important;
    color: white !important;
    border-color: #274C77 !important;
    box-shadow: 0 4px 6px -1px rgba(39, 76, 119, 0.2) !important;
    transform: scale(1.02);
    border-radius: 9999px !important; /* Fully rounded */
  }
  
  .active-item::before {
    transform: scaleY(1);
    background: linear-gradient(to bottom, #274C77, #1e3a5f);
  }
  
  .filter-white {
    filter: brightness(0.2) invert(0.9) opacity(0.9);
    transform: scale(1.1) rotate(3deg);
  }
  /* Nuxt Link active states */
  .router-link-exact-active,
  .nuxt-link-exact-active {
    background-color: #274C77 !important;
    color: white !important;
    border-color: #274C77 !important;
    box-shadow: 0 4px 6px -1px rgba(39, 76, 119, 0.2) !important;
    transform: scale(1.02);
    border-radius: 9999px !important; /* Fully rounded */
  }
  
  
  .router-link-exact-active::before,
  .nuxt-link-exact-active::before {
    transform: scaleY(1);
    background: linear-gradient(to bottom, #274C77, #1e3a5f);
  }
  
  .router-link-exact-active img,
  .nuxt-link-exact-active img {
    filter: brightness(0) invert(1);
    transform: scale(1.1) rotate(3deg);
  }
  
  /* Custom scrollbar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  
  .group:hover {
    background-color: #E8F0FE !important; /* Light blue shade of #274C77 */
    color: #274C77 !important;
    border-color: #B8D4F0 !important;
  }
  
  /* Custom scrollbar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  /* Focus states for accessibility */
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #274C77;
    outline-offset: 2px;
    border-radius: 8px;
  }
  
  /* Prevent text selection on interactive elements */
  button, .cursor-pointer {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  /* Smooth transitions for all interactive elements */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Mobile responsiveness */
  @media (max-width: 1023px) {
    .sidebar-content {
      height: 100vh;
    }
  }
  </style>



