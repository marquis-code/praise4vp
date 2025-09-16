<template>
  <div class="carousel-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
    <!-- Dynamic gradient background with morphing shapes -->
    <div class="dynamic-bg">
      <div class="morph-blob blob-1"></div>
      <div class="morph-blob blob-2"></div>
      <div class="morph-blob blob-3"></div>
      <div class="gradient-overlay"></div>
    </div>
    
    <!-- Floating geometric particles -->
    <div class="geometric-particles">
      <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>
    
    <!-- Animated heading with spectacular effects -->
    <div class="heading-section" :class="{ 'mobile-heading': isMobile }">
      <h1 class="main-heading" ref="heading">
        <span 
          v-for="(letter, index) in headingLetters" 
          :key="index" 
          class="letter"
          :style="{ 
            animationDelay: `${index * 0.15}s`,
            '--letter-index': index 
          }"
          @mouseenter="onLetterHover"
        >
          {{ letter }}
        </span>
      </h1>
      <div class="heading-glow"></div>
    </div>
    
    <!-- Revolutionary multi-layer carousel system -->
    <div class="carousel-system" ref="carouselSystem">
      <!-- Primary track - Main focus -->
      <div 
        class="carousel-track primary-track" 
        :style="primaryTrackStyle"
        ref="primaryTrack"
      >
        <div 
          v-for="(image, index) in extendedPrimaryImages" 
          :key="`primary-${index}`"
          class="carousel-item primary-item"
          :style="getItemStyle(index, 'primary')"
          @click="onItemClick(image, index)"
          @mouseenter="onItemHover(index, 'primary')"
          @mouseleave="onItemLeave"
        >
          <div class="item-container">
            <div class="image-wrapper">
              <img 
                :src="image.src" 
                :alt="image.alt" 
                class="carousel-image"
                @load="onImageLoad"
              />
              <div class="holographic-overlay"></div>
              <div class="energy-field"></div>
            </div>
            <div class="item-info">
              <div class="info-glow"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary track - Atmospheric layer -->
      <div 
        class="carousel-track secondary-track" 
        :style="secondaryTrackStyle"
        ref="secondaryTrack"
      >
        <div 
          v-for="(image, index) in extendedSecondaryImages" 
          :key="`secondary-${index}`"
          class="carousel-item secondary-item"
          :style="getItemStyle(index, 'secondary')"
          @click="onItemClick(image, index)"
        >
          <div class="item-container">
            <div class="image-wrapper">
              <img 
                :src="image.src" 
                :alt="image.alt" 
                class="carousel-image"
              />
              <div class="ethereal-overlay"></div>
              <div class="pulse-ring"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ambient particles track -->
      <div class="ambient-track">
        <div v-for="i in 20" :key="i" class="ambient-particle" :style="getAmbientStyle(i)"></div>
      </div>
    </div>

    <!-- Interactive touch indicators for mobile -->
    <div v-if="isMobile" class="touch-indicators">
      <div class="swipe-hint">
        <div class="swipe-arrow"></div>
        <span>Swipe to explore</span>
      </div>
    </div>

    <!-- Performance canvas for advanced effects -->
    <canvas ref="effectCanvas" class="effect-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
interface CarouselImage {
  src: string
  alt: string
  title?: string
}

interface Props {
  images: CarouselImage[]
  speed?: number
  itemWidth?: number
  itemHeight?: number
  autoPlay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 60,
  itemWidth: 350,
  itemHeight: 450,
  autoPlay: true,
  interval: 8000
})

// Refs
const carouselSystem = ref<HTMLElement>()
const primaryTrack = ref<HTMLElement>()
const secondaryTrack = ref<HTMLElement>()
const effectCanvas = ref<HTMLCanvasElement>()
const heading = ref<HTMLElement>()

// Reactive state
const isMobile = ref(false)
const isTablet = ref(false)
const currentSpeed = ref(props.speed)
const isPaused = ref(false)
const hoveredIndex = ref(-1)
const touchStartX = ref(0)
const animationPhase = ref(0)

