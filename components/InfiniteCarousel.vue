<template>
  <div class="carousel-container">
    <!-- Animated background elements -->
    <div class="bg-animation">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
    </div>
    
    <!-- Main heading with crazy animations -->
    <div class="heading-section">
      <h1 class="main-heading" ref="heading">
        <span class="letter" v-for="(letter, index) in headingLetters" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
          {{ letter }}
        </span>
      </h1>
    </div>
    
    <!-- Multiple carousel tracks for ultra-smooth effect -->
    <div class="carousel-wrapper" ref="carouselWrapper">
      <!-- First track -->
      <div class="carousel-track track-1" :style="trackStyles.track1">
        <div 
          v-for="(image, index) in firstTrackImages" 
          :key="`track1-${index}`"
          class="carousel-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @mouseenter="onItemHover"
          @mouseleave="onItemLeave"
        >
          <div class="image-container">
            <img 
              :src="image.src" 
              :alt="image.alt" 
              class="carousel-image"
              @load="onImageLoad"
            />
            <div class="image-overlay">
              <div class="overlay-content">
                <div class="shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second track (offset) -->
      <div class="carousel-track track-2" :style="trackStyles.track2">
        <div 
          v-for="(image, index) in secondTrackImages" 
          :key="`track2-${index}`"
          class="carousel-item carousel-item-offset"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @mouseenter="onItemHover"
          @mouseleave="onItemLeave"
        >
          <div class="image-container">
            <img 
              :src="image.src" 
              :alt="image.alt" 
              class="carousel-image h-[500px]"
              @load="onImageLoad"
            />
            <div class="image-overlay">
              <div class="overlay-content">
                <div class="shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Particle system -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
interface CarouselImage {
  src: string
  alt: string
}

interface Props {
  images: CarouselImage[]
  speed?: number
  itemWidth?: number
  itemHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  speed: 80,
  itemWidth: 320,
  itemHeight: 420
})

const carouselWrapper = ref<HTMLElement>()
const particleCanvas = ref<HTMLCanvasElement>()
const heading = ref<HTMLElement>()

// Heading animation
const headingLetters = ref(['P', 'O'])

// Split images into two tracks for smoother animation
const firstTrackImages = computed(() => {
  const doubled = [...props.images, ...props.images, ...props.images]
  return doubled
})

const secondTrackImages = computed(() => {
  const offset = Math.floor(props.images.length / 2)
  const offsetImages = [...props.images.slice(offset), ...props.images.slice(0, offset)]
  const doubled = [...offsetImages, ...offsetImages, ...offsetImages]
  return doubled
})

// Dynamic track styles
const trackStyles = computed(() => {
  const totalWidth = props.images.length * (props.itemWidth + 30)
  const duration1 = totalWidth / props.speed
  const duration2 = (totalWidth * 1.2) / props.speed

  return {
    track1: {
      animationDuration: `${duration1}s`,
    },
    track2: {
      animationDuration: `${duration2}s`,
    }
  }
})

// Particle animation
let animationId: number
let particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}> = []

const initParticles = () => {
  if (!particleCanvas.value) return
  
  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Create particles
  particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()
    })
    
    animationId = requestAnimationFrame(animate)
  }
  
  animate()
}

const onItemHover = (event: Event) => {
  const item = event.currentTarget as HTMLElement
  item.style.transform = 'translateY(-15px) rotateY(5deg) scale(1.05)'
  item.style.zIndex = '100'
}

const onItemLeave = (event: Event) => {
  const item = event.currentTarget as HTMLElement
  item.style.transform = 'translateY(0) rotateY(0) scale(1)'
  item.style.zIndex = '1'
}

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.parentElement?.classList.add('loaded')
}

onMounted(() => {
  initParticles()
  
  // Responsive resize
  const handleResize = () => {
    if (particleCanvas.value) {
      particleCanvas.value.width = window.innerWidth
      particleCanvas.value.height = window.innerHeight
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  // Intersection Observer for scroll-triggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  })
  
  if (heading.value) {
    observer.observe(heading.value)
  }

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    window.removeEventListener('resize', handleResize)
    observer.disconnect()
  })
})

