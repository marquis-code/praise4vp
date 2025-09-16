<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-800 mb-4">My Journey in CMUL</h1>
    </div>

    <!-- Main Content - Side by Side Layout -->
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center mb-12">
      <!-- Left Side - Text Content with Typewriter Effect -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/40">
        <div class="space-y-6">
          <div class="typewriter-container">
            <h2 class="text-2xl font-bold text-indigo-600 mb-4">
              <span class="typewriter" :class="{ 'typing': isTyping }">{{ displayText }}</span>
              <span class="cursor" :class="{ 'blink': showCursor }">|</span>
            </h2>
          </div>
          
          <div class="animated-paragraph" :class="{ 'fade-in': showFirstParagraph }">
            <p class="text-gray-700 leading-relaxed text-lg">
              Stepping into CMUL felt like stepping into a world that stretches you — academically, mentally, and even emotionally. But beyond the lectures and exams, I soon realized that what truly makes this place special is the people and the community we build together.
            </p>
          </div>
          
          <div class="animated-paragraph" :class="{ 'fade-in': showSecondParagraph }">
            <p class="text-gray-700 leading-relaxed">
              Like every student, I've faced the pressures of long lectures, endless assignments, and the pursuit of academic excellence. Yet in the midst of these demands, I found something deeper — the opportunity to serve, to connect, and to grow alongside brilliant minds.
            </p>
          </div>
          
          <div class="animated-paragraph" :class="{ 'fade-in': showThirdParagraph }">
            <p class="text-gray-700 leading-relaxed">
              Through my service in NUNSA and COMPSSA, I discovered that leadership is not about positions or titles, but about people — their struggles, their victories, and their need for support. As Vice President of NUNSA, I witnessed how a listening ear, a small initiative, or a united effort can make a lasting impact.
            </p>
          </div>
          
          <div class="animated-paragraph" :class="{ 'fade-in': showFourthParagraph }">
            <p class="text-gray-700 leading-relaxed">
              Today, that journey fuels my commitment to COMPSSA. To me, our association is more than an umbrella body, it is a family. And like every true family, it thrives when unity, wellbeing, and excellence are at its heart. My resolve is to help build a COMPSSA where every student feels seen, supported, and empowered to excel, both within and beyond the classroom.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Side - Achievement Carousel -->
      <div class="space-y-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-800">My Achievements & Roles</h2>
          <p class="text-gray-600 mt-2">Here are a few of the roles I've been privileged to take on</p>
        </div>

        <!-- Carousel Container -->
        <div class="relative overflow-hidden h-96 bg-white/50 backdrop-blur-sm rounded-2xl p-4">
          <div 
            class="flex transition-transform duration-5000 ease-in-out"
            :style="{ transform: `translateX(${translateX}px)` }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <div
              v-for="(achievement, index) in extendedAchievements"
              :key="`${achievement.id}-${Math.floor(index / achievements.length)}`"
              class="flex-shrink-0 transition-all duration-1000 ease-in-out mx-2"
              :class="[
                isActive(index) 
                  ? 'w-80 h-80 z-20' 
                  : 'w-64 h-64 z-10',
                'relative'
              ]"
            >
              <div 
                class="rounded-2xl shadow-xl h-full transition-all duration-1000 ease-in-out relative overflow-hidden cursor-pointer"
                :class="[
                  isActive(index) 
                    ? 'bg-white border-4 border-indigo-400 shadow-2xl' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-50 hover:to-gray-150'
                ]"
              >
                <!-- Default State - Organization Logo -->
                <div 
                  v-if="!isActive(index)"
                  class="relative z-10 h-full flex flex-col justify-center items-center p-6"
                >
                  <!-- Organization Logo -->
                  <div class="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
                       :class="getLogoBackground(achievement.organization)">
                    <div class="text-white font-bold text-2xl">
                      {{ getLogoText(achievement.organization) }}
                    </div>
                  </div>
                  <!-- Organization Badge -->
                  <div class="px-4 py-2 text-white text-sm font-bold rounded-full"
                       :class="getBadgeBackground(achievement.organization)">
                    {{ getOrganizationTag(achievement.organization) }}
                  </div>
                </div>

                <!-- Active State - Text Content -->
                <div 
                  v-else
                  class="relative z-10 h-full flex flex-col p-6 overflow-y-auto"
                >
                  <!-- Header with Icon -->
                  <div class="flex items-start mb-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                         :class="getLogoBackground(achievement.organization)">
                      <div class="text-white font-bold text-sm">
                        {{ getLogoText(achievement.organization) }}
                      </div>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-gray-800 font-bold text-sm leading-tight">{{ achievement.title }}</h3>
                      <p class="text-gray-600 text-xs mt-1">{{ achievement.organization }}</p>
                    </div>
                  </div>
                  
                  <!-- Achievement Details -->
                  <div class="flex-1">
                    <p class="text-gray-700 text-sm leading-relaxed">{{ achievement.title }}</p>
                    <div class="mt-3 pt-3 border-t border-gray-200">
                      <p class="text-gray-600 text-xs">
                        <span class="font-semibold">Duration:</span> {{ achievement.duration }}
                      </p>
                      <p class="text-gray-600 text-xs mt-1">
                        <span class="font-semibold">Type:</span> {{ achievement.type }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Dots -->
        <div class="flex justify-center space-x-1 max-w-4xl mx-auto flex-wrap">
          <button
            v-for="(achievement, index) in achievements.slice(0, 10)"
            :key="index"
            @click="setActiveIndex(index)"
            class="w-2 h-2 rounded-full transition-colors duration-300 m-1"
            :class="activeIndex === index ? 'bg-indigo-600' : 'bg-gray-400'"
          ></button>
        </div>

        <!-- Achievement Counter -->
        <div class="text-center">
          <p class="text-gray-600">
            <span class="font-bold text-indigo-600">{{ activeIndex + 1 }}</span> of <span class="font-bold">{{ achievements.length }}</span> achievements
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Achievement {
  id: number;
  title: string;
  organization: string;
  duration: string;
  type: string;
}

// Flatten all achievements into individual cards
const achievements: Achievement[] = [
  // NUNSA Unilag
  { id: 1, title: "Vice President NUNSA Unilag, 2024/2025", organization: "NUNSA Unilag", duration: "2024/2025", type: "Leadership" },
  { id: 2, title: "Member, Sport Committee 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Committee" },
  { id: 3, title: "Member, Welfare Committee 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Committee" },
  { id: 4, title: "Member, Mental Health Monday 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Initiative" },
  { id: 5, title: "Planning Committee, Nunsa Sport week 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Event Planning" },
  { id: 6, title: "Welfare Committee, Mr. and Miss NUNSA 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Event Support" },
  { id: 7, title: "Medical Outreach Committee, Nunsa Health week 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Healthcare" },
  { id: 8, title: "Sport day Committee, Nunsa Health week 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Sports" },
  { id: 9, title: "Overall health week planning committee 2023/2024", organization: "NUNSA Unilag", duration: "2023/2024", type: "Healthcare Planning" },
  
  // COMPSSA
  { id: 10, title: "Member, Public Health Committee, 2024/2025", organization: "COMPSSA", duration: "2024/2025", type: "Committee" },
  { id: 11, title: "Volunteer, Compssa International Women's Day 2025", organization: "COMPSSA", duration: "2025", type: "Volunteer" },
  { id: 12, title: "Volunteer, Menstrual Hygiene Awareness 2025", organization: "COMPSSA", duration: "2025", type: "Health Advocacy" },
  { id: 13, title: "Volunteer, Medical Outreach, Compssa week 2024/2025", organization: "COMPSSA", duration: "2024/2025", type: "Healthcare" },
  { id: 14, title: "Data and Welfare team, Compssa Sport Festival 2025", organization: "COMPSSA", duration: "2025", type: "Data & Welfare" },
  { id: 15, title: "Volunteer, Compssa Charity Drive 1.0", organization: "COMPSSA", duration: "2024", type: "Community Service" },
  { id: 16, title: "Volunteer, Compssa Charity Drive 2.0", organization: "COMPSSA", duration: "2024", type: "Community Service" },
  { id: 17, title: "Member, Welfare Committee 2024/2025", organization: "COMPSSA", duration: "2024/2025", type: "Committee" },
  { id: 18, title: "Member, Welfare Committee 2023/2024", organization: "COMPSSA", duration: "2023/2024", type: "Committee" },
  { id: 19, title: "Member, Social committee 2023/2024", organization: "COMPSSA", duration: "2023/2024", type: "Committee" },
  { id: 20, title: "Volunteer, Trade fair committee, Compssa week 2023/2024", organization: "COMPSSA", duration: "2023/2024", type: "Event Support" },
  { id: 21, title: "Welfare committee, Electrofest, Compssa week 2023/2024", organization: "COMPSSA", duration: "2023/2024", type: "Event Welfare" },
  
  // NUNSA National
  { id: 22, title: "Special representative, Unilag chapter to the 28th Nunsa National Vice President", organization: "NUNSA National", duration: "2023", type: "Representation" },
  { id: 23, title: "Special representative, Unilag chapter to the 29th Nunsa National President", organization: "NUNSA National", duration: "2024", type: "Representation" },
  { id: 24, title: "Head of Opening Ceremony and Scientific Conference, 28th Nunsa National General Assembly", organization: "NUNSA National", duration: "2023", type: "Event Leadership" },
  { id: 25, title: "Head of Logistics, Nunsa Digital Health Summit", organization: "NUNSA National", duration: "2023", type: "Event Logistics" },
  { id: 26, title: "Nunsa National Programs and Event team 2023/2024", organization: "NUNSA National", duration: "2023/2024", type: "Programs" },
  { id: 27, title: "Member, Nunsa National Welfare Committee 2023/2024", organization: "NUNSA National", duration: "2023/2024", type: "Committee" }
];

// Create extended array for seamless looping
const extendedAchievements = computed(() => {
  return [...achievements, ...achievements, ...achievements];
});

const activeIndex = ref(0);
const translateX = ref(0);
const cardWidth = 272;
const activeCardWidth = 336;

// Typewriter effect variables
const fullText = "Stepping into Leadership";
const displayText = ref("");
const isTyping = ref(true);
const showCursor = ref(true);
const showFirstParagraph = ref(false);
const showSecondParagraph = ref(false);
const showThirdParagraph = ref(false);
const showFourthParagraph = ref(false);

// Helper functions for organization styling
const getLogoBackground = (org: string): string => {
  const backgrounds: Record<string, string> = {
    'NUNSA Unilag': 'bg-gradient-to-br from-emerald-500 to-teal-600',
    'COMPSSA': 'bg-gradient-to-br from-blue-500 to-indigo-600',
    'NUNSA National': 'bg-gradient-to-br from-purple-500 to-pink-600'
  };
  return backgrounds[org] || 'bg-gradient-to-br from-gray-500 to-gray-600';
};

const getBadgeBackground = (org: string): string => {
  const backgrounds: Record<string, string> = {
    'NUNSA Unilag': 'bg-emerald-500',
    'COMPSSA': 'bg-blue-500',
    'NUNSA National': 'bg-purple-500'
  };
  return backgrounds[org] || 'bg-gray-500';
};

const getLogoText = (org: string): string => {
  const logos: Record<string, string> = {
    'NUNSA Unilag': 'NU',
    'COMPSSA': 'CS',
    'NUNSA National': 'NN'
  };
  return logos[org] || 'OR';
};

const getOrganizationTag = (org: string): string => {
  const tags: Record<string, string> = {
    'NUNSA Unilag': 'NUNSA UNILAG',
    'COMPSSA': 'COMPSSA',
    'NUNSA National': 'NUNSA NATIONAL'
  };
  return tags[org] || 'ORGANIZATION';
};

// Calculate translate position
const calculateTranslateX = () => {
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const centerOffset = containerWidth / 4; // Adjusted for side-by-side layout
  const activeOffset = (activeIndex.value * cardWidth) + (activeCardWidth / 2);
  return centerOffset - activeOffset - (achievements.length * cardWidth);
};

const isActive = (index: number): boolean => {
  return (index % achievements.length) === activeIndex.value && 
         index >= achievements.length && 
         index < achievements.length * 2;
};

const setActiveIndex = (index: number) => {
  activeIndex.value = index;
  translateX.value = calculateTranslateX();
};

// Auto-rotation
let intervalId: NodeJS.Timeout;

const startAutoRotation = () => {
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % achievements.length;
    translateX.value = calculateTranslateX();
  }, 5000);
};