// Heading animation
// const headingLetters = ref(['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'])
const headingLetters = ref(['#', 'F', 'r', 'o', 'm', 'V', 'P', 't', 'o', 'V', 'P'])

// Responsive breakpoints
const updateDeviceType = () => {
  const width = window.innerWidth
  isMobile.value = width <= 768
  isTablet.value = width > 768 && width <= 1024
}

// Create extended image arrays for seamless infinite scroll
const extendedPrimaryImages = computed(() => {
  const multiplier = isMobile.value ? 4 : 6
  const images = []
  for (let i = 0; i < multiplier; i++) {
    images.push(...props.images)
  }
  return images
})

const extendedSecondaryImages = computed(() => {
  const offset = Math.floor(props.images.length / 3)
  const offsetImages = [...props.images.slice(offset), ...props.images.slice(0, offset)]
  const multiplier = isMobile.value ? 4 : 6
  const images = []
  for (let i = 0; i < multiplier; i++) {
    images.push(...offsetImages)
  }
  return images
})

// Dynamic track styles with ultra-smooth animations
const primaryTrackStyle = computed(() => {
  const baseWidth = isMobile.value ? 280 : isTablet.value ? 320 : props.itemWidth
  const gap = isMobile.value ? 20 : isTablet.value ? 25 : 30
  const totalWidth = props.images.length * (baseWidth + gap)
  const duration = (totalWidth / currentSpeed.value) * (isMobile.value ? 1.2 : 1)
  
  return {
    animationDuration: `${duration}s`,
    animationPlayState: isPaused.value ? 'paused' : 'running',
    '--gap': `${gap}px`,
    '--item-width': `${baseWidth}px`
  }
})

const secondaryTrackStyle = computed(() => {
  const baseWidth = isMobile.value ? 240 : isTablet.value ? 280 : props.itemWidth - 50
  const gap = isMobile.value ? 18 : isTablet.value ? 22 : 28
  const totalWidth = props.images.length * (baseWidth + gap)
  const duration = (totalWidth / currentSpeed.value) * (isMobile.value ? 1.5 : 1.3)
  
  return {
    animationDuration: `${duration}s`,
    animationPlayState: isPaused.value ? 'paused' : 'running',
    '--gap': `${gap}px`,
    '--item-width': `${baseWidth}px`
  }
})

// Dynamic item positioning and effects
const getItemStyle = (index: number, track: string) => {
  const delay = index * (isMobile.value ? 0.08 : 0.05)
  const isPrimary = track === 'primary'
  
  return {
    animationDelay: `${delay}s`,
    '--item-index': index,
    '--track-type': isPrimary ? 1 : 0.7,
    zIndex: isPrimary ? 10 : 5
  }
}

// Particle system styles
const getParticleStyle = (index: number) => {
  const size = Math.random() * (isMobile.value ? 6 : 8) + 2
  const duration = Math.random() * 20 + 15
  const delay = Math.random() * 10
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    '--particle-color': `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`
  }
}

const getAmbientStyle = (index: number) => {
  const size = Math.random() * 4 + 1
  const duration = Math.random() * 25 + 20
  const delay = Math.random() * 15
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

// Advanced canvas effects
let effectCtx: CanvasRenderingContext2D | null = null
let effectAnimationId: number
const wavePoints: Array<{ x: number, y: number, phase: number }> = []

const initEffectCanvas = () => {
  if (!effectCanvas.value) return
  
  const canvas = effectCanvas.value
  effectCtx = canvas.getContext('2d')
  if (!effectCtx) return

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Initialize wave points
  for (let i = 0; i < 50; i++) {
    wavePoints.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      phase: Math.random() * Math.PI * 2
    })
  }

  const animateEffects = () => {
    if (!effectCtx || !effectCanvas.value) return
    
    const { width, height } = effectCanvas.value
    effectCtx.clearRect(0, 0, width, height)
    
    // Create flowing energy waves
    effectCtx.globalCompositeOperation = 'screen'
    
    wavePoints.forEach((point, index) => {
      point.phase += 0.02
      const amplitude = isMobile.value ? 30 : 50
      const newY = point.y + Math.sin(point.phase) * amplitude
      
      const gradient = effectCtx!.createRadialGradient(
        point.x, newY, 0,
        point.x, newY, isMobile.value ? 60 : 100
      )
      gradient.addColorStop(0, `hsla(${200 + index * 3}, 60%, 50%, 0.1)`)
      gradient.addColorStop(1, 'hsla(200, 60%, 50%, 0)')
      
      effectCtx!.fillStyle = gradient
      effectCtx!.beginPath()
      effectCtx!.arc(point.x, newY, isMobile.value ? 40 : 60, 0, Math.PI * 2)
      effectCtx!.fill()
      
      // Move points
      point.x += Math.cos(point.phase * 0.5) * 0.5
      if (point.x > width + 100) point.x = -100
      if (point.x < -100) point.x = width + 100
    })
    
    effectAnimationId = requestAnimationFrame(animateEffects)
  }
  
  animateEffects()
}

