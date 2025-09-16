<template>
  <section class="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 lg:py-24 overflow-hidden min-h-screen">
    <!-- Floating particles -->
    <div class="particle particle-1"></div>
    <div class="particle particle-2"></div>
    <div class="particle particle-3"></div>
    
    <!-- Animated background blobs -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full animate-morphBlob transform translate-x-32 -translate-y-32"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full animate-morphBlob transform -translate-x-24 translate-y-24 animation-delay-2s"></div>
    <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full animate-float transform -translate-x-1/2 -translate-y-1/2"></div>
    
    <!-- Sparkle effects -->
    <div class="absolute top-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-sparkle delay-100"></div>
    <div class="absolute top-40 right-32 w-2 h-2 bg-pink-400 rounded-full animate-sparkle delay-500"></div>
    <div class="absolute bottom-40 left-40 w-4 h-4 bg-blue-400 rounded-full animate-sparkle delay-1000"></div>

    <!-- Mouse sparkles container -->
    <div ref="sparkleContainer" class="fixed inset-0 pointer-events-none z-50"></div>

    <div class="container mx-auto px-4 lg:px-8 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Content - Images -->
        <div class="lg:col-span-6 relative" :class="{ 'opacity-0': !isVisible, 'animate-slideInLeft': isVisible }">
          <div class="relative transform-3d">
            <!-- Main candidate image with 3D effect -->
            <div 
              class="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover-lift hover:rotate-0 transition-all duration-700 cursor-pointer"
              @mouseenter="handleImageHover"
            >
              <div class="w-full h-96 lg:h-[500px] bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex items-center justify-center">
                <img src="@/assets/img/personal/user2.jpg" />
                <!-- <div class="text-center">
                  <div class="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center animate-pulse3D">
                    <span class="text-4xl font-bold text-white">{{ candidateInitials }}</span>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-800 handwriting-fancy animate-fadeInUp delay-500">{{ candidateName }}</h3>
                  <p class="text-lg text-gray-600 handwriting animate-fadeInUp delay-700">{{ candidateTitle }}</p>
                </div> -->
              </div>
              <!-- Animated accent bar -->
              <div class="absolute top-0 left-0 w-6 h-full bg-gradient-to-b from-red-500 via-red-400 to-red-600 animate-pulse"></div>
            </div>

            <!-- Secondary image - bottom left with enhanced animation -->
            <div class="absolute -bottom-8 -left-8 z-20 w-48 h-32 bg-white rounded-xl shadow-2xl overflow-hidden transform -rotate-2 hover-lift hover:rotate-0 transition-all duration-500 animate-scaleIn delay-300">
              <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl mb-1">🔥</div>
                  <p class="text-sm font-bold text-gray-700 handwriting">{{ visionName }}</p>
                </div>
              </div>
              <!-- Election badge with animation -->
              <div class="absolute bottom-2 left-2 bg-white rounded-full px-3 py-1 shadow-lg animate-bounce delay-1000">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span class="text-white text-xs font-bold">C</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-800 handwriting">{{ organizationName }}</span>
                </div>
              </div>
            </div>

            <!-- Enhanced decorative elements -->
            <div class="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-60">
              <div class="grid grid-cols-4 gap-3">
                <div 
                  v-for="(dot, index) in decorativeDots" 
                  :key="index"
                  :class="dot.classes"
                  :style="{ animationDelay: dot.delay }"
                ></div>
              </div>
            </div>

            <!-- Floating animation elements -->
            <div class="absolute -top-6 right-12 w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-float animation-delay-1000"></div>
            <div class="absolute bottom-12 -right-6 w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-float animation-delay-2000"></div>
            
            <!-- SVG handwriting decoration -->
            <svg class="absolute -top-10 -left-10 w-32 h-32 text-red-300 opacity-60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="handwriting-svg" d="M10,50 Q30,10 50,50 T90,30" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
        </div>

        <!-- Right Content - Campaign Message -->
        <div class="lg:col-span-6 space-y-8" :class="{ 'opacity-0': !isVisible, 'animate-slideInRight delay-300': isVisible }">
          <!-- Animated header badge -->
          <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-scaleIn delay-500 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <span class="animate-pulse">🔥</span>
            <span class="handwriting font-semibold">{{ headerBadgeText }}</span>
          </div>

          <!-- Main heading with typewriter effect -->
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fadeInUp delay-700">
              {{ mainHeading.part1 }}
              <span 
                class="handwriting-fancy gradient-text text-5xl lg:text-7xl block"
                :class="{ 'typewriter': showTypewriter }"
              >
                {{ mainHeading.part2 }}
              </span>
            </h1>
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-700 handwriting animate-fadeInUp delay-1000">
              {{ subHeading }} 🎓
            </h2>
          </div>

          <!-- Animated divider with SVG -->
          <div class="relative animate-fadeInUp delay-1200">
            <div class="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
            <svg class="absolute -top-2 -right-4 w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>

          <!-- Enhanced description with handwriting highlights -->
          <div class="space-y-6 animate-fadeInUp delay-1500">
            <p class="text-gray-600 text-lg leading-relaxed">
              Through my service in 
              <span class="handwriting-fancy text-xl font-semibold text-red-600 relative">
                {{ serviceOrganizations }}
                <svg class="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path class="handwriting-svg" d="M0,8 Q50,0 100,8" stroke="#ef4444" stroke-width="2" fill="none" opacity="0.6"/>
                </svg>
              </span>, 
              I discovered that leadership is not about the positions I have been opportune to hold, but about the 
              <span class="handwriting font-semibold text-blue-700">{{ leadershipFocus }}</span>, 
              their struggles, their victories, and their need for support.
            </p>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover-lift">
              <p class="text-gray-700 italic handwriting text-xl leading-relaxed">
                "{{ inspirationalQuote.text }}
                <span class="font-bold text-red-600 handwriting-fancy text-2xl">{{ inspirationalQuote.highlight }}</span>."
              </p>
            </div>

            <!-- F.L.A.M.E preview with animations -->
            <div class="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-6 border-2 border-red-200 animate-pulse3D">
              <h3 class="handwriting-fancy text-2xl font-bold text-gray-800 mb-4 gradient-text">{{ visionTitle }}:</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  v-for="(item, index) in flameVision" 
                  :key="index"
                  class="flex items-center space-x-2 animate-fadeInUp"
                  :class="`delay-${(index + 1) * 100}`"
                >
                  <span class="text-2xl">{{ item.emoji }}</span>
                  <span :class="`handwriting font-semibold ${item.color}`">{{ item.text }}</span>
                </div>
              </div>
            </div>
            
            <!-- Call to action with animation -->
            <!-- <div class="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-1000">
              <button 
                class="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover-lift hover:from-red-600 hover:to-red-700 transition-all duration-300 handwriting-fancy"
                @click="handleJoinMovement"
              >
                {{ primaryCTA }}
              </button>
              <button 
                class="border-2 border-red-500 text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all duration-300 handwriting hover-lift"
                @click="handleLearnMore"
              >
                {{ secondaryCTA }}
              </button>
            </div> -->
          </div>
        </div>
      </div>
      
      <!-- Additional animated quote section -->
      <div class="mt-20 text-center opacity-0 animate-fadeInUp delay-1500">
        <div class="max-w-4xl mx-auto">
          <blockquote class="text-3xl lg:text-4xl handwriting-fancy gradient-text font-bold italic leading-relaxed">
            "{{ finalQuote }}"
          </blockquote>
          <div class="mt-6">
            <p class="text-xl text-gray-600 handwriting">— {{ candidateName }}</p>
            <p class="text-lg text-red-500 font-semibold animate-pulse">{{ candidateTitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Interface definitions
interface FlameVisionItem {
  emoji: string
  text: string
  color: string
}

interface DecorativeDot {
  classes: string
  delay: string
}

interface MainHeading {
  part1: string
  part2: string
}

interface InspirationalQuote {
  text: string
  highlight: string
}

// Reactive state
const isVisible = ref(false)
const showTypewriter = ref(false)
const sparkleContainer = ref<HTMLElement | null>(null)

// Data properties
const candidateName = ref('Olawuyi Praise Deborah')
const candidateInitials = ref('PD')
const candidateTitle = ref('Aspiring COMPSSA President')
const organizationName = ref('COMPSSA')
const visionName = ref('F.L.A.M.E Vision')
const headerBadgeText = ref('JOIN THE F.L.A.M.E MOVEMENT')
const serviceOrganizations = ref('NUNSA and COMPSSA')
const leadershipFocus = ref('students I was called to serve')
const visionTitle = ref('My F.L.A.M.E Vision')
const primaryCTA = ref('Join the Movement! 🚀')
const secondaryCTA = ref('Learn More About F.L.A.M.E')
const finalQuote = ref('My commitment is to shape a COMPSSA that is united, dynamic, and ready for the future.')

const mainHeading: MainHeading = reactive({
  part1: "Let's Build",
  part2: 'Together'
})

const subHeading = ref('Make COMPSSA Proud!')

const inspirationalQuote: InspirationalQuote = reactive({
  text: 'As Vice President of NUNSA, I witnessed how a listening ear, a small initiative, or a united effort can make a',
  highlight: 'lasting impact'
})

const flameVision: FlameVisionItem[] = reactive([
  { emoji: '🔥', text: 'Foster Collaboration', color: 'text-red-600' },
  { emoji: '💖', text: 'Life & Wellbeing', color: 'text-pink-600' },
  { emoji: '📚', text: 'Academics & Beyond', color: 'text-blue-600' },
  { emoji: '🌟', text: 'Mentorship', color: 'text-purple-600' },
  { emoji: '✨', text: 'Excellence Through Impact', color: 'text-green-600' }
])

const decorativeDots: DecorativeDot[] = reactive([
  { classes: 'w-3 h-3 rounded-full bg-red-400 animate-bounce', delay: '100ms' },
  { classes: 'w-3 h-3 rounded-full bg-blue-400 animate-bounce', delay: '200ms' },
  { classes: 'w-3 h-3 rounded-full bg-green-400 animate-bounce', delay: '300ms' },
  { classes: 'w-3 h-3 rounded-full bg-purple-400 animate-bounce', delay: '500ms' },
  { classes: 'w-2 h-2 rounded-full bg-pink-400 animate-pulse', delay: '700ms' },
  { classes: 'w-2 h-2 rounded-full bg-yellow-400 animate-pulse', delay: '500ms' },
  { classes: 'w-2 h-2 rounded-full bg-indigo-400 animate-pulse', delay: '300ms' },
  { classes: 'w-2 h-2 rounded-full bg-red-300 animate-pulse', delay: '1000ms' }
])

// Methods
const handleImageHover = () => {
  // Add special hover effect
  console.log('Image hovered')
}

const handleJoinMovement = () => {
  alert(`Thank you for joining the F.L.A.M.E movement! Together, we'll make ${organizationName.value} proud!`)
}

const handleLearnMore = () => {
  alert('Learn more about the F.L.A.M.E vision and how we can build COMPSSA together!')
}

const createSparkle = (x: number, y: number) => {
  if (!sparkleContainer.value) return
  
  const sparkle = document.createElement('div')
  sparkle.className = 'absolute w-2 h-2 bg-yellow-400 rounded-full pointer-events-none animate-sparkle'
  sparkle.style.left = x + 'px'
  sparkle.style.top = y + 'px'
  sparkle.style.zIndex = '9999'
  
  sparkleContainer.value.appendChild(sparkle)
  
  setTimeout(() => {
    sparkle.remove()
  }, 2000)
}

const handleMouseMove = (e: MouseEvent) => {
  if (Math.random() < 0.1) { // 10% chance
    createSparkle(e.clientX, e.clientY)
  }
}

// Lifecycle hooks
onMounted(() => {
  // Trigger initial animations
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  // Start typewriter effect
  setTimeout(() => {
    showTypewriter.value = true
  }, 1000)
  
  // Add mouse move listener for sparkles
  document.addEventListener('mousemove', handleMouseMove)
  
  // Enhanced scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp')
      }
    })
  }, observerOptions)

  // Observe all elements with animation classes
  document.querySelectorAll('[class*="animate-"]').forEach(el => {
    observer.observe(el)
  })

  // Add floating effect to buttons on hover
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-5px) scale(1.02)'
      button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0) scale(1)'
    })
  })

  // Add periodic animation to F.L.A.M.E elements
  const flameInterval = setInterval(() => {
    const flameElements = document.querySelectorAll('[class*="text-2xl"]:not(h1):not(h2)')
    flameElements.forEach((el: Element, index: number) => {
      setTimeout(() => {
        const element = el as HTMLElement
        element.style.transform = 'scale(1.1)'
        setTimeout(() => {
          element.style.transform = 'scale(1)'
        }, 200)
      }, index * 100)
    })
  }, 5000)
  
  // Cleanup interval on unmount
  onBeforeUnmount(() => {
    clearInterval(flameInterval)
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes slideInLeft {
  0% { transform: translateX(-100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  0% { transform: translateX(100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes fadeInUp {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse3D {
  0%, 100% { transform: scale(1) translateZ(0); }
  50% { transform: scale(1.05) translateZ(10px); }
}

@keyframes morphBlob {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}

@keyframes writeIn {
  0% { stroke-dashoffset: 1000; opacity: 0; }
  50% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}

@keyframes sparkle {
  0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

.animate-float { animation: float 6s ease-in-out infinite; }
.animate-slideInLeft { animation: slideInLeft 1s ease-out forwards; }
.animate-slideInRight { animation: slideInRight 1s ease-out forwards; }
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
.animate-scaleIn { animation: scaleIn 0.6s ease-out forwards; }
.animate-pulse3D { animation: pulse3D 2s ease-in-out infinite; }
.animate-morphBlob { animation: morphBlob 8s ease-in-out infinite; }
.animate-sparkle { animation: sparkle 2s ease-in-out infinite; }

.handwriting {
  font-family: 'Caveat', cursive;
  position: relative;
  overflow: hidden;
}

.handwriting-fancy {
  font-family: 'Dancing Script', cursive;
}

.typewriter {
  overflow: hidden;
  border-right: 3px solid #ef4444;
  white-space: nowrap;
  animation: typewriter 4s steps(40, end), blink 1s step-end infinite;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-500 { animation-delay: 0.5s; }
.delay-700 { animation-delay: 0.7s; }
.delay-1000 { animation-delay: 1s; }
.delay-1200 { animation-delay: 1.2s; }
.delay-1500 { animation-delay: 1.5s; }

.animation-delay-1000 { animation-delay: 1s; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-2s { animation-delay: 2s; }

/* Handwriting SVG animations */
.handwriting-svg {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: writeIn 3s ease-in-out forwards;
}

/* 3D transforms */
.transform-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #ef4444, #dc2626, #b91c1c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Interactive hover effects */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Floating particles */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.6;
}

.particle-1 {
  width: 4px;
  height: 4px;
  background: #ef4444;
  top: 20%;
  left: 10%;
  animation: float 3s ease-in-out infinite;
}

.particle-2 {
  width: 6px;
  height: 6px;
  background: #3b82f6;
  top: 60%;
  right: 15%;
  animation: float 4s ease-in-out infinite reverse;
}

.particle-3 {
  width: 3px;
  height: 3px;
  background: #10b981;
  bottom: 30%;
  left: 80%;
  animation: float 5s ease-in-out infinite;
}

/* Container max width */
.container {
  max-width: 1200px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
}
</style>