const stopAutoRotation = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

// Typewriter effect
const startTypewriter = () => {
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < fullText.length) {
      displayText.value += fullText.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
      isTyping.value = false;
      
      // Show paragraphs sequentially
      setTimeout(() => {
        showFirstParagraph.value = true;
      }, 500);
      
      setTimeout(() => {
        showSecondParagraph.value = true;
      }, 1500);
      
      setTimeout(() => {
        showThirdParagraph.value = true;
      }, 2500);
      
      setTimeout(() => {
        showFourthParagraph.value = true;
      }, 3500);
    }
  }, 100);
};

// Cursor blink effect
const startCursorBlink = () => {
  setInterval(() => {
    showCursor.value = !showCursor.value;
  }, 500);
};

// Lifecycle hooks
onMounted(() => {
  translateX.value = calculateTranslateX();
  startAutoRotation();
  startTypewriter();
  startCursorBlink();
  
  const handleResize = () => {
    translateX.value = calculateTranslateX();
  };
  
  window.addEventListener('resize', handleResize);
  
  onUnmounted(() => {
    stopAutoRotation();
    window.removeEventListener('resize', handleResize);
  });
});

const handleMouseEnter = () => {
  stopAutoRotation();
};

const handleMouseLeave = () => {
  startAutoRotation();
};
</script>

<style scoped>
/* Typewriter Animation */
.typewriter {
  display: inline-block;
}

.typing {
  border-right: 2px solid #6366f1;
}

.cursor {
  font-weight: 100;
  color: #6366f1;
}

.cursor.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Paragraph Animations */
.animated-paragraph {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.animated-paragraph.fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  /* Hide the vertical scroll on mobile for better performance */
  .absolute.right-0 {
    display: none;
  }
}

@media (max-width: 768px) {
  /* Stack testimonials vertically on mobile */
  .absolute.right-0 {
    position: relative;
    width: 100%;
    height: 300px;
    margin-top: 2rem;
    display: block;
  }
  
  .absolute.right-0 .flex.flex-col {
    flex-direction: row;
    width: max-content;
  }
  
  .absolute.right-0 .w-80 {
    width: 280px;
  }
}
</style>