// Event handlers
const onItemHover = (index: number, track: string) => {
  if (isMobile.value) return
  hoveredIndex.value = index
  currentSpeed.value = props.speed * 0.3
}

const onItemLeave = () => {
  if (isMobile.value) return
  hoveredIndex.value = -1
  currentSpeed.value = props.speed
}

const onItemClick = (image: CarouselImage, index: number) => {
  // Emit click event or handle navigation
  console.log('Item clicked:', image, index)
}

const onLetterHover = (event: Event) => {
  if (isMobile.value) return
  const letter = event.target as HTMLElement
  letter.style.transform = 'translateY(-20px) rotateX(360deg) scale(1.2)'
}

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  const container = img.closest('.item-container')
  container?.classList.add('loaded')
}

// Touch handling for mobile
const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isMobile.value) return
  const touchX = event.touches[0].clientX
  const diff = touchStartX.value - touchX
  
  if (Math.abs(diff) > 10) {
    currentSpeed.value = diff > 0 ? props.speed * 1.5 : props.speed * 0.5
    setTimeout(() => {
      currentSpeed.value = props.speed
    }, 1000)
  }
}

// Auto-play with intervals
let intervalId: number
const startAutoPlay = () => {
  if (!props.autoPlay) return
  
  intervalId = setInterval(() => {
    animationPhase.value = (animationPhase.value + 1) % 4
    // Add burst effects or speed changes
    currentSpeed.value = props.speed * (1 + Math.random() * 0.5)
    setTimeout(() => {
      currentSpeed.value = props.speed
    }, 2000)
  }, props.interval)
}

// Lifecycle
onMounted(() => {
  updateDeviceType()
  window.addEventListener('resize', updateDeviceType)
  initEffectCanvas()
  startAutoPlay()
  
  // Add intersection observer for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isPaused.value = !entry.isIntersecting
    })
  })
  
  if (carouselSystem.value) {
    observer.observe(carouselSystem.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDeviceType)
  if (effectAnimationId) {
    cancelAnimationFrame(effectAnimationId)
  }
  if (intervalId) {
    clearInterval(intervalId)
  }
})

defineExpose({
  carouselSystem,
  isPaused
})
</script>

<style scoped>
/* Base container with ultra-dynamic background */
.carousel-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
  cursor: none;
}

/* Dynamic morphing background */
.dynamic-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.morph-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: morph-float 25s ease-in-out infinite;
  opacity: 0.4;
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.blob-2 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #45b7d1, #96ceb4);
  top: 60%;
  right: 15%;
  animation-delay: 8s;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #feca57, #ff9ff3);
  bottom: 20%;
  left: 50%;
  animation-delay: 16s;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0,0,0,0.8) 0%,
    rgba(20,20,40,0.6) 50%,
    rgba(0,0,0,0.9) 100%
  );
  animation: gradient-pulse 12s ease-in-out infinite;
}

/* Geometric particles */
.geometric-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: var(--particle-color);
  border-radius: 50%;
  animation: particle-float 20s linear infinite;
  opacity: 0.6;
  filter: blur(1px);
}

