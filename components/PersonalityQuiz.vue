<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
    <!-- Floating Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-lg animate-bounce"></div>
      <div class="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl animate-ping"></div>
      <div class="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/30 rounded-full blur-lg animate-pulse"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-down">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Medical Specialty Quiz
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover which medical specialty matches your unique personality! 
          <span class="text-purple-600 font-semibold">Just for fun!</span>
        </p>
      </div>

      <!-- Quiz Container -->
      <div class="max-w-4xl mx-auto">
        <!-- Start Screen -->
        <div v-if="currentState === 'start'" class="text-center animate-fade-in">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/50">
            <div class="mb-8">
              <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mb-6 shadow-xl animate-pulse">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-800 mb-4">Ready to Discover Your Medical Calling?</h2>
              <p class="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                Answer 8 fun questions and we'll reveal which medical specialty aligns with your personality traits!
              </p>
            </div>
            <button 
              @click="startQuiz" 
              class="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <span class="flex items-center">
                Start Quiz
                <svg class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>

        <!-- Quiz Questions -->
        <div v-if="currentState === 'quiz'" class="animate-fade-in">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
            <!-- Progress Bar -->
            <div class="mb-8">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-semibold text-gray-600">Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
                <span class="text-sm font-semibold text-purple-600">{{ Math.round(((currentQuestionIndex + 1) / questions.length) * 100) }}% Complete</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-700 ease-out"
                  :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Current Question -->
            <div class="mb-8 animate-slide-in" :key="currentQuestionIndex">
              <h3 class="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                {{ questions[currentQuestionIndex].question }}
              </h3>
              
              <div class="space-y-4">
                <button
                  v-for="(option, index) in questions[currentQuestionIndex].options"
                  :key="index"
                  @click="selectAnswer(option.specialty)"
                  class="group w-full text-left bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-blue-100 rounded-full flex items-center justify-center mr-4 transition-all duration-300">
                      <span class="text-2xl">{{ String.fromCharCode(65 + index) }}</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                        {{ option.text }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <svg class="w-6 h-6 text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Screen -->
        <div v-if="currentState === 'results'" class="animate-fade-in">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-white/50 text-center">
            <!-- Celebration Animation -->
            <div class="mb-8 relative">
              <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-full mb-6 shadow-2xl animate-bounce">
                <span class="text-6xl">{{ result.icon }}</span>
              </div>
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div class="flex space-x-2">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full animate-ping" style="animation-delay: 0s"></div>
                  <div class="w-3 h-3 bg-orange-400 rounded-full animate-ping" style="animation-delay: 0.2s"></div>
                  <div class="w-3 h-3 bg-red-400 rounded-full animate-ping" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>

            <h2 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Your Perfect Match:
            </h2>
            <h3 class="text-3xl font-bold text-gray-800 mb-6">{{ result.specialty }}</h3>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">{{ result.description }}</p>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Why this matches you:</h4>
              <ul class="text-gray-700 space-y-2">
                <li v-for="trait in result.traits" :key="trait" class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  {{ trait }}
                </li>
              </ul>
            </div>

            <!-- Call to Action -->
            <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 border-2 border-pink-200 animate-pulse-soft">
              <div class="flex items-center justify-center mb-4">
                <span class="text-4xl mr-3">🗳️</span>
                <h4 class="text-2xl font-bold text-gray-800">Found Your Match?</h4>
              </div>
              <p class="text-lg text-gray-700 mb-6">
                Now help me find mine! If you enjoyed this quiz, please consider voting for 
                <span class="font-bold text-purple-700">[Your Name]</span> in the upcoming election!
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  @click="restartQuiz"
                  class="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105"
                >
                  Take Quiz Again
                </button>
                <button class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Learn More About [Your Name]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface QuizOption {
  text: string;
  specialty: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface QuizResult {
  specialty: string;
  description: string;
  traits: string[];
  icon: string;
}

// Reactive state
const currentState = ref<'start' | 'quiz' | 'results'>('start');
const currentQuestionIndex = ref(0);
const answers = ref<string[]>([]);

// Quiz questions with creative scenarios
const questions: QuizQuestion[] = [
  {
    question: "You're at a party and someone asks about your ideal weekend. What sounds most appealing?",
    options: [
      { text: "Performing on stage or speaking to a large crowd", specialty: "surgery" },
      { text: "Having deep, meaningful one-on-one conversations", specialty: "psychiatry" },
      { text: "Organizing a community event or helping neighbors", specialty: "family" },
      { text: "Solving puzzles or playing strategy games", specialty: "radiology" }
    ]
  },
  {
    question: "In a crisis situation, you're most likely to:",
    options: [
      { text: "Take immediate action and lead the response", specialty: "emergency" },
      { text: "Stay calm and analyze the situation thoroughly", specialty: "pathology" },
      { text: "Focus on comforting and supporting others", specialty: "pediatrics" },
      { text: "Look for the root cause and long-term solutions", specialty: "internal" }
    ]
  },
  {
    question: "Your friends describe you as someone who:",
    options: [
      { text: "Has steady hands and incredible precision", specialty: "surgery" },
      { text: "Remembers everyone's stories and personal details", specialty: "family" },
      { text: "Can spot patterns others miss", specialty: "radiology" },
      { text: "Thrives under pressure and tight deadlines", specialty: "emergency" }
    ]
  },
  {
    question: "If you could have a superpower, which would you choose?",
    options: [
      { text: "X-ray vision to see what others can't", specialty: "radiology" },
      { text: "Mind reading to understand people's thoughts", specialty: "psychiatry" },
      { text: "Healing touch to cure any ailment", specialty: "internal" },
      { text: "Time manipulation to work efficiently under pressure", specialty: "surgery" }
    ]
  },
  {
    question: "Your ideal work environment is:",
    options: [
      { text: "A quiet space where I can focus and analyze", specialty: "pathology" },
      { text: "A dynamic place with constant variety and challenges", specialty: "emergency" },
      { text: "Somewhere I can build long-term relationships", specialty: "family" },
      { text: "A place where precision and skill are paramount", specialty: "surgery" }
    ]
  },
  {
    question: "When learning something new, you prefer to:",
    options: [
      { text: "Practice hands-on until I master the technique", specialty: "surgery" },
      { text: "Study the theory and understand the 'why'", specialty: "internal" },
      { text: "Learn through stories and case studies", specialty: "psychiatry" },
      { text: "See visual examples and patterns", specialty: "radiology" }
    ]
  },
  {
    question: "At a family gathering, you're the person who:",
    options: [
      { text: "Keeps everyone entertained with stories", specialty: "pediatrics" },
      { text: "Notices when someone seems upset and checks on them", specialty: "psychiatry" },
      { text: "Helps coordinate activities and keeps things organized", specialty: "family" },
      { text: "Jumps in immediately when someone gets hurt", specialty: "emergency" }
    ]
  },
  {
    question: "Your biggest strength in teamwork is:",
    options: [
      { text: "Making quick decisions when time is critical", specialty: "emergency" },
      { text: "Providing detailed analysis and insights", specialty: "pathology" },
      { text: "Being the steady, reliable foundation others depend on", specialty: "family" },
      { text: "Bringing calm energy and emotional intelligence", specialty: "internal" }
    ]
  }
];

// Specialty results with detailed descriptions
const specialtyResults: Record<string, QuizResult> = {
  surgery: {
    specialty: "Surgery",
    description: "You're a natural leader with incredible focus and precision. You thrive under pressure and aren't afraid to take decisive action when it matters most.",
    traits: ["Exceptional hand-eye coordination", "Natural leadership abilities", "Thrives under high pressure", "Detail-oriented perfectionist"],
    icon: "🔪"
  },
  emergency: {
    specialty: "Emergency Medicine",
    description: "You're energized by variety and unpredictability. Your quick thinking and ability to stay calm in chaos makes you perfect for high-stakes situations.",
    traits: ["Excellent crisis management", "Adapts quickly to change", "Strong decision-making under pressure", "Natural problem-solver"],
    icon: "🚨"
  },
  psychiatry: {
    specialty: "Psychiatry",
    description: "You have exceptional emotional intelligence and a natural gift for understanding what makes people tick. You're a compassionate listener who helps others heal.",
    traits: ["High emotional intelligence", "Excellent listening skills", "Natural empathy and compassion", "Pattern recognition in behavior"],
    icon: "🧠"
  },
  pediatrics: {
    specialty: "Pediatrics",
    description: "You bring joy and comfort to others, especially in difficult times. Your nurturing nature and ability to connect with people of all ages is your superpower.",
    traits: ["Natural nurturing instincts", "Great with communication", "Patience and understanding", "Ability to bring comfort to others"],
    icon: "👶"
  },
  family: {
    specialty: "Family Medicine",
    description: "You're the steady, reliable person everyone turns to. You excel at building long-term relationships and seeing the big picture of people's lives.",
    traits: ["Builds strong long-term relationships", "Excellent organizational skills", "Holistic thinking approach", "Natural coordinator and planner"],
    icon: "👨‍👩‍👧‍👦"
  },
  internal: {
    specialty: "Internal Medicine",
    description: "You love diving deep into complex problems and getting to the root of things. Your analytical mind and systematic approach makes you a diagnostic detective.",
    traits: ["Loves complex problem-solving", "Systematic and methodical", "Strong analytical thinking", "Patient and thorough investigator"],
    icon: "🔍"
  },
  radiology: {
    specialty: "Radiology",
    description: "You have an incredible eye for detail and can see patterns others miss. You prefer working behind the scenes but play a crucial role in solving medical mysteries.",
    traits: ["Exceptional pattern recognition", "Strong visual-spatial skills", "Detail-oriented analysis", "Enjoys working independently"],
    icon: "📸"
  },
  pathology: {
    specialty: "Pathology",
    description: "You're fascinated by the science behind everything. Your methodical nature and love of research makes you perfect for uncovering the truth through careful analysis.",
    traits: ["Strong research and analysis skills", "Methodical and precise", "Scientific curiosity", "Attention to microscopic details"],
    icon: "🔬"
  }
};

const result = ref<QuizResult | null>(null);

const startQuiz = () => {
  currentState.value = 'quiz';
  currentQuestionIndex.value = 0;
  answers.value = [];
};

const selectAnswer = (specialty: string) => {
  answers.value.push(specialty);
  
  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value++;
  } else {
    calculateResult();
  }
};

const calculateResult = () => {
  // Count occurrences of each specialty
  const specialtyCounts: Record<string, number> = {};
  answers.value.forEach(answer => {
    specialtyCounts[answer] = (specialtyCounts[answer] || 0) + 1;
  });
  
  // Find the specialty with the highest count
  const topSpecialty = Object.entries(specialtyCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  result.value = specialtyResults[topSpecialty];
  currentState.value = 'results';
};

const restartQuiz = () => {
  currentState.value = 'start';
  currentQuestionIndex.value = 0;
  answers.value = [];
  result.value = null;
};
</script>

<style scoped>
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-soft {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out;
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #7c3aed, #db2777);
}
</style>