<template>
  <div class="min-h-screen bg-gray-900 relative overflow-hidden">
    <!-- Hero Section -->
    <section class="relative h-screen pt-72 lg:pt-0">
      <!-- Background with gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-transparent"></div>

      <!-- Australian Flag -->
      <div class="absolute top-6 left-6 z-20">
        <div class="flex items-center space-x-4">
            <img src="@/assets/img/compassa-logo.jpeg" class="h-20 w-20 rounded-full" />
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="relative z-10 flex items-center h-full">
        <div class="container mx-auto px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
            
            <!-- Left Content -->
            <div class="lg:col-span-7 text-white space-y-8 animate-fadeInLeft">
              <!-- Badge with star -->
              <div class="flex items-center space-x-3 text-sm opacity-90">
                <div class="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span class="text-yellow-400 animate-pulse">⭐</span>
                  <span class="font-medium">{{ slides[currentSlide].badge }}</span>
                </div>
              </div>

              <!-- Main Heading with stagger animation -->
              <div class="space-y-2">
                <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <div class="animate-slideInUp">
                    {{ slides[currentSlide].title.split(' ').slice(0, -1).join(' ') }}
                  </div>
                  <div class="animate-slideInUp animation-delay-200">
                    <span class="text-red-500 relative">
                      {{ slides[currentSlide].highlight }}
                      <!-- Animated underline -->
                      <div class="absolute bottom-0 left-0 w-full h-1 bg-red-500 transform scale-x-0 animate-scaleX animation-delay-500"></div>
                    </span>
                  </div>
                </h1>
              </div>

              <!-- Description with typewriter effect -->
              <p class="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed animate-fadeInUp animation-delay-400">
                {{ slides[currentSlide].description }}
              </p>

                 <!-- Campaign Slogan -->
              <div class="animate-fadeInUp animation-delay-500">
                <p class="text-lg text-red-300 font-semibold italic">
                  "{{ slides[currentSlide].slogan }}"
                </p>
              </div>

              <!-- CTA Button with hover animation -->
              <div class="animate-fadeInUp animation-delay-600">
                <a href="#testimonials" class="group bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3.5 px-8 rounded-full transition-all duration-300 inline-flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <span class="text-lg">My Portfolio</span>
                  <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Right Content - Carousel Images -->
            <div class="lg:col-span-5 relative h-full flex items-center justify-end animate-fadeInRight">
              <div class="relative w-full max-w-md h-96 lg:h-[500px]">
                <!-- Main carousel container -->
                <div class="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <div 
                    v-for="(slide, index) in slides" 
                    :key="index"
                    class="absolute inset-0 transition-all duration-1000 ease-in-out"
                    :class="{ 
                      'opacity-100 transform scale-100': currentSlide === index, 
                      'opacity-0 transform scale-95': currentSlide !== index 
                    }"
                  >
                    <img 
                      :src="slide.image" 
                      :alt="slide.alt"
                      class="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                    />
                    <!-- Gradient overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    
                    <!-- Candidate info overlay -->
                    <div class="absolute bottom-6 left-6 text-white">
                      <p class="text-sm opacity-90 mb-1">Candidate</p>
                      <h3 class="text-xl font-bold">{{ slide.candidateName }}</h3>
                    </div>
                  </div>

                  <!-- Decorative border -->
                  <div class="absolute inset-0 border-4 border-white border-opacity-20 rounded-2xl pointer-events-none"></div>
                </div>

                <!-- Floating elements around image -->
                <div class="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full animate-bounce animation-delay-1000"></div>
                <div class="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full animate-pulse animation-delay-1500"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Carousel Indicators -->
      <div class="absolute hidden lg:block bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          @click="setSlide(index)"
          class="relative w-4 h-4 rounded-full transition-all duration-300 group"
          :class="{ 
            'bg-red-500 scale-125': currentSlide === index, 
            'bg-white bg-opacity-30 hover:bg-opacity-50': currentSlide !== index 
          }"
        >
          <!-- Animated ring for active indicator -->
          <div 
            v-if="currentSlide === index"
            class="absolute inset-0 border-2 border-red-300 rounded-full animate-ping"
          ></div>
        </button>
      </div>

      <!-- Double Diamond/Cone Structure at Bottom -->
      <div class="absolute hidden lg:block bottom-0 left-0 w-full z-10">
        <!-- First diamond (upper) -->
        <svg viewBox="0 0 1200 120" class="w-full h-20">
          <polygon 
            points="0,120 600,20 1200,120" 
            fill="#dc2626" 
            class="animate-pulse"
            style="opacity: 0.9"
          />
        </svg>
        
        <!-- Second diamond (lower) -->
        <svg viewBox="0 0 1200 100" class="w-full h-16 -mt-2">
          <polygon 
            points="0,100 600,0 1200,100" 
            fill="#b91c1c" 
            class="animate-pulse animation-delay-500"
            style="opacity: 0.8"
          />
        </svg>

        <!-- Third layer for depth -->
        <svg viewBox="0 0 1200 80" class="w-full h-12 -mt-2">
          <polygon 
            points="0,80 600,0 1200,80" 
            fill="#991b1b" 
            style="opacity: 0.6"
          />
        </svg>
      </div>

      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Floating geometric shapes -->
        <div class="absolute top-1/4 left-10 w-2 h-2 bg-red-400 rounded-full animate-float"></div>
        <div class="absolute top-1/3 right-20 w-3 h-3 bg-blue-400 rounded-full animate-float animation-delay-1000"></div>
        <div class="absolute bottom-1/3 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-float animation-delay-1500"></div>
        
        <!-- Gradient orbs -->
        <div class="absolute top-1/2 -left-20 w-40 h-40 bg-gradient-to-r from-red-500 to-transparent rounded-full opacity-20 animate-pulse"></div>
        <div class="absolute bottom-1/4 -right-20 w-60 h-60 bg-gradient-to-l from-blue-500 to-transparent rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import user1 from '@/assets/img/personal/user1.jpg'
