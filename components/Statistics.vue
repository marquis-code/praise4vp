<template>
  <section class="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-16 lg:py-24 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-20 w-96 h-96 border border-blue-300 rounded-full"></div>
      <div class="absolute bottom-20 right-20 w-64 h-64 border border-slate-600 rounded-full"></div>
      <div class="absolute top-1/2 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      <div class="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-400 rounded-full animate-pulse animation-delay-1000"></div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Content - Video Player -->
        <div class="lg:col-span-6 animate-fadeInLeft">
          <div class="relative group">
            <!-- Video frame with layered borders -->
            <div class="relative">
              <!-- Blue border layer -->
              <div class="absolute -inset-4 bg-blue-500 rounded-lg transform rotate-1"></div>
              <!-- Red border layer -->
              <div class="absolute -inset-2 bg-red-500 rounded-lg transform -rotate-1"></div>
              
              <!-- Main video container -->
              <div class="relative bg-white rounded-lg overflow-hidden shadow-2xl">
                <div class="aspect-video relative">
                  <img 
                    :src="videoThumbnail"
                    :alt="videoAlt"
                    class="w-full h-full object-cover"
                  />
                  
                  <!-- Video overlay -->
                  <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <!-- Play button -->
                    <button 
                      @click="playVideo"
                      class="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 hover:scale-110 hover:bg-opacity-100 group-hover:shadow-2xl"
                    >
                      <svg class="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Video progress indicator -->
                  <div class="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30">
                    <div class="h-full bg-red-500 w-1/3 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Text & Signature -->
        <div class="lg:col-span-6 space-y-8 animate-fadeInRight">
          <!-- Header -->
          <div class="space-y-6">
            <!-- Badge -->
            <div class="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              <span>=</span>
              <span>GET TO KNOW US</span>
            </div>

            <!-- Main heading -->
            <div class="space-y-2">
              <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Get involved <span class="text-blue-400">Contribution</span>
              </h2>
              <h3 class="text-3xl lg:text-4xl font-bold text-white">
                Make yourself Proud!
              </h3>
            </div>

            <!-- Divider line -->
            <div class="w-16 h-1 bg-blue-400 rounded"></div>

            <!-- Description -->
            <p class="text-gray-300 text-lg leading-relaxed max-w-2xl">
              Through my service in NUNSA and COMPSSA, I discovered that leadership is not about the positions I have been opportune to hold, but about the students I was called to serve, their struggles, their victories, and their need for support. As Vice President of NUNSA, I witnessed how a listening ear, a small initiative, or a united effort can make a lasting impact.
            </p>
          </div>

          <!-- Signature -->
          <div class="animate-fadeInUp animation-delay-800">
            <div class="text-blue-300 text-3xl font-script italic">
              Praise Deborah
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Statistics Section -->
    <!-- <div class="relative mt-20">
      <div class="bg-white py-16">
        <div class="container mx-auto px-4 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div 
              v-for="(stat, index) in statistics"
              :key="index"
              class="text-center group animate-fadeInUp"
              :style="{ animationDelay: `${index * 200}ms` }"
            >
              <div class="w-20 h-20 mx-auto mb-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                   :class="stat.iconColor">
                <component :is="stat.icon" class="w-8 h-8" />
              </div>
              <div class="text-4xl lg:text-5xl font-bold mb-2" :class="stat.numberColor">
                <span ref="counterRefs">{{ formatNumber(stat.number) }}</span>+
              </div>
              <div class="text-gray-600 font-medium">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import user1 from '@/assets/img/personal/user1.jpg'
import user2 from '@/assets/img/personal/user2.jpg'

interface Statistic {
  number: number
  label: string
  icon: any
  iconColor: string
  numberColor: string
}

// Video data
const videoThumbnail = ref(user1)
const videoAlt = ref('Olawuyi Praise speaking at rally')

