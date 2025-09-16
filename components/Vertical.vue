<template>
  <section class="bg-black text-white py-20 px-6 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Left Content -->
        <div class="space-y-8">
          <div class="space-y-4">
            <p class="text-purple-400 text-sm font-medium uppercase tracking-wider">
              Community
            </p>
            <h2 class="text-5xl lg:text-6xl font-bold leading-tight">
              We believe in the<br>
              power of community
            </h2>
          </div>
          
          <p class="text-gray-300 text-lg leading-relaxed max-w-xl">
            My goal is to create a COMPSSA where every student is valued, 
            no one feels less or more important, and where academics can 
            coexist with vibrant student life. This is why I'm constantly 
            working on building bridges and really listening to what our 
            students have to say.
          </p>
          
     <div class="pt-6">
             <a href="#vision" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-base font-semibold transition-colors duration-200 transform hover:scale-105">
            Read more about my vision
          </a>
     </div>
        </div>
        
        <!-- Right Testimonials Carousel -->
        <div class="relative h-[600px] overflow-hidden">
          <div class="flex gap-4 h-full w-full">
            <!-- Left Column Moving Up -->
            <div class="w-1/2 h-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 w-full"
                :style="{ transform: `translateY(${leftScroll}px)` }"
              >
                <div 
                  v-for="(testimonial, index) in leftTestimonials" 
                  :key="index"
                  class="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-4 min-h-[160px]"
                >
                  <div class="flex items-start space-x-3 mb-3">
                    <!-- <img 
                      :src="`https://i.pravatar.cc/40?img=${index + 1}`" 
                      :alt="testimonial.name"
                      class="w-10 h-10 rounded-full"
                    > -->
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h4 class="text-white text-sm font-medium">{{ testimonial.name }}</h4>
                        <img src="@/assets/img/compassa-logo.jpeg" class="h-4 w-4 rounded-full" />
                        <!-- <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg> -->
                      </div>
                      <p class="text-gray-300 text-sm">{{ testimonial.content }}</p>
                      <p class="text-gray-500 text-xs mt-2">{{ testimonial.date }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column Moving Down -->
            <div class="w-1/2 h-full relative overflow-hidden">
              <div 
                class="absolute top-0 left-0 w-full"
                :style="{ transform: `translateY(${rightScroll}px)` }"
              >
                <div 
                  v-for="(testimonial, index) in rightTestimonials" 
                  :key="index"
                  class="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700/50 mb-6 min-h-[180px] backdrop-blur-sm hover:from-gray-800 hover:to-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <!-- Subtle gradient overlay -->
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div class="relative z-10">
                    <div class="flex items-start space-x-4 mb-4">
                      <!-- <div class="relative">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-0.5">
                          <div class="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                            <span class="text-white text-sm font-bold">
                              {{ testimonial.name.split(' ').map(n => n[0]).join('') }}
                            </span>
                          </div>
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      </div> -->
                      
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                          <h4 class="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors">
                            {{ testimonial.name }}
                          </h4>
                          <div class="flex items-center space-x-1">
                            <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </div>
                        </div>
                        <p class="text-gray-400 text-xs font-medium mb-3">{{ testimonial.position }}</p>
                        <p class="text-gray-300 text-sm leading-relaxed">{{ testimonial.content }}</p>
                        
                        <div class="flex items-center justify-between mt-4">
                          <p class="text-gray-500 text-xs">{{ testimonial.date }}</p>
                          <div class="flex items-center space-x-1 text-gray-500 text-xs">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                            </svg>
                            <span>{{ Math.floor(Math.random() * 50) + 10 }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const leftScroll = ref(0)
const rightScroll = ref(0)
let animationFrame: number

const leftTestimonials = ref([
  {
    name: "Sarah Adebayo",
    content: "Her F.L.A.M.E agenda resonates with what we need - Foster collaboration, wholesome wellbeing, and academic excellence. She truly understands our struggles.",
    date: "Nov 15, 2024"
  },
  {
    name: "Michael Okafor", 
    content: "I've worked with her on several projects. Her organizational excellence and collaborative spirit make her the perfect candidate for this role.",
    date: "Nov 14, 2024"
  },
  {
    name: "Blessing Umeh",
    content: "She has shown consistent leadership in welfare projects. Her compassionate heart and service-oriented mindset is exactly what COMPSSA needs.",
    date: "Nov 13, 2024"
  },
  {
    name: "David Ogundimu",
    content: "Her vision for interdepartmental collaboration and mentorship programs will transform our association. I'm confident in her ability to deliver.",
    date: "Nov 12, 2024"
  },
  {
    name: "Sarah Adebayo",
    content: "Her F.L.A.M.E agenda resonates with what we need - Foster collaboration, wholesome wellbeing, and academic excellence. She truly understands our struggles.",
    date: "Nov 15, 2024"
  },
  {
    name: "Michael Okafor", 
    content: "I've worked with her on several projects. Her organizational excellence and collaborative spirit make her the perfect candidate for this role.",
    date: "Nov 14, 2024"
  }
])

const rightTestimonials = ref([
  {
    name: "Grace Adeleke",
    content: "Working with her during Health Week showed me her adaptability and big-picture thinking. She balances multiple responsibilities effortlessly.",
    date: "Nov 11, 2024"
  },
  {
    name: "Emmanuel Ogbu",
    content: "Her leadership in our medical department has been exemplary. She brings both discipline and emotional intelligence to every project.",
    date: "Nov 10, 2024"
  },
  {
    name: "Chioma Nwankwo",
    content: "She doesn't just talk about service - she lives it. From Badagry Outreach to SWIP, her track record speaks for itself.",
    date: "Nov 9, 2024"
  },
  {
    name: "Joseph Bankole",
    content: "Her resilience and intellectual curiosity during clinical postings have been impressive. She thrives in uncertainty and adapts quickly.",
    date: "Nov 8, 2024"
  },
  {
    name: "Grace Adeleke",
    content: "Working with her during Health Week showed me her adaptability and big-picture thinking. She balances multiple responsibilities effortlessly.",
    date: "Nov 11, 2024"
  },
  {
    name: "Emmanuel Ogbu",
    content: "Her leadership in our medical department has been exemplary. She brings both discipline and emotional intelligence to every project.",
    date: "Nov 10, 2024"
  }
])

const animate = () => {
  // Left column moves up
  leftScroll.value -= 1
  // Right column moves down
  rightScroll.value += 1
  
  // Reset when out of bounds for infinite scroll
  if (leftScroll.value <= -1000) {
    leftScroll.value = 0
  }
  if (rightScroll.value >= 1000) {
    rightScroll.value = 0
  }
  
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>