defineExpose({
  carouselWrapper
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  height: 100vh;
  background: black;
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  overflow: hidden;
  position: relative;
}

.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(10px);
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 7s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 50%;
  animation-delay: 14s;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.heading-section {
  position: absolute;
  top: 15%;
  left: 8%;
  z-index: 10;
  perspective: 1000px;
}

.main-heading {
  font-size: clamp(6rem, 15vw, 18rem);
  font-weight: 900;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  display: flex;
  gap: 0.1em;
}

.letter {
  display: inline-block;
  background: linear-gradient(45deg, #fff, #f0f0f0, #ddd);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(255,255,255,0.5);
  animation: letter-float 3s ease-in-out infinite, letter-glow 2s ease-in-out infinite alternate;
  transform-origin: center bottom;
}

.carousel-wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: v-bind("`${itemHeight + 100}px`");
  overflow: hidden;
  perspective: 2000px;
}

.carousel-track {
  display: flex;
  gap: 30px;
  height: 100%;
  animation: slide-continuous linear infinite;
  will-change: transform;
  position: absolute;
  top: 0;
  left: 0;
}

.track-2 {
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  opacity: 0.7;
  animation-direction: reverse;
}

.carousel-item {
  flex-shrink: 0;
  width: v-bind("`${itemWidth}px`");
  height: v-bind("`${itemHeight}px`");
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  animation: item-entrance 1s ease-out;
}

.carousel-item-offset {
  animation-delay: 0.5s;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0,0,0,0.3),
    0 0 0 1px rgba(255,255,255,0.1);
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  transform: perspective(1000px) rotateY(0deg);
  transition: all 0.4s ease;
}

.carousel-item:hover .image-container {
  box-shadow: 
    0 30px 80px rgba(0,0,0,0.4),
    0 0 0 1px rgba(255,255,255,0.2),
    0 0 100px rgba(255,255,255,0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
  filter: brightness(0.9) contrast(1.1);
}

.carousel-item:hover .carousel-image {
  transform: scale(1.1);
  filter: brightness(1) contrast(1.2);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255,255,255,0.1) 0%,
    transparent 50%,
    rgba(0,0,0,0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-item:hover .image-overlay {
  opacity: 1;
}

.shimmer {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255,255,255,0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%);
  transition: transform 0.6s ease;
}

.carousel-item:hover .shimmer {
  transform: translateX(100%) translateY(100%);
}

.loaded {
  animation: image-reveal 0.8s ease-out;
}

/* Animations */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(-40px) rotate(180deg); }
  75% { transform: translateY(-20px) rotate(270deg); }
}

@keyframes letter-float {
  0%, 100% { transform: translateY(0) rotateX(0deg); }
  50% { transform: translateY(-10px) rotateX(15deg); }
}

@keyframes letter-glow {
  0% { text-shadow: 0 0 30px rgba(255,255,255,0.5); }
  100% { text-shadow: 0 0 50px rgba(255,255,255,0.8), 0 0 100px rgba(255,255,255,0.3); }
}

@keyframes slide-continuous {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-33.333%)); }
}

@keyframes item-entrance {
  0% {
    opacity: 0;
    transform: translateY(50px) rotateY(-20deg) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateY(0deg) scale(1);
  }
}

@keyframes image-reveal {
  0% {
    opacity: 0;
    filter: blur(10px) brightness(0.5);
  }
  100% {
    opacity: 1;
    filter: blur(0px) brightness(0.9);
  }
}

/* Mobile Responsive */
@media (max-width: 1200px) {
  .heading-section {
    top: 10%;
    left: 5%;
  }
  
  .carousel-item {
    width: v-bind("`${Math.max(itemWidth - 60, 260)}px`");
    height: v-bind("`${Math.max(itemHeight - 60, 360)}px`");
  }
  
  .carousel-track {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .heading-section {
    top: 8%;
    left: 4%;
  }
  
  .carousel-item {
    width: v-bind("`${Math.max(itemWidth - 100, 220)}px`");
    height: v-bind("`${Math.max(itemHeight - 100, 320)}px`");
  }
  
  .carousel-track {
    gap: 15px;
  }

  .track-2 {
    display: none; /* Hide second track on mobile for performance */
  }
}

@media (max-width: 480px) {
  .heading-section {
    top: 5%;
    left: 3%;
  }
  
  .carousel-wrapper {
    top: 30%;
    height: 70vh;
  }
  
  .carousel-item {
    width: v-bind("`${Math.max(itemWidth - 120, 200)}px`");
    height: v-bind("`${Math.max(itemHeight - 120, 280)}px`");
  }

  .carousel-track {
    gap: 12px;
  }
  
  .track-2 {
    top: 50%;
    opacity: 0.85;
  }
}

/* Performance optimizations */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>