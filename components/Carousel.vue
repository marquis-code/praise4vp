<template>
  <section class="py-20 px-4 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
    <div class="container mx-auto max-w-7xl">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Key <span class="text-blue-600">Achievements</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Boost Your Brand with High-Impact Leadership Excellence from 
          our expert experience showcase. Our team is ready to 
          propel your business forward
        </p>
      </div>

      <!-- 3D Perspective Cards Container -->
      <div class="relative h-96 mb-16" style="perspective: 1200px; perspective-origin: center center;">
        <div 
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          :style="{ 
            transform: `translateX(${-currentOffset}px)`,
            transformStyle: 'preserve-3d'
          }"
        >
          <!-- Achievement Cards with 3D Positioning -->
          <div
            v-for="(achievement, index) in extendedAchievements"
            :key="`card-${index}`"
            class="absolute cursor-pointer group"
            :style="getCard3DStyle(index)"
            @click="openModal(achievement)"
          >
            <div class="w-64 h-80 relative transition-all duration-500 hover:scale-105">
              <div class="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <!-- Background Image -->
                <img 
                  :src="achievement.image" 
                  :alt="achievement.title"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <!-- Content Overlay - Always visible but subtle -->
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <!-- Icon -->
                  <div class="mb-3">
                    <div class="bg-white/20 backdrop-blur-sm rounded-full p-2 inline-flex">
                      <component 
                        :is="achievement.icon" 
                        class="w-5 h-5 text-white" 
                      />
                    </div>
                  </div>
                  
                  <!-- Title and details -->
                  <h3 class="text-lg font-bold mb-2 line-clamp-2">{{ achievement.title }}</h3>
                  <div class="flex items-center justify-between opacity-80">
                    <span class="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {{ achievement.period }}
                    </span>
                    <span class="text-xs font-medium">{{ achievement.category }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-16 relative">
        <!-- Hand-drawn arrow -->
        <div class="absolute -top-16 right-1/4 hidden md:block">
          <svg width="150" height="100" viewBox="0 0 150 100" class="text-gray-400">
            <path 
              d="M20 50 Q 60 20 100 50 T 130 55" 
              stroke="currentColor" 
              stroke-width="2" 
              fill="none" 
              stroke-linecap="round"
              stroke-dasharray="4,4"
              class="animate-pulse"
            />
            <path 
              d="M125 50 L130 55 L125 60" 
              stroke="currentColor" 
              stroke-width="2" 
              fill="none" 
              stroke-linecap="round"
            />
          </svg>
        </div>
        
        <!-- "It's free" text -->
        <div class="absolute -bottom-16 left-1/3 hidden md:block transform -rotate-12">
          <span class="text-xl text-gray-500 font-handwriting">It's free</span>
          <svg width="80" height="30" class="ml-2 inline-block">
            <path 
              d="M5 20 Q 25 10 45 20 T 75 23" 
              stroke="currentColor" 
              stroke-width="2" 
              fill="none" 
              stroke-linecap="round"
              class="text-gray-400"
            />
          </svg>
        </div>
        
        <button 
          @click="getStarted"
          class="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>

    <!-- Modal for Achievement Details -->
    <div 
      v-if="selectedAchievement" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div 
        class="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-modal-in"
        @click.stop
      >
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-2xl font-bold text-gray-900">{{ selectedAchievement.title }}</h3>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <img 
          :src="selectedAchievement.image" 
          :alt="selectedAchievement.title"
          class="w-full h-64 object-cover rounded-xl mb-6"
        />
        
        <p class="text-gray-600 mb-4">{{ selectedAchievement.description }}</p>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-semibold text-gray-900">Period:</span>
            <span class="text-gray-600 ml-2">{{ selectedAchievement.period }}</span>
          </div>
          <div>
            <span class="font-semibold text-gray-900">Category:</span>
            <span class="text-gray-600 ml-2">{{ selectedAchievement.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  Crown, 
  Users, 
  Award, 
  Heart, 
  Target, 
  Trophy, 
  Star, 
  Calendar,
  Briefcase,
  Globe
} from 'lucide-vue-next'

// Types
interface Achievement {
  title: string
  description: string
  period: string
  category: string
  image: string
  icon: any
  type: 'leadership' | 'committee' | 'volunteer' | 'team'
}

// Achievement data
const achievements: Achievement[] = [
  {
    title: 'NUNSA Leadership Excellence',
    description: 'Leading transformative change in student healthcare advocacy and community development.',
    period: '2024/2025',
    category: 'Leadership',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=600&fit=crop',
    icon: Crown,
    type: 'leadership'
  },
  {
    title: 'Coastal Conservation Initiative',
    description: 'Spearheading environmental protection programs along Nigeria\'s coastline.',
    period: '2024',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop',
    icon: Globe,
    type: 'leadership'
  },
  {
    title: 'Wellness & Mental Health Program',
    description: 'Developing comprehensive mental health support systems for student communities.',
    period: '2023/2024',
    category: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    icon: Heart,
    type: 'committee'
  },
  {
    title: 'Nutrition Education Campaign',
    description: 'Promoting healthy eating habits through innovative educational programs.',
    period: '2024',
    category: 'Health Promotion',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=600&fit=crop',
    icon: Target,
    type: 'volunteer'
  },
  {
    title: 'Community Engagement Project',
    description: 'Building bridges between academic institutions and local communities.',
    period: '2023/2024',
    category: 'Community Service',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop',
    icon: Users,
    type: 'committee'
  },
  {
    title: 'Transport Safety Initiative',
    description: 'Advocating for improved transportation safety measures in urban areas.',
    period: '2024',
    category: 'Safety',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
    icon: Award,
    type: 'leadership'
  }
]

// Reactive state
const selectedAchievement = ref<Achievement | null>(null)
const currentOffset = ref(0)
const autoPlayInterval = ref<NodeJS.Timeout>()

// 3D card positioning - creating the cylindrical/curved effect
const card3DPositions = [
  { x: 0, y: 20, rotateY: 25, rotateX: 5, scale: 0.95, translateZ: 100 },    // Left card - rotated right, forward
  { x: 220, y: 50, rotateY: 15, rotateX: 2, scale: 0.97, translateZ: 50 },   // Left-middle - slight rotation
  { x: 440, y: 80, rotateY: 0, rotateX: 0, scale: 0.9, translateZ: -50 },    // Center - pushed back
  { x: 660, y: 50, rotateY: -15, rotateX: 2, scale: 0.97, translateZ: 50 },  // Right-middle - slight rotation
  { x: 880, y: 20, rotateY: -25, rotateX: 5, scale: 0.95, translateZ: 100 }, // Right card - rotated left, forward
  { x: 1100, y: 40, rotateY: 20, rotateX: 3, scale: 0.96, translateZ: 80 },  // Far right - forward again
]

// Computed properties
const extendedAchievements = computed(() => {
  // Create multiple sets for smooth scrolling
  return [...achievements, ...achievements, ...achievements]
})

// Methods
const getCard3DStyle = (index: number) => {
  const positionIndex = index % card3DPositions.length
  const position = card3DPositions[positionIndex]
  const setOffset = Math.floor(index / card3DPositions.length) * (card3DPositions.length * 220)
  
  return {
    left: `${position.x + setOffset}px`,
    top: `${position.y}px`,
    transform: `
      translateZ(${position.translateZ}px) 
      rotateY(${position.rotateY}deg) 
      rotateX(${position.rotateX}deg) 
      scale(${position.scale})
    `,
    transformStyle: 'preserve-3d',
    zIndex: position.translateZ > 0 ? 30 : 10 // Forward cards have higher z-index
  }
}

const moveCarousel = () => {
  const moveDistance = 220 // Distance to move each step
  const maxOffset = card3DPositions.length * 220 // Reset point
  
  if (currentOffset.value >= maxOffset) {
    currentOffset.value = 0
  } else {
    currentOffset.value += moveDistance
  }
}

const startAutoPlay = () => {
  autoPlayInterval.value = setInterval(() => {
    moveCarousel()
  }, 3000) // Move every 3 seconds
}

const openModal = (achievement: Achievement) => {
  selectedAchievement.value = achievement
}

const closeModal = () => {
  selectedAchievement.value = null
}

const getStarted = () => {
  console.log('Get Started clicked')
}

// Lifecycle
onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
  }
})
</script>

<style scoped>
/* Modal animation */
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out forwards;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Handwriting font */
.font-handwriting {
  font-family: 'Kalam', cursive;
}

/* Enhanced shadow for 3D effect */
.shadow-3xl {
  box-shadow: 
    0 35px 60px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Custom scrollbar for modal */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>