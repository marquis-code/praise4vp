<template>
  <main>
    <CursorWrapper>
      <CoreToast class="fixed top-4 right-4 z-[9999999]" />
    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
  </CursorWrapper>
  </main>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { visible, toastData } from '@/composables/core/useCustomToast';

// Provide the toast state globally
provide('toastVisible', visible);
provide('toastData', toastData);
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Baskervville&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kanit&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
</style>

<!-- <template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="!isAuthenticated">
      <LoginPage @login="handleLogin" />
    </div>
    <div v-else class="flex h-screen overflow-hidden">
      <Sidebar :is-mobile-open="isSidebarOpen" @close="isSidebarOpen = false" />
      
      <div class="flex flex-col flex-1 overflow-hidden">
        <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" :user="currentUser" />
        
        <main class="flex-1 overflow-y-auto p-4 md:p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoginPage from './components/auth/LoginPage.vue';
import Sidebar from './components/layout/Sidebar.vue';
import Header from './components/layout/Header.vue';
import { useAuth } from './composables/useAuth';

const router = useRouter();
const { isAuthenticated, currentUser, login, logout } = useAuth();
const isSidebarOpen = ref(false);

onMounted(() => {
  // Check if user is already authenticated
  if (isAuthenticated.value) {
    router.push('/dashboard');
  }
});

const handleLogin = async (credentials: { email: string; password: string }) => {
  try {
    await login(credentials);
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};

</script> -->