/* Revolutionary heading with spectacular effects */
.heading-section {
  position: absolute;
  top: 8%;
  left: 5%;
  z-index: 20;
  perspective: 2000px;
}

.mobile-heading {
  top: 3%;
  left: 3%;
  transform: scale(0.8);
}

.main-heading {
  font-size: clamp(3.5rem, 12vw, 14rem);
  font-weight: 900;
  margin: 0;
  font-family: 'Inter', sans-serif;
  display: flex;
  gap: 0.05em;
  position: relative;
}

.letter {
  display: inline-block;
  background: linear-gradient(45deg, #ffffff, #f0f8ff, #e6e6fa);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: 
    letter-dance 4s ease-in-out infinite,
    letter-glow 3s ease-in-out infinite alternate,
    letter-hover 2s ease-in-out infinite;
  transform-origin: center bottom;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  text-shadow: 
    0 0 20px rgba(255,255,255,0.5),
    0 0 40px rgba(255,255,255,0.3),
    0 0 60px rgba(255,255,255,0.1);
}

.letter:hover {
  animation-play-state: paused;
}

.heading-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: heading-pulse 6s ease-in-out infinite;
  pointer-events: none;
}

/* Ultra-advanced carousel system */
.carousel-system {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 80vh;
  perspective: 3000px;
  z-index: 10;
}

.carousel-track {
  position: absolute;
  display: flex;
  gap: var(--gap);
  height: 100%;
  animation: ultra-slide linear infinite;
  will-change: transform;
  transform-style: preserve-3d;
}

.primary-track {
  top: 20%;
  left: 0;
  z-index: 15;
}

.secondary-track {
  top: 45%;
  left: 0;
  transform: scale(0.75) translateZ(-200px);
  opacity: 0.7;
  animation-direction: reverse;
  z-index: 8;
  filter: blur(1px);
}

.carousel-item {
  flex-shrink: 0;
  width: var(--item-width);
  height: auto;
  transform-style: preserve-3d;
  cursor: pointer;
  animation: item-entrance 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.primary-item {
  height: 400px;
}

.secondary-item {
  height: 320px;
}

.item-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  overflow: hidden;
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  box-shadow: 
    0 25px 80px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.1),
    inset 0 1px 0 rgba(255,255,255,0.2);
  transform: perspective(1200px) rotateY(0deg) rotateX(0deg);
  transition: all 0.6s ease;
}

.carousel-item:hover .item-container {
  transform: perspective(1200px) rotateY(-10deg) rotateX(5deg) translateY(-20px);
  box-shadow: 
    0 40px 120px rgba(0,0,0,0.8),
    0 0 0 2px rgba(255,255,255,0.2),
    0 0 200px rgba(100,200,255,0.3);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s ease;
  filter: brightness(0.9) contrast(1.1) saturate(1.2);
}

.carousel-item:hover .carousel-image {
  transform: scale(1.15) rotate(2deg);
  filter: brightness(1.1) contrast(1.3) saturate(1.4);
}

/* Advanced overlay effects */
.holographic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255,0,150,0.1) 0%,
    rgba(0,255,255,0.1) 25%,
    rgba(255,255,0,0.1) 50%,
    rgba(150,0,255,0.1) 75%,
    rgba(255,0,150,0.1) 100%
  );
  opacity: 0;
  animation: hologram-shift 3s linear infinite;
  transition: opacity 0.4s ease;
}

.carousel-item:hover .holographic-overlay {
  opacity: 0.6;
}

.energy-field {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(0,255,255,0.2), transparent);
  animation: energy-rotation 4s linear infinite;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.carousel-item:hover .energy-field {
  opacity: 1;
}

.ethereal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: ethereal-pulse 4s ease-in-out infinite;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: pulse-expand 3s ease-out infinite;
}

/* Ambient particles */
.ambient-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.ambient-particle {
  position: absolute;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  animation: ambient-float 20s linear infinite;
  filter: blur(1px);
}