import user2 from '@/assets/img/personal/user2.jpg'
import user3 from '@/assets/img/personal/user3.jpg'
import user4 from '@/assets/img/personal/user4.jpg'
import user5 from '@/assets/img/personal/user5.jpg'
import user6 from '@/assets/img/personal/user6.jpg'
import user7 from '@/assets/img/personal/user7.jpg'
import user8 from '@/assets/img/personal/user8.jpg'
import user9 from '@/assets/img/personal/user9.jpg'
import user10 from '@/assets/img/personal/user10.jpg'
import user11 from '@/assets/img/personal/user11.jpg'
import user12 from '@/assets/img/personal/user12.jpg'
import user13 from '@/assets/img/personal/user13.jpg'
import user14 from '@/assets/img/personal/user14.jpg'
import user15 from '@/assets/img/personal/user15.jpg'

interface Slide {
  badge: string
  title: string
  highlight: string
  description: string
  position: string
  slogan: string
  image: string
  alt: string
  candidateImage: string
  candidateName: string
}

// Reactive state
const currentSlide = ref<number>(0)
const autoSlideInterval = ref<NodeJS.Timeout | null>(null)

// Carousel data using your imported images
const slides: Slide[] = [
 {
    badge: 'PRAISE4VP - COMPSSA',
    title: 'Inspiring Impacts, Building',
    highlight: 'Bridges',
    description: 'Like every student, I\'ve faced academic pressures, but found something deeper - an opportunity to serve, connect, and grow alongside brilliant minds.',
    slogan: 'To improve is to change, and to be perfect is to change often.',
    candidateName: 'Olawuyi Praise Deborah',
    image: user8,
    position: 'VP Candidate'
  },
  {
    badge: 'F.L.A.M.E AGENDA',
    title: 'Foster Collaboration &',
    highlight: 'Unity',
    description: 'Every student values the uniqueness of their colleagues\' courses, without any department feeling superior or inferior.',
    slogan: 'Unity, care, and support as our core values.',
    candidateName: 'Olawuyi Praise Deborah',
    image: user2,
    position: 'VP Candidate'
  },
  {
    badge: 'ACADEMIC EXCELLENCE',
    title: 'Life & Wellbeing',
    highlight: 'Balance',
    description: 'Academics remain a priority, but with room for balance because medical students deserve to live beyond the books.',
    slogan: 'Excellence through balance and wellbeing.',
    candidateName: 'Olawuyi Praise Deborah',
    image: user3,
    position: 'VP Candidate'
  },
  {
    badge: 'MENTORSHIP FOCUS',
    title: 'Leadership & Skills',
    highlight: 'Development',
    description: 'Leadership is not about positions but about people - their struggles, victories, and need for support.',
    slogan: 'Building leaders through service and mentorship.',
    candidateName: 'Olawuyi Praise Deborah',
    image: user6,
    position: 'VP Candidate'
  },
  {
    badge: 'SERVICE DRIVEN',
    title: 'Excellence Through',
    highlight: 'Impact',
    description: 'Making COMPSSA a true community that serves and belongs to us all, where every student feels seen and supported.',
    slogan: 'Together we build, together we rise.',
    candidateName: 'Olawuyi Praise Deborah',
    image: user9,
    position: 'VP Candidate'
  }
]

// Methods
const setSlide = (index: number) => {
  currentSlide.value = index
  resetAutoSlide()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const resetAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
  }
  startAutoSlide()
}

const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

// Lifecycle
onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
  }
})
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes scaleX {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
  }
}

/* Animation classes */
.animate-fadeInLeft {
  animation: fadeInLeft 1s ease-out;
}

.animate-fadeInRight {
  animation: fadeInRight 1s ease-out;
}

.animate-slideInUp {
  animation: slideInUp 0.8s ease-out;
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out;
}

.animate-scaleX {
  animation: scaleX 0.8s ease-out forwards;
  transform-origin: left;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Animation delays */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* Responsive typography */
@media (max-width: 1024px) {
  h1 {
    font-size: 3.5rem;
    line-height: 1.1;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
}

/* Smooth transitions */
* {
  transition-property: transform, opacity, background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass morphism effects */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Container max width */
.container {
  max-width: 1200px;
}
</style>