<template>
  <section class="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-16 lg:py-24 overflow-hidden">
    <!-- American Flag Background Pattern -->
    <div class="absolute top-0 right-0 w-full h-full">
      <!-- Stars section -->
      <div class="absolute top-0 right-0 w-1/3 h-2/3 bg-blue-800 opacity-60">
        <div class="grid grid-cols-6 gap-2 p-4 h-full">
          <div v-for="star in 30" :key="star" class="flex items-center justify-center">
            <div class="w-3 h-3 text-white opacity-40">⭐</div>
          </div>
        </div>
      </div>
      
      <!-- Stripes section -->
      <div class="absolute top-0 right-0 w-full h-full">
        <div v-for="stripe in 13" :key="stripe" class="w-full h-[7.69%]" 
             :class="stripe % 2 === 0 ? 'bg-red-500 opacity-20' : 'bg-white opacity-5'">
        </div>
      </div>
    </div>

    <!-- Decorative geometric shapes -->
    <div class="absolute bottom-0 right-0 w-96 h-96 opacity-10">
      <svg viewBox="0 0 400 400" class="w-full h-full">
        <polygon points="0,400 200,0 400,400" fill="#ef4444" opacity="0.3"/>
        <polygon points="100,400 200,200 300,400" fill="#3b82f6" opacity="0.3"/>
      </svg>
    </div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Content - Mission Points -->
        <div class="lg:col-span-7 space-y-12">
          <!-- Section header -->
          <div class="space-y-6 animate-fadeInLeft">
            <div class="inline-flex items-center space-x-2 text-blue-300 text-sm font-medium">
              <span>=</span>
              <span>MISSION & VISION</span>
            </div>

            <h2 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
              Our Mission Revolve Around<br>
              Well-being of <span class="text-blue-300">Students</span>
            </h2>

            <!-- Divider line -->
            <div class="w-16 h-1 bg-blue-300 rounded"></div>
          </div>

          <!-- Mission items -->
          <div class="space-y-8">
            <div 
              v-for="(mission, index) in missions"
              :key="index"
              class="flex items-start space-x-6 group animate-fadeInLeft"
              :style="{ animationDelay: `${index * 200}ms` }"
            >
              <!-- Mission icon -->
              <div class="flex-shrink-0 relative">
                <div class="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                     :class="mission.iconBg">
                  <component :is="mission.icon" class="w-8 h-8 text-white" />
                </div>
                
                <!-- Animated ring -->
                <div class="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>

              <!-- Mission content -->
              <div class="flex-1 space-y-3">
                <h3 class="text-xl lg:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                  {{ mission.title }}
                </h3>
                <p class="text-gray-300 text-base lg:text-lg leading-relaxed">
                  {{ mission.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Call to action -->
          <!-- <div class="animate-fadeInLeft animation-delay-1000">
            <button class="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3">
              <span>Learn More About Our Vision</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div> -->
        </div>

        <!-- Right Content - Featured Image -->
        <div class="lg:col-span-5 relative animate-fadeInRight">
          <div class="relative group">
            <!-- Main image container -->
            <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
              <img 
                :src="activistImage" 
                :alt="activistAlt"
                class="w-full h-80 lg:h-96 xl:h-[500px] object-cover"
              />
              
              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
              
              <!-- Content overlay -->
              <div class="absolute bottom-6 left-6 right-6 text-white">
                <p class="text-sm opacity-90 mb-2">Student Leader</p>
                <h3 class="text-xl font-bold">Olawuyi Praise Deborah</h3>
                <p class="text-sm opacity-80">Vice President Candidate</p>
              </div>

              <!-- Border accent -->
              <div class="absolute inset-0 border-4 border-white border-opacity-20 rounded-2xl"></div>
            </div>

            <!-- Decorative elements -->
            <div class="absolute -top-6 -right-6 w-12 h-12 border-4 border-blue-300 rounded-full opacity-60 animate-pulse"></div>
            <div class="absolute -bottom-6 -left-6 w-8 h-8 bg-red-500 rounded-full opacity-80 animate-bounce"></div>
            
            <!-- Quote bubble -->
            <div class="absolute -left-4 top-1/4 bg-white rounded-full p-3 shadow-xl opacity-90 animate-pulse animation-delay-2000">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V7a1 1 0 112 0v3.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>

          <!-- Floating stats -->
          <div class="absolute top-8 -left-8 bg-white rounded-xl shadow-xl p-4 opacity-95 animate-float">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">5+</div>
              <div class="text-xs text-gray-600">Years Experience</div>
            </div>
          </div>

          <div class="absolute bottom-8 -right-8 bg-red-500 text-white rounded-xl shadow-xl p-4 opacity-95 animate-float animation-delay-1000">
            <div class="text-center">
              <div class="text-2xl font-bold">FLAME</div>
              <div class="text-xs opacity-90">Vision Plan</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom wave decoration -->
    <div class="absolute bottom-0 left-0 w-full">
      <svg viewBox="0 0 1200 100" class="w-full h-16 opacity-20">
        <path d="M0,100 C300,20 900,80 1200,40 L1200,100 Z" fill="#3b82f6"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import user1 from '@/assets/img/personal/user1.jpg'
import user2 from '@/assets/img/personal/user2.jpg'
import user3 from '@/assets/img/personal/user3.jpg'

interface Mission {
  title: string
  description: string
  icon: any
  iconBg: string
}

// Images - replace with your actual images
const activistImage = ref(user1)
const activistAlt = ref('Olawuyi Praise speaking at a rally')

// Mission data based on the FLAME vision from the document
const missions: Mission[] = [
  {
    title: 'Foster Collaboration',
    description: 'Building interdepartmental unity where every student values their colleagues\' courses without any department feeling superior or inferior.',
    icon: 'svg',
    iconBg: 'bg-red-500 border-red-400'
  },
  {
    title: 'Life & Wellbeing',
    description: 'Ensuring academics remain a priority while creating balance because medical students deserve to live beyond the books.',
    icon: 'svg',
    iconBg: 'bg-blue-500 border-blue-400'
  }
]

// Create SVG icons as render functions
const HandshakeIcon = () => h('svg', {
  class: 'w-8 h-8',
  fill: 'currentColor',
  viewBox: '0 0 20 20'
}, [
  h('path', {
    fillRule: 'evenodd',
    d: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    clipRule: 'evenodd'
  })
])

const HeartIcon = () => h('svg', {
  class: 'w-8 h-8',
  fill: 'currentColor',
  viewBox: '0 0 20 20'
}, [
  h('path', {
    fillRule: 'evenodd',
    d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
    clipRule: 'evenodd'
  })
])

// Update missions with proper icons
missions[0].icon = HandshakeIcon
missions[1].icon = HeartIcon
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

/* Animation classes */
.animate-fadeInLeft {
  animation: fadeInLeft 1s ease-out both;
}

.animate-fadeInRight {
  animation: fadeInRight 1s ease-out both;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Animation delays */
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* Hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Container max width */
.container {
  max-width: 1200px;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  h2 {
    font-size: 3rem;
    line-height: 1.1;
  }
}

@media (max-width: 768px) {
  h2 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  h3 {
    font-size: 1.25rem;
  }
  
  .space-x-6 {
    gap: 1rem;
  }
  
  .w-16.h-16 {
    width: 3rem;
    height: 3rem;
  }
  
  .absolute.-left-8 {
    left: -1rem;
  }
  
  .absolute.-right-8 {
    right: -1rem;
  }
}

@media (max-width: 640px) {
  h2 {
    font-size: 2rem;
  }
  
  .flex.items-start.space-x-6 {
    flex-direction: column;
    space-x: 0;
    gap: 1rem;
  }
  
  .space-x-6 {
    gap: 0;
  }
  
  .lg\:col-span-7,
  .lg\:col-span-5 {
    grid-column: span 12;
  }
}
</style>