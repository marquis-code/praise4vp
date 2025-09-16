<template>
  <section class="bg-gray-50 py-16 lg:py-24">
    <div class="container mx-auto px-4 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center mb-16 animate-fadeInUp">
        <!-- Campaign badge -->
        <div class="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>=</span>
          <span>CAMPAIGN</span>
        </div>

        <!-- Main heading -->
        <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Support Students & COMPSSA
        </h2>
        <h3 class="text-4xl lg:text-5xl font-bold text-gray-900">
          <span class="text-red-500">Campaign</span> Highlights
        </h3>
      </div>

      <!-- Campaign Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        <article 
          v-for="(article, index) in campaignArticles"
          :key="index"
          class="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeInUp"
          :style="{ animationDelay: `${index * 200}ms` }"
        >
          <!-- Article Image -->
          <div class="relative h-64 overflow-hidden">
            <img 
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <!-- Image overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
            
            <!-- Article date badge -->
            <div class="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg px-3 py-1 backdrop-blur-sm">
              <div class="flex items-center space-x-2 text-red-500 text-sm font-medium">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
                <span>{{ article.date }}</span>
              </div>
            </div>

            <!-- Read more overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform duration-300">
                Read More
              </button>
            </div>
          </div>

          <!-- Article Content -->
          <div class="p-6 lg:p-8">
            <!-- Article Title -->
            <h3 class="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {{ article.title }}
            </h3>

            <!-- Article Description -->
            <p class="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3">
              {{ article.description }}
            </p>

            <!-- Article Footer -->
            <div class="flex items-center justify-between">
              <!-- Author info -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">{{ article.author.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ article.author }}</p>
                  <p class="text-xs text-gray-500">Campaign Team</p>
                </div>
              </div>

              <!-- Read time -->
              <div class="text-sm text-gray-500 flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ article.readTime }} min read</span>
              </div>
            </div>
          </div>

          <!-- Article hover effect border -->
          <div class="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-colors duration-300 pointer-events-none"></div>
        </article>

      </div>

      <!-- View All Button -->
      <div class="text-center mt-12 animate-fadeInUp animation-delay-800">
        <button class="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl">
          <span>View All Campaign Updates</span>
          <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import user1 from '@/assets/img/personal/user1.jpg'
import user2 from '@/assets/img/personal/user2.jpg'
import user3 from '@/assets/img/personal/user3.jpg'
import user4 from '@/assets/img/personal/user4.jpg'
interface CampaignArticle {
  title: string
  description: string
  image: string
  date: string
  author: string
  readTime: number
}

// Campaign articles data based on COMPSSA activities
const campaignArticles: CampaignArticle[] = [
  {
    title: 'Fostering Unity Through COMPSSA Leadership',
    description: 'Like every student, I\'ve faced the pressures of long lectures, endless assignments, and the pursuit of academic excellence. Yet in the midst of these demands, I found something deeper, which is an opportunity to serve, to connect, and to grow alongside brilliant minds.',
    image:  user1,
    date: '17 Jun, 2024',
    author: 'Praise Deborah',
    readTime: 5
  },
  {
    title: 'Strengthening Student Welfare & Support Systems',
    description: 'Through my service in NUNSA and COMPSSA, I discovered that leadership is not about the positions I have been opportune to hold, but about the students I was called to serve, their struggles, their victories, and their need for support.',
   image:  user2,
    date: '20 Aug, 2024',
    author: 'Campaign Team',
    readTime: 4
  },
  {
    title: 'Building Bridges Across All Departments',
    description: 'As Vice President of NUNSA, I witnessed how a listening ear, a small initiative, or a united effort can make a lasting impact. I have come to learn from these moments that leadership is and should be service driven by vision, compassion, and responsibility.',
     image:  user3,
    date: '19 Nov, 2024',
    author: 'Praise Deborah',
    readTime: 6
  },
  {
    title: 'Implementing the FLAME Vision for COMPSSA',
    description: 'My F.L.A.M.E. agenda focuses on Foster Collaboration, Life & Wellbeing, Academics & Beyond, Mentorship & Leadership, and Excellence Through Impact - creating a comprehensive approach to student leadership and development.',
    image:  user4,
    date: '22 Dec, 2024',
    author: 'Strategy Team',
    readTime: 7
  }
]
</script>

<style scoped>
/* Custom modal animation */
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modalSlideIn {
  animation: modalSlideIn 0.3s ease-out;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation classes */
.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out both;
}

/* Animation delays */
.animation-delay-800 {
  animation-delay: 0.8s;
}

/* Hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\:scale-100 {
  transform: scale(1);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Container max width */
.container {
  max-width: 1200px;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  h2, h3 {
    font-size: 3rem;
    line-height: 1.1;
  }
  
  .grid-cols-1.md\:grid-cols-2 {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  h2, h3 {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .p-6.lg\:p-8 {
    padding: 1.5rem;
  }
  
  .text-xl.lg\:text-2xl {
    font-size: 1.25rem;
  }
  
  .h-64 {
    height: 12rem;
  }
}

@media (max-width: 640px) {
  h2, h3 {
    font-size: 2rem;
  }
  
  .py-16.lg\:py-24 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .mb-16 {
    margin-bottom: 2rem;
  }
  
  .gap-8.lg\:gap-12 {
    gap: 1.5rem;
  }
}

/* Custom backdrop blur for older browsers */
@supports not (backdrop-filter: blur(4px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>