/* Mobile touch indicators */
.touch-indicators {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  text-align: center;
}

.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
  animation: hint-pulse 2s ease-in-out infinite;
}

.swipe-arrow {
  width: 30px;
  height: 2px;
  background: rgba(255,255,255,0.7);
  position: relative;
  animation: arrow-slide 2s ease-in-out infinite;
}

.swipe-arrow::after {
  content: '';
  position: absolute;
  right: -8px;
  top: -4px;
  width: 0;
  height: 0;
  border-left: 8px solid rgba(255,255,255,0.7);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}

/* Effect canvas */
.effect-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

/* Keyframe animations */
@keyframes morph-float {
  0%, 100% { 
    transform: translateY(0px) scale(1) rotate(0deg);
    border-radius: 50% 40% 60% 30%;
  }
  25% { 
    transform: translateY(-30px) scale(1.1) rotate(90deg);
    border-radius: 40% 60% 30% 50%;
  }
  50% { 
    transform: translateY(-60px) scale(0.9) rotate(180deg);
    border-radius: 60% 30% 50% 40%;
  }
  75% { 
    transform: translateY(-30px) scale(1.05) rotate(270deg);
    border-radius: 30% 50% 40% 60%;
  }
}

@keyframes gradient-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

@keyframes particle-float {
  0% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-20vh) translateX(10vw) rotate(90deg); }
  50% { transform: translateY(-40vh) translateX(-10vw) rotate(180deg); }
  75% { transform: translateY(-20vh) translateX(10vw) rotate(270deg); }
  100% { transform: translateY(-100vh) translateX(0) rotate(360deg); }
}

@keyframes letter-dance {
  0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg) scale(1); }
  25% { transform: translateY(-15px) rotateX(15deg) rotateY(5deg) scale(1.05); }
  50% { transform: translateY(-10px) rotateX(-10deg) rotateY(-5deg) scale(1.02); }
  75% { transform: translateY(-5px) rotateX(5deg) rotateY(10deg) scale(1.08); }
}

@keyframes letter-glow {
  0% { 
    text-shadow: 
      0 0 20px rgba(255,255,255,0.5),
      0 0 40px rgba(255,255,255,0.3);
  }
  100% { 
    text-shadow: 
      0 0 30px rgba(255,255,255,0.8),
      0 0 60px rgba(255,255,255,0.5),
      0 0 100px rgba(100,200,255,0.3);
  }
}

@keyframes letter-hover {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(30deg); }
}

@keyframes heading-pulse {
  0%, 100% { 
    opacity: 0.3; 
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.6; 
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes ultra-slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-33.333%)); }
}

@keyframes item-entrance {
  0% {
    opacity: 0;
    transform: translateY(100px) rotateY(-30deg) rotateX(20deg) scale(0.7);
    filter: blur(20px);
  }
  50% {
    opacity: 0.7;
    transform: translateY(20px) rotateY(-10deg) rotateX(5deg) scale(0.9);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateY(0deg) rotateX(0deg) scale(1);
    filter: blur(0px);
  }
}

@keyframes hologram-shift {
  0% { background-position: 0% 0%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
  100% { background-position: 0% 0%; }
}

@keyframes energy-rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes ethereal-pulse {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.1);
  }
}

