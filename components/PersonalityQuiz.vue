<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
    <!-- Animated Background Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="particle in particles"
        :key="particle.id"
        :class="`absolute ${particle.color} rounded-full opacity-20 animate-float`"
        :style="{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animationDuration: `${particle.duration}s`,
          animationDelay: `${particle.delay}s`
        }"
      />
    </div>

    <!-- Morphing Background Blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 blur-xl animate-morphing animate-pulse-slow" />
      <div class="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 blur-lg animate-bounce-slow" />
      <div class="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-500/20 blur-2xl animate-spin-slow" />
      <div class="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-500/20 blur-lg animate-pulse-slow" />
      <div class="absolute top-1/2 left-1/2 w-36 h-36 bg-cyan-500/10 blur-3xl animate-morphing transform -translate-x-1/2 -translate-y-1/2" />
    </div>

    <div class="relative z-10 container mx-auto px-4 py-4 sm:py-8 min-h-screen flex flex-col">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-12 animate-bounce-in">
        <div 
          :class="`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-2xl animate-spin-hover ${isAnimating ? 'animate-spin' : ''}`"
        >
          <span class="text-2xl sm:text-3xl animate-pulse">🏥</span>
        </div>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-4 animate-gradient">
          Medical Specialty Quiz
        </h1>
        <p class="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Discover your medical calling! 
          <span class="text-cyan-400 font-semibold animate-pulse"> Just for fun!</span>
        </p>
      </div>

      <!-- Start Screen -->
      <div 
        v-if="currentState === 'start'" 
        :class="`flex-1 flex items-center justify-center transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`"
      >
        <div class="w-full max-w-2xl mx-auto text-center animate-float-up">
          <div class="glass glass-hover rounded-3xl shadow-2xl p-6 sm:p-12 hover:scale-105 transition-all duration-500">
            <div class="mb-6 sm:mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mb-4 sm:mb-6 shadow-xl animate-bounce-gentle">
                <span class="text-4xl sm:text-5xl animate-pulse">💝</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 animate-slide-in">
                Ready to Discover Your Medical Calling?
              </h2>
              <p class="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-lg mx-auto animate-slide-in-delay">
                Answer 8 fun questions and we'll reveal which medical specialty aligns with your personality!
              </p>
            </div>
            <button 
              @click="startQuiz"
              class="group bg-gradient-to-r text-sm from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white sm:text-xl font-bold py-3 px-8 sm:px-12 rounded-full shadow-xl transform hover:scale-110 transition-all duration-300 hover:shadow-2xl animate-bounce-gentle"
            >
              <span class="flex items-center justify-center">
                Start Quiz
                <span class="ml-3 text-2xl group-hover:animate-bounce">🚀</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Questions -->
      <div ``
        v-if="currentState === 'quiz'" 
        :class="`flex-1 flex flex-col transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`"
      >
        <div class="glass rounded-3xl shadow-2xl p-4 sm:p-8 flex-1 flex flex-col">
          <!-- Progress Bar -->
          <div class="mb-6 sm:mb-8 animate-slide-in">
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm font-semibold text-cyan-400">
                Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
              </span>
              <span class="text-sm font-semibold text-purple-400">
                {{ progressPercentage }}% Complete
              </span>
            </div>
            <div class="w-full bg-gray-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
              <div 
                class="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out animate-shimmer"
                :style="{ width: `${progressPercentage}%` }"
              />
            </div>
          </div>

          <!-- Current Question -->
          <div class="flex-1 flex flex-col">
            <div class="mb-6 sm:mb-8 animate-slide-in-up" :key="currentQuestionIndex">
              <h3 class="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
                {{ currentQuestion?.question }}
              </h3>
              
              <div class="space-y-3 sm:space-y-4">
                <button
                  v-for="(option, index) in currentQuestion?.options"
                  :key="index"
                  @click="selectAnswer(option.specialty)"
                  class="group w-full text-left glass glass-hover rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 transform animate-slide-in-stagger"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600/50 to-gray-700/50 group-hover:from-cyan-500/50 group-hover:to-purple-500/50 rounded-full flex items-center justify-center mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110">
                      <span class="text-lg sm:text-xl group-hover:animate-bounce">
                        {{ option.icon || String.fromCharCode(65 + index) }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <p class="text-base sm:text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
                        {{ option.text }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <span class="text-2xl group-hover:animate-bounce">➡️</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Screen -->
      <div 
        v-if="currentState === 'results' && result" 
        :class="`flex-1 flex items-center justify-center transition-all duration-500 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`"
      >
        <div class="w-full max-w-4xl mx-auto">
          <div class="glass rounded-3xl shadow-2xl p-6 sm:p-12 text-center animate-float-up">
            <!-- Celebration Animation -->
            <div class="mb-6 sm:mb-8 relative animate-bounce-in">
              <div :class="`inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${result.color} rounded-full mb-4 sm:mb-6 shadow-2xl animate-spin-slow`">
                <span class="text-4xl sm:text-6xl animate-pulse">{{ result.icon }}</span>
              </div>
              <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div class="flex space-x-2">
                  <div 
                    v-for="i in 3"
                    :key="i"
                    class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-ping" 
                    :style="{ animationDelay: `${(i-1) * 0.2}s` }"
                  />
                </div>
              </div>
            </div>

            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-4 animate-slide-in">
              Your Perfect Match:
            </h2>
            <h3 class="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 animate-slide-in-delay">
              {{ result.specialty }}
            </h3>
            <p class="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-in-delay">
              {{ result.description }}
            </p>
            
            <div class="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-cyan-400/20 animate-float">
              <h4 class="text-lg font-bold text-white mb-3">Why this matches you:</h4>
              <ul class="text-gray-300 space-y-2">
                <li 
                  v-for="(trait, index) in result.traits"
                  :key="trait" 
                  class="flex items-center text-sm sm:text-base animate-slide-in-stagger"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <span class="text-green-400 mr-3 flex-shrink-0 text-lg animate-bounce-gentle">✅</span>
                  {{ trait }}
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up">
              <button 
                @click="restartQuiz"
                class="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-lg border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span class="flex items-center justify-center">
                  🔄 Take Quiz Again
                </span>
              </button>
              <button class="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span class="flex items-center justify-center">
                  📚 Learn More
                </span>
              </button>
            </div>

            <!-- Call to Action -->
            <div class="mt-8 bg-gradient-to-r from-pink-100/10 to-purple-100/10 rounded-2xl p-6 sm:p-8 border-2 border-pink-200/20 animate-pulse-soft">
              <div class="flex items-center justify-center mb-4">
                <span class="text-3xl sm:text-4xl mr-3">🗳️</span>
                <h4 class="text-xl sm:text-2xl font-bold text-white">Found Your Match?</h4>
              </div>
              <p class="text-base sm:text-lg text-gray-300 mb-6">
                Now help me find mine! If you enjoyed this quiz, please consider voting for 
                <span class="font-bold text-purple-300">[Your Name]</span> in the upcoming election!
              </p>
              <button class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-bounce-gentle">
                <span class="flex items-center justify-center">
                  🌟 Support [Your Name]
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface QuizOption {
  text: string;
  specialty: string;
  icon: string;
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
  color: string;
}

type QuizState = 'start' | 'quiz' | 'results';

// Reactive state
const currentState = ref<QuizState>('start');
const currentQuestionIndex = ref<number>(0);
const answers = ref<string[]>([]);
const result = ref<QuizResult | null>(null);
const particles = ref<Particle[]>([]);
const isAnimating = ref<boolean>(false);

// Quiz data
const questions: QuizQuestion[] = [
  {
    question: "You're at a party and someone asks about your ideal weekend. What sounds most appealing?",
    options: [
      { text: "Performing on stage or speaking to a large crowd", specialty: "surgery", icon: "🎭" },
      { text: "Having deep, meaningful one-on-one conversations", specialty: "psychiatry", icon: "💬" },
      { text: "Organizing a community event or helping neighbors", specialty: "family", icon: "🏘️" },
      { text: "Solving puzzles or playing strategy games", specialty: "radiology", icon: "🧩" }
    ]
  },
  {
    question: "In a crisis situation, you're most likely to:",
    options: [
      { text: "Take immediate action and lead the response", specialty: "emergency", icon: "⚡" },
      { text: "Stay calm and analyze the situation thoroughly", specialty: "pathology", icon: "🔍" },
      { text: "Focus on comforting and supporting others", specialty: "pediatrics", icon: "🤗" },
      { text: "Look for the root cause and long-term solutions", specialty: "internal", icon: "🎯" }
    ]
  },
  {
    question: "Your friends describe you as someone who:",
    options: [
      { text: "Has steady hands and incredible precision", specialty: "surgery", icon: "✋" },
      { text: "Remembers everyone's stories and personal details", specialty: "family", icon: "📚" },
      { text: "Can spot patterns others miss", specialty: "radiology", icon: "👁️" },
      { text: "Thrives under pressure and tight deadlines", specialty: "emergency", icon: "⏱️" }
    ]
  },
  {
    question: "If you could have a superpower, which would you choose?",
    options: [
      { text: "X-ray vision to see what others can't", specialty: "radiology", icon: "👀" },
      { text: "Mind reading to understand people's thoughts", specialty: "psychiatry", icon: "🧠" },
      { text: "Healing touch to cure any ailment", specialty: "internal", icon: "✨" },
      { text: "Time manipulation to work efficiently under pressure", specialty: "surgery", icon: "⏰" }
    ]
  },
  {
    question: "Your ideal work environment is:",
    options: [
      { text: "A quiet space where I can focus and analyze", specialty: "pathology", icon: "🔬" },
      { text: "A dynamic place with constant variety and challenges", specialty: "emergency", icon: "🌪️" },
      { text: "Somewhere I can build long-term relationships", specialty: "family", icon: "🏠" },
      { text: "A place where precision and skill are paramount", specialty: "surgery", icon: "🎯" }
    ]
  },
  {
    question: "When learning something new, you prefer to:",
    options: [
      { text: "Practice hands-on until I master the technique", specialty: "surgery", icon: "🛠️" },
      { text: "Study the theory and understand the 'why'", specialty: "internal", icon: "📖" },
      { text: "Learn through stories and case studies", specialty: "psychiatry", icon: "📝" },
      { text: "See visual examples and patterns", specialty: "radiology", icon: "📊" }
    ]
  },
  {
    question: "At a family gathering, you're the person who:",
    options: [
      { text: "Keeps everyone entertained with stories", specialty: "pediatrics", icon: "🎪" },
      { text: "Notices when someone seems upset and checks on them", specialty: "psychiatry", icon: "💝" },
      { text: "Helps coordinate activities and keeps things organized", specialty: "family", icon: "📋" },
      { text: "Jumps in immediately when someone gets hurt", specialty: "emergency", icon: "🏃" }
    ]
  },
  {
    question: "Your biggest strength in teamwork is:",
    options: [
      { text: "Making quick decisions when time is critical", specialty: "emergency", icon: "⚡" },
      { text: "Providing detailed analysis and insights", specialty: "pathology", icon: "🔍" },
      { text: "Being the steady, reliable foundation others depend on", specialty: "family", icon: "🗿" },
      { text: "Bringing calm energy and emotional intelligence", specialty: "internal", icon: "🧘" }
    ]
  }
];

const specialtyResults: Record<string, QuizResult> = {
  surgery: {
    specialty: "Surgery",
    description: "You're a natural leader with incredible focus and precision. You thrive under pressure and aren't afraid to take decisive action when it matters most.",
    traits: ["Exceptional hand-eye coordination", "Natural leadership abilities", "Thrives under high pressure", "Detail-oriented perfectionist"],
    icon: "🔪",
    color: "from-red-500 to-orange-500"
  },
  emergency: {
    specialty: "Emergency Medicine",
    description: "You're energized by variety and unpredictability. Your quick thinking and ability to stay calm in chaos makes you perfect for high-stakes situations.",
    traits: ["Excellent crisis management", "Adapts quickly to change", "Strong decision-making under pressure", "Natural problem-solver"],
    icon: "🚨",
    color: "from-yellow-500 to-red-500"
  },
  psychiatry: {
    specialty: "Psychiatry",
    description: "You have exceptional emotional intelligence and a natural gift for understanding what makes people tick. You're a compassionate listener who helps others heal.",
    traits: ["High emotional intelligence", "Excellent listening skills", "Natural empathy and compassion", "Pattern recognition in behavior"],
    icon: "🧠",
    color: "from-purple-500 to-pink-500"
  },
  pediatrics: {
    specialty: "Pediatrics",
    description: "You bring joy and comfort to others, especially in difficult times. Your nurturing nature and ability to connect with people of all ages is your superpower.",
    traits: ["Natural nurturing instincts", "Great with communication", "Patience and understanding", "Ability to bring comfort to others"],
    icon: "👶",
    color: "from-green-500 to-teal-500"
  },
  family: {
    specialty: "Family Medicine",
    description: "You're the steady, reliable person everyone turns to. You excel at building long-term relationships and seeing the big picture of people's lives.",
    traits: ["Builds strong long-term relationships", "Excellent organizational skills", "Holistic thinking approach", "Natural coordinator and planner"],
    icon: "👨‍👩‍👧‍👦",
    color: "from-blue-500 to-indigo-500"
  },
  internal: {
    specialty: "Internal Medicine",
    description: "You love diving deep into complex problems and getting to the root of things. Your analytical mind and systematic approach makes you a diagnostic detective.",
    traits: ["Loves complex problem-solving", "Systematic and methodical", "Strong analytical thinking", "Patient and thorough investigator"],
    icon: "🔍",
    color: "from-indigo-500 to-purple-500"
  },
  radiology: {
    specialty: "Radiology",
    description: "You have an incredible eye for detail and can see patterns others miss. You prefer working behind the scenes but play a crucial role in solving medical mysteries.",
    traits: ["Exceptional pattern recognition", "Strong visual-spatial skills", "Detail-oriented analysis", "Enjoys working independently"],
    icon: "📸",
    color: "from-cyan-500 to-blue-500"
  },
  pathology: {
    specialty: "Pathology",
    description: "You're fascinated by the science behind everything. Your methodical nature and love of research makes you perfect for uncovering the truth through careful analysis.",
    traits: ["Strong research and analysis skills", "Methodical and precise", "Scientific curiosity", "Attention to microscopic details"],
    icon: "🔬",
    color: "from-teal-500 to-green-500"
  }
};

// Computed properties
const progressPercentage = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / questions.length) * 100);
});

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value];
});

