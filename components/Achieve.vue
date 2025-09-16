<template>
  <div class="py-20">
    <!-- Achievements Title -->
    <div class="text-center my-16">
      <h2 class="text-3xl font-bold text-gray-800">My Achievements & Roles</h2>
      <p class="text-gray-700 mt-2">Here are a few of the roles I've been privileged to take on</p>
    </div>

    <!-- Carousel Container -->
    <div class="relative overflow-hidden">
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
                ? 'bg-white border-2 border-dashed border-yellow-400 shadow-2xl' 
                : 'bg-gray-800 hover:bg-gray-700'
            ]"
          >
            <!-- Background Image/Pattern -->
            <div 
              class="absolute inset-0 opacity-20"
              :class="isActive(index) ? 'bg-gradient-to-br from-yellow-100 to-lime-100' : 'bg-gradient-to-br from-gray-600 to-gray-800'"
            ></div>
            
            <!-- Default State - Image -->
            <div 
              v-if="!isActive(index)"
              class="relative z-10 h-full flex flex-col justify-center items-center p-6"
            >
              <!-- Placeholder Avatar/Image -->
              <div class="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <img class="rounded-full" v-if="achievement.organization === 'COMPSSA'" src="@/assets/img/compassa-logo.jpeg" />
                <img class="rounded-full" v-else src="@/assets/img/nunsa.jpeg" />
              </div>
              <!-- Organization Badge -->
              <div class="px-3 py-1 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full">
                {{ achievement.organization }}
                <!-- {{ getOrganizationTag(achievement.organization) }} -->
              </div>
            </div>

            <!-- Active State - Text Content -->
            <div 
              v-else
              class="relative z-10 h-full flex flex-col p-6 overflow-y-auto"
            >
              <!-- Header with Icon -->
              <div class="flex items-start mb-4">
                <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          :d="getIconPath(achievement.organization)"></path>
                  </svg>
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
    <!-- <div class="flex justify-center space-x-1 mt-8 max-w-4xl mx-auto flex-wrap">
      <button
        v-for="(achievement, index) in achievements"
        :key="index"
        @click="setActiveIndex(index)"
        class="w-2 h-2 rounded-full transition-colors duration-300 m-1"
        :class="activeIndex === index ? 'bg-gray-800' : 'bg-gray-400'"
      ></button>
    </div>

    <div class="text-center mt-4">
      <p class="text-gray-700">
        <span class="font-bold">{{ activeIndex + 1 }}</span> of <span class="font-bold">{{ achievements.length }}</span> achievements
      </p>
    </div> -->
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
const cardWidth = 272; // 64*4 + margin
const activeCardWidth = 336; // 80*4 + margin

// Helper functions
const getOrganizationTag = (org: string): string => {
  const tags: Record<string, string> = {
    'NUNSA Unilag': 'NUNSA',
    'COMPSSA': 'COMP',
    'NUNSA National': 'NATIONAL'
  };
  return tags[org] || 'ORG';
};

const getIconPath = (org: string): string => {
  const icons: Record<string, string> = {
    'NUNSA Unilag': "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
    'COMPSSA': "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547A8.014 8.014 0 004 21h16a8.014 8.014 0 00-.244-5.757zM12 7a3 3 0 100-6 3 3 0 000 6z",
    'NUNSA National': "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  };
  return icons[org] || "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
};

// Calculate translate position
const calculateTranslateX = () => {
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const centerOffset = containerWidth / 2;
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

// Auto-rotation with 5 second intervals
let intervalId: NodeJS.Timeout;

const startAutoRotation = () => {
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % achievements.length;
    translateX.value = calculateTranslateX();
  }, 5000); // Changed to 5 seconds
};

const stopAutoRotation = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

// Lifecycle hooks
onMounted(() => {
  translateX.value = calculateTranslateX();
  startAutoRotation();
  
  // Handle window resize
  const handleResize = () => {
    translateX.value = calculateTranslateX();
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup on unmount
  onUnmounted(() => {
    stopAutoRotation();
    window.removeEventListener('resize', handleResize);
  });
});

// Pause rotation on hover
const handleMouseEnter = () => {
  stopAutoRotation();
};

const handleMouseLeave = () => {
  startAutoRotation();
};
</script>

<style scoped>
/* Custom scrollbar for active cards */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #fbbf24;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}
</style>