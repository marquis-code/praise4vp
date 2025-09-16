<template>
  <section class="relative bg-gradient-to-br from-blue-50 to-gray-100 py-16 lg:py-24 overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200 to-transparent rounded-full opacity-30 transform translate-x-32 -translate-y-32"></div>
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-200 to-transparent rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>

    <div class="container mx-auto px-4 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Left Content - Images -->
        <div class="lg:col-span-6 relative">
          <div class="relative">
            <!-- Main candidate image -->
            <div class="relative z-10 bg-white rounded-lg shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <img 
                :src="candidateImage" 
                :alt="candidateName"
                class="w-full h-96 lg:h-[500px] object-cover"
              />
              <!-- Red accent bar -->
              <div class="absolute top-0 left-0 w-6 h-full bg-red-500"></div>
            </div>

            <!-- Secondary image - bottom left -->
            <div class="absolute -bottom-8 -left-8 z-20 w-48 h-32 bg-white rounded-lg shadow-xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                :src="rallyImage" 
                :alt="rallyAlt"
                class="w-full h-full object-cover"
              />
              <!-- Electson badge overlay -->
              <div class="absolute bottom-2 left-2 bg-white rounded-full px-3 py-1 shadow-lg">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">E</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-800">Election</span>
                </div>
              </div>
            </div>

            <!-- Decorative dots pattern -->
            <div class="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-40">
              <div class="grid grid-cols-4 gap-2">
                <div v-for="dot in 16" :key="dot" class="w-2 h-2 rounded-full" :class="getDotColor(dot)"></div>
              </div>
            </div>

            <!-- Floating animation elements -->
            <div class="absolute -top-6 right-12 w-4 h-4 bg-blue-400 rounded-full animate-bounce animation-delay-1000"></div>
            <div class="absolute bottom-12 -right-6 w-3 h-3 bg-red-400 rounded-full animate-pulse animation-delay-2000"></div>
          </div>
        </div>

        <!-- Right Content - Donation Form -->
        <div class="lg:col-span-6 space-y-8">
          <!-- Header -->
          <div class="space-y-6">
            <!-- Donate badge -->
            <div class="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
              <span>=</span>
              <span>DONATE NOW</span>
            </div>

            <!-- Main heading -->
            <div class="space-y-2">
              <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Get involved <span class="text-red-500">Contribution</span>
              </h2>
              <h3 class="text-3xl lg:text-4xl font-bold text-gray-800">
                Make yourself Proud!
              </h3>
            </div>

            <!-- Divider line -->
            <div class="w-16 h-1 bg-red-500 rounded"></div>

            <!-- Description -->
            <p class="text-gray-600 text-lg leading-relaxed max-w-md">
              Through my service in NUNSA and COMPSSA, I discovered that leadership is not about the positions I have been opportune to hold, but about the students I was called to serve, their struggles, their victories, and their need for support. As Vice President of NUNSA, I witnessed how a listening ear, a small initiative, or a united effort can make a lasting impact.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import user1 from '@/assets/img/personal/user1.jpg'
import user2 from '@/assets/img/personal/user2.jpg'
import user3 from '@/assets/img/personal/user3.jpg'
interface DonationAmount {
  amounts: (number | string)[]
}

// Reactive state
const selectedAmount = ref<number | string | null>(null)
const customAmount = ref<number | null>(null)

// Donation amounts
const donationAmounts: (number | string)[] = [5, 10, 20, 40, 80]

// Computed
const isValidAmount = computed(() => {
  if (typeof selectedAmount.value === 'number') return true
  if (selectedAmount.value === 'More' && customAmount.value && customAmount.value > 0) return true
  return false
})

// Images - you can replace these with your actual images
const candidateImage = ref(user1)
const candidateName = ref('Olawuyi Praise Deborah')
const rallyImage = ref(user3)
const rallyAlt = ref('Campaign rally with supporters')

// Methods
const selectAmount = (amount: number | string) => {
  selectedAmount.value = amount
  if (typeof amount === 'number') {
    customAmount.value = null
  }
}

const getDotColor = (index: number): string => {
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-gray-400', 'bg-red-300']
  return colors[index % colors.length]
}

const processDonation = () => {
  const amount = selectedAmount.value === 'More' ? customAmount.value : selectedAmount.value
  console.log('Processing donation:', amount)
  
  // Show success message
  alert(`Thank you for your ${amount ? '$' + amount : ''} contribution to Olawuyi Praise's campaign!`)
  
  // Reset form
  selectedAmount.value = null
  customAmount.value = null
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

/* Animation delays */
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* Hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Container max width */
.container {
  max-width: 1200px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  h2 {
    font-size: 2.5rem;
  }
  
  h3 {
    font-size: 2rem;
  }
  
  .grid-cols-5 {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .grid-cols-5 button {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
}
</style>