// Methods
const generateParticles = (): void => {
  const colors = ['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-cyan-400', 'bg-teal-400'];
  const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));
  particles.value = newParticles;
};

const startQuiz = (): void => {
  isAnimating.value = true;
  setTimeout(() => {
    currentState.value = 'quiz';
    currentQuestionIndex.value = 0;
    answers.value = [];
    isAnimating.value = false;
  }, 500);
};

const selectAnswer = (specialty: string): void => {
  isAnimating.value = true;
  const newAnswers = [...answers.value, specialty];
  answers.value = newAnswers;
  
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.length - 1) {
      currentQuestionIndex.value++;
    } else {
      calculateResult(newAnswers);
    }
    isAnimating.value = false;
  }, 300);
};

const calculateResult = (finalAnswers: string[]): void => {
  const specialtyCounts: Record<string, number> = {};
  finalAnswers.forEach(answer => {
    specialtyCounts[answer] = (specialtyCounts[answer] || 0) + 1;
  });
  
  const topSpecialty = Object.entries(specialtyCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  result.value = specialtyResults[topSpecialty];
  currentState.value = 'results';
};

const restartQuiz = (): void => {
  isAnimating.value = true;
  setTimeout(() => {
    currentState.value = 'start';
    currentQuestionIndex.value = 0;
    answers.value = [];
    result.value = null;
    isAnimating.value = false;
  }, 500);
};

// Lifecycle
onMounted(() => {
  generateParticles();
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes float-up {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0px); opacity: 1; }
}

@keyframes slide-in {
  0% { transform: translateX(-50px); opacity: 0; }
  100% { transform: translateX(0px); opacity: 1; }
}

@keyframes slide-in-up {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0px); opacity: 1; }
}

@keyframes slide-in-delay {
  0% { transform: translateX(-30px); opacity: 0; }
  100% { transform: translateX(0px); opacity: 1; }
}

@keyframes slide-in-stagger {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0px); opacity: 1; }
}

@keyframes bounce-in {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}

@keyframes pulse-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spin-hover {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes morphing {
  0%, 100% { border-radius: 50% 30% 70% 40%; }
  25% { border-radius: 30% 60% 40% 70%; }
  50% { border-radius: 70% 40% 30% 60%; }
  75% { border-radius: 40% 70% 60% 30%; }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-float-up { animation: float-up 0.6s ease-out; }
.animate-slide-in { animation: slide-in 0.6s ease-out; }
.animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
.animate-slide-in-delay { animation: slide-in-delay 0.8s ease-out; }
.animate-slide-in-stagger { animation: slide-in-stagger 0.4s ease-out forwards; opacity: 0; }
.animate-bounce-in { animation: bounce-in 0.8s ease-out; }
.animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
.animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
.animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
.animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }

</style>