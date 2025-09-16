<template>
  <section class="relative py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0">
      <!-- Subtle geometric background pattern -->
      <div class="absolute inset-0 opacity-30">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#e879f9" opacity="0.3"/>
            </pattern>
            <pattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0,40 L40,0" stroke="#c084fc" stroke-width="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
          <rect width="100%" height="100%" fill="url(#lines)"/>
        </svg>
      </div>
      
      <!-- Floating geometric shapes -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-float"></div>
      <div class="absolute top-32 right-20 w-16 h-16 bg-pink-200 rounded-lg opacity-25 animate-float-delayed"></div>
      <div class="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-bounce-slow"></div>
      <div class="absolute bottom-32 right-1/3 w-24 h-24 bg-purple-100 rounded-lg opacity-15 animate-float"></div>
      
      <!-- Large background circles -->
      <div class="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
      <div class="absolute -bottom-20 -right-20 w-56 h-56 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12 md:mb-16">
        <p class="text-sm md:text-base text-gray-600 mb-4 font-medium tracking-wide">
          What We Do?
        </p>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
          Featured Information
        </h2>
        <p class="text-gray-600 max-w-4xl mx-auto text-base md:text-lg leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur numquam magnam, sed perspiciatis mollitia nesciunt amet, 
          consequuntur error culpa nobis dolore asperiores eum non quasi
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <!-- Card 1: Campus sexual assault -->
        <div class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          <div class="relative h-48 md:h-56 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="Campus activism"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="p-6 md:p-8">
            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Campus sexual assault
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Rapidiously integrate plug-and-play
            </p>
          </div>
        </div>

        <!-- Card 2: Gender and future -->
        <div class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          <div class="relative h-48 md:h-56 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
              alt="Community celebration"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="p-6 md:p-8">
            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Gender and future
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Rapidiously integrate plug-and-play
            </p>
          </div>
        </div>

        <!-- Card 3: Donation -->
        <div class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
          <div class="relative h-48 md:h-56 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="Donation and activism"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div class="p-6 md:p-8">
            <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Donation
            </h3>
            <p class="text-gray-600 leading-relaxed">
              Rapidiously integrate plug-and-play
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FeatureCard {
  title: string
  description: string
  image: string
  alt: string
}

// Feature cards data
const features: FeatureCard[] = [
  {
    title: 'Campus sexual assault',
    description: 'Rapidiously integrate plug-and-play',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    alt: 'Campus activism'
  },
  {
    title: 'Gender and future',
    description: 'Rapidiously integrate plug-and-play',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    alt: 'Community celebration'
  },
  {
    title: 'Donation',
    description: 'Rapidiously integrate plug-and-play',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    alt: 'Donation and activism'
  }
]

// Meta information for SEO
useSeoMeta({
  title: 'Featured Information - Our Key Focus Areas',
  ogTitle: 'Featured Information - Our Key Focus Areas',
  description: 'Learn about our key focus areas including campus safety, gender equality, and donation programs.',
  ogDescription: 'Learn about our key focus areas including campus safety, gender equality, and donation programs.'
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: -2s;
}

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
  animation-delay: -1s;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    gap: 1.5rem;
  }
  
  .rounded-2xl {
    border-radius: 1rem;
  }
  
  h2 {
    font-size: 2rem;
    line-height: 1.2;
  }
}

@media (max-width: 640px) {
  .py-16 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  h2 {
    font-size: 1.875rem;
  }
  
  .text-base {
    font-size: 0.875rem;
  }
}

/* Background pattern responsiveness */
@media (max-width: 1024px) {
  .absolute.w-40 {
    width: 2rem;
    height: 2rem;
  }
  
  .absolute.w-56 {
    width: 3rem;
    height: 3rem;
  }
}
</style>