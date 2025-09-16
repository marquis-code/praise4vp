<template>
  <div class="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
    <!-- Top Section with Video -->
    <div class="relative px-4 pt-16 pb-32">
      <!-- Header Text -->
      <div class="text-center mb-12">
        <p class="text-sm text-blue-600 font-medium mb-2 tracking-wide uppercase">Live Video</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">See Our Work Live</h1>
        <p class="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur numquam magnam, sed perspiciatis mollitia nesciunt amet, 
          consequuntur error culpa nobis dolore asperiores eum non quasi
        </p>
      </div>

      <!-- Video Container -->
      <div class="relative max-w-4xl mx-auto">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl">
          <!-- Video Placeholder with Image -->
          <div class="relative aspect-video bg-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Protest demonstration" 
              class="w-full h-full object-cover"
            />
            <!-- Play Button -->
            <div class="absolute inset-0 flex items-center justify-center">
              <button class="bg-red-600 hover:bg-red-700 transition-colors duration-200 rounded-lg p-4 shadow-lg">
                <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with Statistics -->
    <div class="relative">
      <!-- Background with decorative elements -->
      <div class="absolute inset-0 bg-slate-900">
        <!-- Decorative flag-like pattern on the left -->
        <div class="absolute left-0 top-0 w-64 h-full opacity-20">
          <div class="relative w-full h-full">
            <!-- Flag stripes -->
            <div class="absolute inset-0">
              <div class="flex flex-col h-full">
                <div class="flex-1 bg-red-500 opacity-60"></div>
                <div class="flex-1 bg-transparent"></div>
                <div class="flex-1 bg-red-500 opacity-60"></div>
                <div class="flex-1 bg-transparent"></div>
                <div class="flex-1 bg-red-500 opacity-60"></div>
                <div class="flex-1 bg-transparent"></div>
                <div class="flex-1 bg-red-500 opacity-60"></div>
              </div>
              <!-- Curved overlay -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent transform rotate-12 scale-150"></div>
            </div>
            <!-- Stars -->
            <div class="absolute top-20 left-12">
              <svg class="w-6 h-6 text-red-400 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="absolute top-32 left-20">
              <svg class="w-4 h-4 text-red-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="absolute top-48 left-8">
              <svg class="w-5 h-5 text-red-400 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="absolute bottom-32 left-16">
              <svg class="w-3 h-3 text-red-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Right side decorative element -->
        <div class="absolute right-0 top-0 w-32 h-full opacity-10">
          <div class="w-full h-full bg-gradient-to-l from-blue-500/30 to-transparent"></div>
        </div>
      </div>

      <!-- Statistics Content -->
      <div class="relative z-10 px-4 py-16">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <!-- Active Volunteer -->
            <div class="space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white">1K</div>
              <div class="text-gray-300 font-medium">Active Volunteer</div>
            </div>
            
            <!-- Missions -->
            <div class="space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white">17</div>
              <div class="text-gray-300 font-medium">Missions</div>
            </div>
            
            <!-- Donations -->
            <div class="space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white">80</div>
              <div class="text-gray-300 font-medium">Donations</div>
            </div>
            
            <!-- Projects -->
            <div class="space-y-2">
              <div class="text-4xl md:text-5xl font-bold text-white">1K</div>
              <div class="text-gray-300 font-medium">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
// For now, this is a static component matching the design
</script>

<style scoped>
/* Additional custom styles if needed */
</style>