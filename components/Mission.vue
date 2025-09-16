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
        <div class="lg:col-span-7 order-2 lg:order-1 space-y-12">
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
                <p class="text-gray-300 max-w-sm lg:max-w-max text-base lg:text-lg leading-relaxed">
                  {{ mission.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Image Carousel -->
        <div class="lg:col-span-5 order-1 lg:order-2 relative animate-fadeInRight">
          <div class="relative group" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
            <!-- Main image container -->
            <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
              <!-- Carousel Images -->
              <div class="relative w-full h-80 lg:h-96 xl:h-[500px]">
                <TransitionGroup
                  name="carousel-fade"
                  tag="div"
                  class="relative w-full h-full"
                >
                  <div
                    v-for="(candidate, index) in candidates"
                    v-show="index === currentSlide"
                    :key="candidate.id"
                    class="absolute inset-0 w-full h-full"
                  >
                    <img 
                      :src="candidate.image" 
                      :alt="candidate.alt"
                      class="w-full h-full object-cover"
                    />
                    
                    <!-- Gradient overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                    
                    <!-- Content overlay -->
                    <div class="absolute bottom-6 left-6 right-6 text-white">
                      <p class="text-sm opacity-90 mb-2">{{ candidate.role }}</p>
                      <h3 class="text-xl font-bold">{{ candidate.name }}</h3>
                      <p class="text-sm opacity-80">{{ candidate.position }}</p>
                    </div>

                    <!-- Hover Election Info -->
                    <Transition name="hover-info">
                      <div 
                        v-show="isHovered"
                        class="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 bg-opacity-95 flex items-center justify-center p-6"
                      >
                        <div class="text-center text-white max-w-sm">
                          <div class="flex items-center justify-center mb-4">
                            <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-3">
                              <span class="text-white font-bold text-lg">{{ candidate.campaign.title.charAt(0) }}</span>
                            </div>
                            <div class="text-left">
                              <div class="text-lg font-bold text-blue-300">{{ candidate.campaign.title }}</div>
                              <div class="text-xs text-gray-300">FLAME Vision Plan</div>
                            </div>
                          </div>
                          <p class="text-sm leading-relaxed mb-4 text-gray-200">{{ candidate.campaign.message }}</p>
                          <div class="text-xs opacity-90 italic text-blue-200">{{ candidate.campaign.slogan }}</div>
                          <div class="mt-4 text-xs text-center">
                            <span class="bg-red-500 text-white px-3 py-1 rounded-full font-semibold">PRAISE4VP</span>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </TransitionGroup>
              </div>

              <!-- Border accent -->
              <div class="absolute inset-0 border-4 border-white border-opacity-20 rounded-2xl"></div>
              
              <!-- Carousel indicators -->
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  v-for="(candidate, index) in candidates"
                  :key="index"
                  @click="goToSlide(index)"
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'"
                ></button>
              </div>

              <!-- Navigation arrows -->
              <button
                @click="previousSlide"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <button
                @click="nextSlide"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Decorative elements -->
            <div class="absolute -top-6 -right-6 w-12 h-12 border-4 border-blue-300 rounded-full opacity-60 animate-pulse"></div>
            <div class="absolute -bottom-6 -left-6 w-8 h-8 bg-red-500 rounded-full opacity-80 animate-bounce"></div>
            
            <!-- Campaign badge -->
            <div class="absolute -left-4 top-1/4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full px-4 py-2 shadow-xl opacity-95 animate-pulse animation-delay-2000">
              <div class="text-center">
                <div class="text-xs font-bold">PRAISE4VP</div>
                <div class="text-xs opacity-90">2025</div>
              </div>
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
import { ref, h, onMounted, onUnmounted } from 'vue'
import serviceDot30 from "@/assets/img/service.30.jpg"
import serviceMain from "@/assets/img/service.jpg"
import service1 from "@/assets/img/service1.jpeg"
import service2 from "@/assets/img/service2.jpeg"
import service3 from "@/assets/img/service3.jpeg"
import service4 from "@/assets/img/service4.jpeg"
import service5 from "@/assets/img/service5.jpeg"
import service6 from "@/assets/img/service6.jpeg"
import service7 from "@/assets/img/service7.jpeg"
import service8 from "@/assets/img/service8.jpeg"
import service9 from "@/assets/img/service9.jpeg"
import service10 from "@/assets/img/service10.jpeg"
import service11 from "@/assets/img/service11.jpeg"
import service12 from "@/assets/img/service12.jpeg"
import service13 from "@/assets/img/service13.jpeg"
import service14 from "@/assets/img/service14.jpeg"
import service15 from "@/assets/img/service15.jpeg"
import service16 from "@/assets/img/service16.jpg"
import service17 from "@/assets/img/service17.jpg"
import service18 from "@/assets/img/service18.jpg"
import service19 from "@/assets/img/service19.jpg"
import service20 from "@/assets/img/service20.jpg"
import service21 from "@/assets/img/service21.jpg"
import service22 from "@/assets/img/service22.jpg"
import service23 from "@/assets/img/service23.jpg"
import service25 from "@/assets/img/service25.jpg"
import service26 from "@/assets/img/service26.jpg"
import service27 from "@/assets/img/service27.jpg"
import service28 from "@/assets/img/service28.jpg"
import service29 from "@/assets/img/service29.jpg"
import service31 from "@/assets/img/service31.jpeg"
import service32 from "@/assets/img/service32.jpg"
import service33 from "@/assets/img/service33.jpg"
import service34 from "@/assets/img/service34.jpg"
import service35 from "@/assets/img/service35.jpg"
import service36 from "@/assets/img/service36.png"
import service37 from "@/assets/img/service37.png"
import service38 from "@/assets/img/service38.jpg"
import service39 from "@/assets/img/service39.jpg"
import service40 from "@/assets/img/service40.jpg"
import service41 from "@/assets/img/service41.png"
import service42 from "@/assets/img/service42.jpg"
import service43 from "@/assets/img/service43.jpg"
import service44 from "@/assets/img/service44.jpg"
import service45 from "@/assets/img/service45.jpg"
import service46 from "@/assets/img/service46.jpg"
import srvice24 from "@/assets/img/srvice24.jpg"

interface Mission {
  title: string
  description: string
  icon: any
  iconBg: string
}

interface Candidate {
  id: number
  name: string
  role: string
  position: string
  image: string
  alt: string
  campaign: {
    title: string
    message: string
    slogan: string
  }
}

// Carousel state
const currentSlide = ref(0)
const isHovered = ref(false)
const carouselInterval = ref<NodeJS.Timeout | null>(null)
const isPaused = ref(false)

// Candidates data for carousel with expanded images
const candidates: Candidate[] = [
  {
    id: 1,
    name: 'Olawuyi Praise Deborah',
    role: 'Student Leader & VP Candidate',
    position: 'Vice President NUNSA Unilag',
    image: service40,
    alt: 'Olawuyi Praise - COMPSSA VP Candidate',
    campaign: {
      title: 'F - Foster Collaboration',
      message: 'Building interdepartmental unity where every student values their colleagues\' courses without any department feeling superior or inferior.',
      slogan: '"Inspiring Impacts, Building Bridges"'
    }
  },
  {
    id: 2,
    name: 'Olawuyi Praise Deborah',
    role: 'Community Service Leader',
    position: 'Medical Outreach Coordinator',
    image: service39,
    alt: 'Praise during medical outreach activities',
    campaign: {
      title: 'L - Life & Wellbeing',
      message: 'Ensuring academics remain a priority while creating balance because medical students deserve to live beyond the books.',
      slogan: '"Wholesome Student Wellbeing"'
    }
  },
  {
    id: 3,
    name: 'Olawuyi Praise Deborah',
    role: 'Academic Excellence Advocate',
    position: 'Nursing Science Representative',
    image: service38,
    alt: 'Praise at academic forum',
    campaign: {
      title: 'A - Academics & Beyond',
      message: 'Advocating for improved learning resources, better facilities, and enhanced student welfare programs for academic support.',
      slogan: '"Academic Support & Professional Growth"'
    }
  },
  {
    id: 4,
    name: 'Olawuyi Praise Deborah',
    role: 'Mentorship & Leadership',
    position: 'Student Development Coordinator',
    image: service37,
    alt: 'Praise mentoring fellow students',
    campaign: {
      title: 'M - Mentorship & Leadership',
      message: 'Creating opportunities for leadership development and skill-building programs that prepare students for professional excellence.',
      slogan: '"Leadership, Skills & Opportunities"'
    }
  },
  {
    id: 5,
    name: 'Olawuyi Praise Deborah',
    role: 'Impact-Driven Leader',
    position: 'Community Welfare Advocate',
    image: service36,
    alt: 'Praise at charity drive event',
    campaign: {
      title: 'E - Excellence Through Impact',
      message: 'Building a service-oriented COMPSSA that creates lasting positive impact on students and the broader community.',
      slogan: '"Service & Impact-Driven COMPSSA"'
    }
  },
  {
    id: 6,
    name: 'Olawuyi Praise Deborah',
    role: 'Health Week Coordinator',
    position: 'NUNSA Health Initiatives',
    image: service35,
    alt: 'Praise organizing health week activities',
    campaign: {
      title: 'Health & Wellness Focus',
      message: 'Leading comprehensive health initiatives including medical outreaches, mental health awareness, and student wellness programs.',
      slogan: '"Caring Beyond the Classroom"'
    }
  },
  {
    id: 7,
    name: 'Olawuyi Praise Deborah',
    role: 'Sports & Recreation Leader',
    position: 'NUNSA Sports Committee',
    image: service34,
    alt: 'Praise at sports week event',
    campaign: {
      title: 'Student Life Balance',
      message: 'Promoting work-life balance through sports, recreation, and wellness activities that complement academic excellence.',
      slogan: '"Active Bodies, Sharp Minds"'
    }
  },
  {
    id: 8,
    name: 'Olawuyi Praise Deborah',
    role: 'Welfare Committee Chair',
    position: 'Student Welfare Advocate',
    image: service33,
    alt: 'Praise during welfare committee meeting',
    campaign: {
      title: 'Student Welfare Priority',
      message: 'Championing student welfare initiatives, mental health support, and creating safe spaces for all COMPSSA students.',
      slogan: '"Every Student Matters"'
    }
  },
  {
    id: 9,
    name: 'Olawuyi Praise Deborah',
    role: 'Event Planning Expert',
    position: 'COMPSSA Week Organizer',
    image: service32,
    alt: 'Praise coordinating COMPSSA week events',
    campaign: {
      title: 'Excellence in Organization',
      message: 'Bringing organizational excellence to student events, ensuring memorable and impactful experiences for all participants.',
      slogan: '"Creating Memorable Moments"'
    }
  },
  {
    id: 10,
    name: 'Olawuyi Praise Deborah',
    role: 'Public Health Advocate',
    position: 'COMPSSA Public Health Committee',
    image: service31,
    alt: 'Praise at public health awareness event',
    campaign: {
      title: 'Community Health Focus',
      message: 'Leading public health initiatives and community awareness programs that extend COMPSSA\'s impact beyond the campus.',
      slogan: '"Health for All, Care for Community"'
    }
  }
]

// Mission data based on the FLAME vision
const missions: Mission[] = [
  {
    title: 'Foster Collaboration',
    description: 'Building interdepartmental unity where every student values their colleagues\' courses without any department feeling superior or inferior.',
    icon: 'HandshakeIcon',
    iconBg: 'bg-red-500 border-red-400'
  },
  {
    title: 'Life & Wellbeing',
    description: 'Ensuring academics remain a priority while creating balance because medical students deserve to live beyond the books.',
    icon: 'HeartIcon',
    iconBg: 'bg-blue-500 border-blue-400'
  }
]

// Carousel functions
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % candidates.length
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? candidates.length - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startCarousel = () => {
  if (!isPaused.value) {
    carouselInterval.value = setInterval(() => {
      nextSlide()
    }, 3500) // Change slide every 3.5 seconds for more images
  }
}

const stopCarousel = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
}

const pauseCarousel = () => {
  isPaused.value = true
  isHovered.value = true
  stopCarousel()
}

const resumeCarousel = () => {
  isPaused.value = false
  isHovered.value = false
  startCarousel()
}

// Lifecycle hooks
onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})

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
/* Carousel transitions */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}

/* Hover info transitions */
.hover-info-enter-active,
.hover-info-leave-active {
  transition: all 0.3s ease-in-out;
}

.hover-info-enter-from,
.hover-info-leave-to {
  opacity: 0;
  transform: scale(0.95);
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

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
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

  /* Hide navigation arrows on mobile */
  .group:hover .group-hover\:opacity-100 {
    opacity: 0;
  }
}
</style>