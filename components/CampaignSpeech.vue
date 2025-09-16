<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-30 -translate-y-20 translate-x-20"></div>
    <div class="absolute top-20 right-20 w-8 h-8 bg-white rounded-full opacity-60"></div>
    <div class="absolute top-32 right-32 w-4 h-4 bg-white rounded-full opacity-40"></div>
    <div class="absolute top-40 right-16 w-6 h-6 bg-white rounded-full opacity-50"></div>
    
    <div class="container mx-auto px-4 py-8 lg:py-16 relative z-10">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
        <!-- Left Content -->
        <div class="space-y-8 lg:pr-8">
          <!-- Header -->
          <div class="space-y-4">
            <p class="text-gray-600 text-sm font-medium uppercase tracking-wide">What We Offer</p>
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Walk on idology is<br>
              <span class="text-blue-900">with hope</span>
            </h1>
          </div>

          <!-- Tabs -->
          <div class="space-y-6">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                :class="[
                  'px-6 py-3 rounded-lg font-medium transition-all duration-300 text-sm relative overflow-hidden',
                  activeTab === tab.id
                    ? 'bg-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div 
                class="h-full bg-red-500 rounded-full transition-all duration-100 ease-linear"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>

            <!-- Tab Content -->
            <Transition name="fade" mode="out-in">
              <div :key="activeTab" class="space-y-4">
                <p class="text-gray-700 text-lg leading-loose">
                  {{ currentTab.content.paragraph1 }}
                </p>
                <p class="text-gray-700 text-lg leading-loose">
                  {{ currentTab.content.paragraph2 }}
                </p>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right Content - Video/Image -->
        <div class="lg:pl-8">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <!-- Main content area with gradient background -->
            <div class="aspect-video relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800">
              <!-- Animated background pattern -->
              <div class="absolute inset-0 opacity-20">
                <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse"></div>
              </div>
              
              <!-- Speaker/Content Image -->
              <Transition name="fade" mode="out-in">
                <div :key="activeTab" class="absolute inset-0 flex items-center justify-center">
                  <!-- For Education tab - show speaker -->
                  <div v-if="activeTab === 'education'" class="absolute bottom-8 right-8 w-32 h-32 lg:w-40 lg:h-40">
                    <div class="relative w-full h-full">
                      <div class="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl">
                        <!-- Placeholder for speaker image -->
                        <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center">
                          <svg class="w-12 h-12 lg:w-16 lg:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      </div>
                      <!-- Podium/Stage effect -->
                      <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-full"></div>
                    </div>
                  </div>

                  <!-- For other tabs - show relevant icons/graphics -->
                  <div v-else class="flex items-center justify-center w-full h-full">
                    <div class="text-center space-y-4">
                      <!-- Tab-specific icons -->
                      <div class="mx-auto w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                        <component :is="getTabIcon(activeTab)" class="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </div>
                      <h3 class="text-white text-xl lg:text-2xl font-semibold">{{ currentTab.label }}</h3>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Decorative elements -->
              <div class="absolute top-6 left-6 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
              <div class="absolute top-12 left-12 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
              <div class="absolute bottom-6 left-6 w-4 h-4 bg-white/50 rounded-full animate-bounce"></div>

              <!-- Stats overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <div class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Transition name="fade" mode="out-in">
                    <div :key="activeTab" class="grid grid-cols-3 gap-4 text-white text-center">
                      <div v-for="stat in currentTab.stats" :key="stat.label" class="space-y-1">
                        <div class="text-xl lg:text-2xl font-bold">{{ stat.value }}</div>
                        <div class="text-xs lg:text-sm opacity-80">{{ stat.label }}</div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface TabContent {
  paragraph1: string;
  paragraph2: string;
}

interface TabStats {
  value: string;
  label: string;
}

interface Tab {
  id: string;
  label: string;
  content: TabContent;
  stats: TabStats[];
}

