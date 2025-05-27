<template>
    <div class="min-h-screen flex items-center justify-center bg-primary p-4">
      <div class="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="text-center mb-8">
            <img src="@/assets/img/logo.png" alt="CoMiles Logo" class="h-12 mx-auto mb-4" />
            <h1 class="text-2xl font-bold text-primary">Admin</h1>
            <p class="text-gray-600 mt-1">Sign in to your account</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                id="email" 
                v-model="email" 
                type="email" 
                required 
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin@comiles.com"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                id="password" 
                v-model="password" 
                type="password" 
                required 
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            
            <!-- <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="#" class="text-sm font-medium text-primary hover:text-primary">Forgot password?</a>
            </div> -->
            
   <div class="pt-6">
    <button 
              type="submit" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
   </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAdminLogin } from '@/composables/auth/useAdminLogin'
  
  const router = useRouter()
  const { loginAdmin } = useAdminLogin()
  
  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)
  
  const handleLogin = async () => {
    isLoading.value = true
    try {
      const payloadObj = {
        email: email.value,
        password: password.value
      }
      await loginAdmin(payloadObj)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      // Handle login error (would add toast notification in real implementation)
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style>
  :root {
    --color-primary: #1D4449;
    --color-primary: #C2F725;
    --color-primary-dark: #a6d31e;
  }
  </style>