// Statistics data
const statistics: Statistic[] = [
  {
    number: 517,
    label: 'Total Volunteer',
    icon: 'VolunteerIcon',
    iconColor: 'border-blue-400 text-blue-500 group-hover:bg-blue-50',
    numberColor: 'text-blue-600'
  },
  {
    number: 383,
    label: 'All Campaigns',
    icon: 'CampaignIcon',
    iconColor: 'border-red-400 text-red-500 group-hover:bg-red-50',
    numberColor: 'text-red-600'
  },
  {
    number: 807,
    label: 'Vote Papers',
    icon: 'VoteIcon',
    iconColor: 'border-blue-400 text-blue-500 group-hover:bg-blue-50',
    numberColor: 'text-blue-600'
  },
  {
    number: 957,
    label: 'Coverage Area',
    icon: 'CoverageIcon',
    iconColor: 'border-red-400 text-red-500 group-hover:bg-red-50',
    numberColor: 'text-red-600'
  }
]

// SVG Icons as render functions
const VolunteerIcon = () => h('svg', {
  class: 'w-8 h-8',
  fill: 'currentColor',
  viewBox: '0 0 20 20'
}, [
  h('path', {
    d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const CampaignIcon = () => h('svg', {
  class: 'w-8 h-8',
  fill: 'currentColor',
  viewBox: '0 0 20 20'
}, [
  h('path', {
    fillRule: 'evenodd',
    d: 'M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z',
    clipRule: 'evenodd'
  })
])

const VoteIcon = () => h('svg', {
  class: 'w-8 h-8',
  fill: 'currentColor',
  viewBox: '0 0 20 20'
}, [
  h('path', {
    d: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
  }),
  h('path', {
    fillRule: 'evenodd',
    d: 'M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5zM7.5 8a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5V8zm.5 2a.5.5 0 00-.5.5v.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-.5a.5.5 0 00-.5-.5H8z',
    clipRule: 'evenodd'
  })
])

const CoverageIcon = () => h('svg', {
  class: 'w-8 h-8',
  fill: 'currentColor',
  viewBox: '0 0 20 20'
}, [
  h('path', {
    fillRule: 'evenodd',
    d: 'M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z',
    clipRule: 'evenodd'
  })
])

// Update statistics with proper icons
statistics[0].icon = VolunteerIcon
statistics[1].icon = CampaignIcon
statistics[2].icon = VoteIcon
statistics[3].icon = CoverageIcon

// Counter animation refs
const counterRefs = ref<HTMLElement[]>([])

// Methods
const playVideo = () => {
  console.log('Playing video...')
  // Handle video play logic here
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const animateCounters = () => {
  statistics.forEach((stat, index) => {
    let current = 0
    const increment = stat.number / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= stat.number) {
        current = stat.number
        clearInterval(timer)
      }
      if (counterRefs.value[index]) {
        counterRefs.value[index].textContent = Math.floor(current).toLocaleString()
      }
    }, 50)
  })
}

onMounted(() => {
  // Start counter animation after component mounts
  setTimeout(animateCounters, 1000)
})
</script>

<style scoped>
/* Custom font for signature */
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');

.font-script {
  font-family: 'Dancing Script', cursive;
}

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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation classes */
.animate-fadeInLeft {
  animation: fadeInLeft 1s ease-out;
}

.animate-fadeInRight {
  animation: fadeInRight 1s ease-out;
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out both;
}

/* Animation delays */
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-800 {
  animation-delay: 0.8s;
}

/* Container max width */
.container {
  max-width: 1200px;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  h2 {
    font-size: 3rem;
  }
  
  h3 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  h2 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  h3 {
    font-size: 2rem;
  }
  
  .aspect-video {
    aspect-ratio: 16/9;
  }
  
  .w-20.h-20 {
    width: 4rem;
    height: 4rem;
  }
  
  .text-4xl.lg\:text-5xl {
    font-size: 2.5rem;
  }
}

@media (max-width: 640px) {
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  .grid-cols-1.md\:grid-cols-2.lg\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .text-3xl.font-script {
    font-size: 2rem;
  }
}
</style>