const tabs: Tab[] = [
  {
    id: 'education',
    label: 'Education',
    content: {
      paragraph1: 'All these men were men of conviction. They deeply believed in what they were doing and put their reputations and their very lives on the line. This conviction communicates itself intuitively. Anyone watching, listening or even simply reading the text of rally and',
      paragraph2: 'These were charismatic men, each in their own way, was fascinating to observe and to engage. Anyone watching, listening or even simply reading the text of rally and stump speeches can'
    },
    stats: [
      { value: '95%', label: 'Success Rate' },
      { value: '1.2M', label: 'Students' },
      { value: '50+', label: 'Countries' }
    ]
  },
  {
    id: 'courageous',
    label: 'Courageous',
    content: {
      paragraph1: 'Courage is not the absence of fear, but the triumph over it. The brave may not live forever, but the cautious do not live at all. Our programs are designed to build resilience and foster brave leadership.',
      paragraph2: 'We believe that true courage comes from understanding, preparation, and the willingness to act despite uncertainty. Our methodology has been proven across diverse challenges and environments.'
    },
    stats: [
      { value: '87%', label: 'Leadership Growth' },
      { value: '2.5K', label: 'Leaders Trained' },
      { value: '15+', label: 'Years Experience' }
    ]
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    content: {
      paragraph1: 'Intelligence is not just about being smart; it\'s about being wise, adaptive, and insightful. Our intelligence-focused programs develop critical thinking, emotional intelligence, and strategic reasoning.',
      paragraph2: 'We combine cutting-edge research with practical applications to enhance cognitive abilities and decision-making skills. Our approach is holistic, addressing multiple dimensions of intelligence.'
    },
    stats: [
      { value: '92%', label: 'Improved Decisions' },
      { value: '3.8K', label: 'Professionals' },
      { value: '25+', label: 'Assessment Tools' }
    ]
  },
  {
    id: 'honest',
    label: 'Honest',
    content: {
      paragraph1: 'Honesty is the foundation of trust and authentic relationships. Our programs emphasize integrity, transparency, and ethical decision-making in all aspects of personal and professional life.',
      paragraph2: 'We create environments where truth-telling is valued and rewarded, where mistakes become learning opportunities, and where authentic communication drives meaningful connections and results.'
    },
    stats: [
      { value: '89%', label: 'Trust Score' },
      { value: '1.7K', label: 'Organizations' },
      { value: '98%', label: 'Satisfaction' }
    ]
  }
]

const activeTab = ref('education')
const progress = ref(0)
const tabDuration = 6000 // 6 seconds per tab
let intervalId: NodeJS.Timeout | null = null
let progressIntervalId: NodeJS.Timeout | null = null

const currentTab = computed(() => {
  return tabs.find(tab => tab.id === activeTab.value) || tabs[0]
})

const getTabIcon = (tabId: string) => {
  const icons: Record<string, any> = {
    education: 'svg',
    courageous: 'svg',
    intelligence: 'svg',
    honest: 'svg'
  }
  return icons[tabId] || 'svg'
}

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  resetTimer()
}

const nextTab = () => {
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab.value)
  const nextIndex = (currentIndex + 1) % tabs.length
  activeTab.value = tabs[nextIndex].id
}

const startTimer = () => {
  progress.value = 0
  
  // Progress bar animation (60 updates per second for smooth animation)
  progressIntervalId = setInterval(() => {
    progress.value += (100 / (tabDuration / 100)) // Increment to reach 100% in tabDuration
    if (progress.value >= 100) {
      clearInterval(progressIntervalId!)
    }
  }, 100)

  // Tab switching
  intervalId = setTimeout(() => {
    nextTab()
    startTimer()
  }, tabDuration)
}

const resetTimer = () => {
  if (intervalId) {
    clearTimeout(intervalId)
  }
  if (progressIntervalId) {
    clearInterval(progressIntervalId)
  }
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (intervalId) {
    clearTimeout(intervalId)
  }
  if (progressIntervalId) {
    clearInterval(progressIntervalId)
  }
})

// Set page title and meta
useHead({
  title: 'Walk on Idology - Hope & Education',
  meta: [
    { name: 'description', content: 'Walk on idology with hope through education, courage, intelligence, and honesty.' }
  ]
})
</script>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Custom animations for decorative elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.float {
  animation: float 3s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Tab button hover effects */
button {
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

button:hover::before {
  left: 100%;
}
</style>