@keyframes pulse-expand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes ambient-float {
  0% { 
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { 
    transform: translateY(-10vh) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes hint-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes arrow-slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

/* Mobile and tablet responsive styles */
@media (max-width: 1200px) {
  .carousel-container {
    cursor: default;
  }
  
  .carousel-system {
    height: 70vh;
  }
  
  .primary-item {
    height: 350px;
  }
  
  .secondary-item {
    height: 280px;
  }
  
  .morph-blob {
    filter: blur(40px);
  }
  
  .blob-1 {
    width: 250px;
    height: 250px;
  }
  
  .blob-2 {
    width: 200px;
    height: 200px;
  }
  
  .blob-3 {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    min-height: 100vh;
    padding-bottom: 20px;
  }
  
  .carousel-system {
    height: 85vh;
    top: 45%;
  }
  
  .primary-track {
    top: 15%;
  }
  
  .secondary-track {
    top: 55%;
    transform: scale(0.65) translateZ(-150px);
    opacity: 0.8;
    display: block !important; /* Force show on mobile */
    animation-direction: reverse;
  }
  
  .primary-item {
    height: 300px;
  }
  
  .secondary-item {
    height: 240px;
  }
  
  .morph-blob {
    filter: blur(30px);
    opacity: 0.3;
  }
  
  .blob-1 {
    width: 200px;
    height: 200px;
    top: 5%;
    left: 5%;
  }
  
  .blob-2 {
    width: 150px;
    height: 150px;
    top: 70%;
    right: 10%;
  }
  
  .blob-3 {
    width: 120px;
    height: 120px;
    bottom: 15%;
    left: 40%;
  }
  
  .item-container {
    border-radius: 20px;
    box-shadow: 
      0 15px 40px rgba(0,0,0,0.5),
      0 0 0 1px rgba(255,255,255,0.1);
  }
  
  .carousel-item:hover .item-container {
    transform: perspective(800px) rotateY(-5deg) rotateX(2deg) translateY(-10px);
  }
  
  .geometric-particles .particle {
    width: 3px !important;
    height: 3px !important;
  }
  
  .touch-indicators {
    bottom: 5%;
  }
}

@media (max-width: 480px) {
  .mobile-heading {
    top: 2%;
    left: 2%;
    transform: scale(0.7);
  }
  
  .carousel-system {
    height: 90vh;
    top: 35%;
  }
  
  .primary-track {
    top: 10%;
  }
  
  .secondary-track {
    top: 58%;
    transform: scale(0.6) translateZ(-100px);
    opacity: 0.75;
  }
  
  .primary-item {
    height: 260px;
  }
  
  .secondary-item {
    height: 200px;
  }
  
  .item-container {
    border-radius: 16px;
    box-shadow: 
      0 10px 30px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.08);
  }
  
  .swipe-hint {
    font-size: 12px;
  }
  
  .swipe-arrow {
    width: 25px;
  }
  
  .morph-blob {
    filter: blur(25px);
    opacity: 0.25;
  }
  
  .heading-glow {
    opacity: 0.5;
  }
}

@media (max-width: 360px) {
  .carousel-system {
    height: 95vh;
    top: 30%;
  }
  
  .primary-track {
    top: 5%;
  }
  
  .secondary-track {
    top: 62%;
    transform: scale(0.55) translateZ(-80px);
    opacity: 0.7;
  }
  
  .primary-item {
    height: 220px;
  }
  
  .secondary-item {
    height: 180px;
  }
  
  .mobile-heading {
    transform: scale(0.6);
  }
}

/* Performance optimizations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .carousel-track {
    animation: none !important;
    transform: translateX(0) !important;
  }
}

/* High performance mode for older devices */
@media (max-resolution: 150dpi) {
  .morph-blob {
    display: none;
  }
  
  .geometric-particles {
    display: none;
  }
  
  .effect-canvas {
    display: none;
  }
  
  .holographic-overlay,
  .energy-field,
  .ethereal-overlay {
    display: none;
  }
}

/* Dark mode preferences */
@media (prefers-color-scheme: dark) {
  .item-container {
    background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
  }
  
  .carousel-image {
    filter: brightness(0.95) contrast(1.1) saturate(1.1);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .item-container {
    border: 2px solid rgba(255,255,255,0.3);
  }
  
  .letter {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  }
}

/* Animation performance optimizations */
.carousel-track,
.carousel-item,
.item-container,
.morph-blob {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* GPU acceleration hints */
.carousel-image,
.holographic-overlay,
.energy-field {
  transform: translateZ(0);
  will-change: transform, filter;
}

/* Ensure smooth scrolling on all devices */
* {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Custom scrollbar for desktop */
::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* Loading states */
.item-container:not(.loaded) {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
}

.item-container:not(.loaded)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.1),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

</style>