<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div class="absolute inset-0 bg-black opacity-20"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse"></div>
      
      <div class="relative z-10 container mx-auto px-4 text-center text-white">
        <div class="inline-flex items-center space-x-2 bg-red-100/10 backdrop-blur-sm text-red-200 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-red-200/20">
          <span class="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
          <span class="text-lg font-bold">PRAISE4VP CAMPAIGN</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-pink-200 bg-clip-text text-transparent">
          INSPIRING IMPACTS
        </h1>
        <h2 class="text-3xl md:text-5xl font-bold mb-8 text-blue-200">
          BUILDING BRIDGES
        </h2>
        
        <div class="flex items-center justify-center mb-8">
          <button 
            @click="togglePlayPause"
            class="mr-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <Icon :name="isPlaying ? 'lucide:pause' : 'lucide:play'" class="w-5 h-5" />
          </button>
          <div class="text-xl md:text-2xl h-16 flex items-center">
            <span class="border-r-2 border-blue-300 animate-pulse pr-1">
              "{{ typewriterText }}"
            </span>
          </div>
        </div>
        
        <p class="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
          Olawuyi Praise Deborah - 300L Nursing Science
        </p>
        
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button 
            @click="openModal('vision')"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Discover My Vision
          </button>
          <button 
            @click="openModal('flame')"
            class="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            🔥 FLAME Agenda
          </button>
        </div>
      </div>
      
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <Icon name="lucide:chevron-down" class="w-8 h-8" />
      </div>
    </section> -->

    <!-- Campaign Articles Section -->
    <section class="py-20 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16 animate-fade-in-up">
          <div class="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>CAMPAIGN</span>
          </div>
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Support Students & COMPSSA
          </h2>
          <h3 class="text-4xl lg:text-5xl font-bold text-gray-900">
            <span class="text-red-500">Campaign</span> Highlights
          </h3>
        </div>

        <!-- Carousel -->
        <div class="relative mb-12">
          <div class="overflow-hidden rounded-2xl shadow-2xl">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div 
                v-for="(article, index) in campaignArticles" 
                :key="article.id" 
                class="w-full flex-shrink-0 relative"
              >
                <div class="relative h-96 md:h-[500px]">
                  <img 
                    :src="article.image"
                    :alt="article.title"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  <div class="absolute bottom-8 left-8 right-8 text-white">
                    <div class="flex items-center space-x-4 mb-4">
                      <div class="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <Icon name="lucide:calendar" class="w-4 h-4" />
                        <span class="text-sm">{{ article.date }}</span>
                      </div>
                      <div class="flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <Icon name="lucide:clock" class="w-4 h-4" />
                        <span class="text-sm">{{ article.readTime }} min read</span>
                      </div>
                    </div>
                    
                    <h3 class="text-2xl md:text-3xl font-bold mb-4">{{ article.title }}</h3>
                    <p class="text-lg mb-6 opacity-90 line-clamp-2">{{ article.description }}</p>
                    
                    <button 
                      @click="openModal('article', article)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Read Full Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            @click="prevSlide"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
          >
            <Icon name="lucide:chevron-left" class="w-6 h-6" />
          </button>
          
          <button 
            @click="nextSlide"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
          >
            <Icon name="lucide:chevron-right" class="w-6 h-6" />
          </button>
          
          <div class="flex justify-center space-x-2 mt-6">
            <button
              v-for="(_, index) in campaignArticles"
              :key="index"
              @click="currentSlide = index"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- FLAME Agenda Section -->
    <!-- <section class="py-20 px-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The <span class="text-red-500">F.L.A.M.E.</span> Vision
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive 5-point agenda designed to transform COMPSSA into a dynamic, student-centered organization
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(item, index) in flameAgenda"
            :key="item.letter"
            class="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div :class="`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`"></div>
            
            <div class="p-8">
              <div class="flex items-center mb-6">
                <div :class="`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-2xl font-bold mr-4`">
                  {{ item.letter }}
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ item.title }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ item.subtitle }}</p>
                </div>
              </div>
              
              <p class="text-gray-600 mb-6">{{ item.description }}</p>
              
              <button 
                @click="openModal('flame-detail', item)"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Experience Section -->
 <section class="py-20 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Leadership <span class="text-blue-500">Experience</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            A track record of dedicated service across multiple organizations and levels
          </p>
        </div>

        <div class="space-y-8">
          <div 
            v-for="(category, index) in experiences"
            :key="category.category"
            class="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up"
            :style="{ animationDelay: `${index * 200}ms` }"
          >
            <h3 class="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              {{ category.category }}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                v-for="(position, posIndex) in category.positions"
                :key="posIndex"
                class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div :class="`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  position.type === 'leadership' ? 'bg-blue-100 text-blue-600' :
                  position.type === 'committee' ? 'bg-green-100 text-green-600' :
                  position.type === 'volunteer' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
                }`">
                  <Icon :name="getPositionIcon(position.type)" class="w-5 h-5" />
                </div>
                
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ position.title }}</h4>
                  <p class="text-sm text-gray-500">{{ position.period }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12 animate-fade-in-up animation-delay-800">
          <button 
            @click="openModal('experience')"
            class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Complete Experience
          </button>
        </div>
      </div>
    </section>

    <!-- Core Strengths Section -->
    <!-- <section class="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Core <span class="text-purple-500">Strengths</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            The qualities that drive my commitment to effective leadership and service
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(strength, index) in strengths"
            :key="strength.name"
            class="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform">
                <Icon :name="strength.icon" class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {{ strength.name }}
              </h3>
            </div>
            
            <p class="text-gray-600 leading-relaxed">{{ strength.description }}</p>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Personal Side Section -->
    <!-- <section class="py-20 px-4">
      <div class="container mx-auto max-w-4xl">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Beyond The <span class="text-pink-500">Serious Hat</span>
          </h2>
          <p class="text-xl text-gray-600">
            Discovering the person behind the leadership aspirations
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            v-for="(hobby, index) in personalHobbies"
            :key="hobby.title"
            :class="`${hobby.bgClass} rounded-2xl p-8 animate-fade-in-up`"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div :class="`w-16 h-16 ${hobby.iconBg} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6`">
              {{ hobby.emoji }}
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ hobby.title }}</h3>
            <p class="text-gray-700 leading-relaxed">{{ hobby.description }}</p>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Call to Action -->
    <!-- <section class="py-20 px-4 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      <div class="container mx-auto max-w-4xl text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
          Ready to Build the Future of <span class="text-blue-300">COMPSSA</span>?
        </h2>
        <p class="text-xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
          Together, we can create a COMPSSA that truly represents every student and fosters a culture where we lift one another up.
        </p>
        
        <div class="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center animate-fade-in-up animation-delay-400">
          <button 
            @click="openModal('contact')"
            class="w-full sm:w-auto bg-white text-blue-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/20"
          >
            Get In Touch
          </button>
          <button 
            @click="openModal('support')"
            class="w-full sm:w-auto border-2 border-white text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-900"
          >
            Join the Movement
          </button>
        </div>
      </div>
    </section> -->

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Types
interface CampaignArticle {
  id: number
  title: string
  description: string
  image: string
  date: string
  author: string
  readTime: number
  fullContent?: string
}

interface FlameItem {
  letter: string
  title: string
  subtitle: string
  color: string
  description: string
  details: string[]
}

interface Experience {
  category: string
  positions: {
    title: string
    period: string
    type: 'leadership' | 'committee' | 'volunteer' | 'team'
  }[]
}

interface Strength {
  name: string
  icon: string
  description: string
}

interface PersonalHobby {
  title: string
  description: string
  emoji: string
  bgClass: string
  iconBg: string
}

interface ModalData {
  type: string
  data?: any
}

// Reactive state
const typewriterText = ref('')
const currentQuote = ref(0)
const currentSlide = ref(0)
const isPlaying = ref(true)
const activeModal = ref<ModalData | null>(null)

// Data
const quotes = [
  "To improve is to change, and to be perfect is to change often.",
  "Change does not come by being passive but by actively creating the difference we want to see.",
  "Leadership is not about positions or titles, but about people.",
  "Together will always be greater than alone."
]

const campaignArticles: CampaignArticle[] = [
  {
    id: 1,
    title: 'Fostering Unity Through COMPSSA Leadership',
    description: 'Like every student, I\'ve faced the pressures of long lectures, endless assignments, and the pursuit of academic excellence. Yet in the midst of these demands, I found something deeper, which is an opportunity to serve, to connect, and to grow alongside brilliant minds.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    date: '17 Jun, 2024',
    author: 'Praise Deborah',
    readTime: 5,
    fullContent: `Through my journey in CMUL, I discovered that leadership extends far beyond titles and positions. It's about creating meaningful connections with fellow students and fostering an environment where every voice matters.

    My experience serving in various capacities has taught me that true leadership emerges from genuine care for others and a commitment to collective growth. When I stepped into roles within NUNSA and COMPSSA, I realized that our strength lies not in individual achievements but in our ability to support one another through challenges.

    The medical field demands excellence, but it also requires compassion. As future healthcare professionals, we must learn to balance academic rigor with emotional intelligence, technical skills with human connection. This balance is what I aim to bring to COMPSSA leadership.`
  },
  {
    id: 2,
    title: 'Strengthening Student Welfare & Support Systems',
    description: 'Through my service in NUNSA and COMPSSA, I discovered that leadership is not about the positions I have been opportune to hold, but about the students I was called to serve, their struggles, their victories, and their need for support.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
    date: '20 Aug, 2024',
    author: 'Campaign Team',
    readTime: 4,
    fullContent: `Student welfare has always been at the heart of my service. During my tenure as Vice President of NUNSA, I witnessed firsthand how proper support systems can transform a student's academic journey and overall well-being.

    Mental Health Monday initiatives, welfare committees, and support programs aren't just activities—they're lifelines for students facing various challenges. Whether it's academic pressure, financial constraints, or personal struggles, having a robust support system makes all the difference.

    My vision for COMPSSA includes expanding these welfare programs, creating peer support networks, and ensuring that no student feels alone in their journey. Together, we can build a community that truly cares for its members.`
  },
  {
    id: 3,
    title: 'Building Bridges Across All Departments',
    description: 'As Vice President of NUNSA, I witnessed how a listening ear, a small initiative, or a united effort can make a lasting impact. I have come to learn from these moments that leadership is and should be service driven by vision, compassion, and responsibility.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop',
    date: '19 Nov, 2024',
    author: 'Praise Deborah',
    readTime: 6,
    fullContent: `One of the greatest challenges in COMPSSA is ensuring that every department feels valued and represented. Having worked across different committees and witnessed various departmental dynamics, I understand the importance of creating bridges rather than barriers.

    Each department—whether Medicine, Pharmacy, Nursing, or others—brings unique perspectives and strengths to our association. The key is fostering collaboration while respecting these differences. My experience in interdepartmental projects has shown me that when we work together, our collective impact is exponential.

    Building these bridges requires intentional effort, consistent communication, and a genuine appreciation for diversity. This is the foundation upon which I want to build a stronger COMPSSA.`
  },
  {
    id: 4,
    title: 'Implementing the FLAME Vision for COMPSSA',
    description: 'My F.L.A.M.E. agenda focuses on Foster Collaboration, Life & Wellbeing, Academics & Beyond, Mentorship & Leadership, and Excellence Through Impact - creating a comprehensive approach to student leadership and development.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop',
    date: '22 Dec, 2024',
    author: 'Strategy Team',
    readTime: 7,
    fullContent: `The F.L.A.M.E. agenda represents a comprehensive vision for transforming COMPSSA into a dynamic, student-centered organization. Each component has been carefully designed based on extensive consultation with students and analysis of our current challenges.

    Foster Collaboration emphasizes breaking down silos between departments and creating opportunities for meaningful interaction. Life & Wellbeing focuses on holistic student support beyond academics. Academics & Beyond ensures we maintain excellence while developing well-rounded individuals.

    Mentorship & Leadership creates pathways for skill development and career growth, while Excellence Through Impact ensures our activities create lasting positive change. This isn't just a campaign promise—it's a roadmap for transformation.`
  }
]

const flameAgenda: FlameItem[] = [
  {
    letter: 'F',
    title: 'Foster Collaboration',
    subtitle: 'Interdepartmental Collaboration',
    color: 'from-red-500 to-pink-500',
    description: 'Breaking down departmental silos and creating meaningful connections across all programs.',
    details: [
      'Cross-departmental project initiatives',
      'Regular interdepartmental social events',
      'Collaborative academic support systems',
      'Unified representation in university matters'
    ]
  },
  {
    letter: 'L',
    title: 'Life & Wellbeing',
    subtitle: 'Wholesome Student Wellbeing',
    color: 'from-pink-500 to-rose-500',
    description: 'Prioritizing mental health, work-life balance, and overall student wellness.',
    details: [
      'Expanded Mental Health Monday programs',
      'Stress management workshops',
      'Recreational activity planning',
      'Peer counseling networks'
    ]
  },
  {
    letter: 'A',
    title: 'Academics & Beyond',
    subtitle: 'Academic Support & Professional Growth',
    color: 'from-orange-500 to-red-500',
    description: 'Supporting academic excellence while fostering holistic development.',
    details: [
      'Study group facilitation',
      'Academic mentorship programs',
      'Professional development workshops',
      'Career guidance and placement support'
    ]
  },
  {
    letter: 'M',
    title: 'Mentorship & Leadership',
    subtitle: 'Leadership, Skills & Opportunities',
    color: 'from-yellow-500 to-orange-500',
    description: 'Creating pathways for leadership development and skill acquisition.',
    details: [
      'Leadership training programs',
      'Skill development workshops',
      'Mentorship matching systems',
      'Leadership opportunity creation'
    ]
  },
  {
    letter: 'E',
    title: 'Excellence Through Impact',
    subtitle: 'Service & Impact-Driven COMPSSA',
    color: 'from-green-500 to-teal-500',
    description: 'Ensuring all activities create meaningful, lasting positive change.',
    details: [
      'Community service initiatives',
      'Impact measurement systems',
      'Sustainable program development',
      'Legacy building projects'
    ]
  }
]

const experiences: Experience[] = [
  {
    category: 'NUNSA Leadership',
    positions: [
      { title: 'Vice President NUNSA Unilag', period: '2024/2025', type: 'leadership' },
      { title: 'Member, Sport Committee', period: '2023/2024', type: 'committee' },
      { title: 'Member, Welfare Committee', period: '2023/2024', type: 'committee' },
      { title: 'Member, Mental Health Monday', period: '2023/2024', type: 'committee' },
      { title: 'Planning Committee, NUNSA Sport week', period: '2023/2024', type: 'team' },
      { title: 'Welfare Committee, Mr. and Miss NUNSA', period: '2023/2024', type: 'committee' },
      { title: 'Medical Outreach Committee, NUNSA Health week', period: '2023/2024', type: 'committee' },
      { title: 'Overall health week planning committee', period: '2023/2024', type: 'team' }
    ]
  },
  {
    category: 'COMPSSA Involvement',
    positions: [
      { title: 'Member, Public Health Committee', period: '2024/2025', type: 'committee' },
      { title: 'Volunteer, International Women\'s Day', period: '2025', type: 'volunteer' },
      { title: 'Volunteer, Menstrual Hygiene Awareness', period: '2025', type: 'volunteer' },
      { title: 'Volunteer, Medical Outreach, COMPSSA week', period: '2024/2025', type: 'volunteer' },
      { title: 'Data and Welfare team, COMPSSA Sport Festival', period: '2025', type: 'team' },
      { title: 'Volunteer, COMPSSA Charity Drive 1.0', period: '2024', type: 'volunteer' },
      { title: 'Volunteer, COMPSSA Charity Drive 2.0', period: '2024', type: 'volunteer' },
      { title: 'Member, Welfare Committee', period: '2024/2025', type: 'committee' },
      { title: 'Member, Social committee', period: '2023/2024', type: 'committee' },
      { title: 'Volunteer, Trade fair committee, COMPSSA week', period: '2023/2024', type: 'volunteer' }
    ]
  },
  {
    category: 'National Level',
    positions: [
      { title: 'Special Representative to 28th NUNSA National VP', period: '2024', type: 'leadership' },
      { title: 'Special Representative to 29th NUNSA National President', period: '2024', type: 'leadership' },
      { title: 'Head of Opening Ceremony & Scientific Conference', period: '2024', type: 'leadership' },
      { title: 'Head of Logistics, NUNSA Digital Health Summit', period: '2024', type: 'leadership' },
      { title: 'NUNSA National Programs and Event Team', period: '2023/2024', type: 'team' },
      { title: 'Member, NUNSA National Welfare Committee', period: '2023/2024', type: 'committee' }
    ]
  }
]

const strengths: Strength[] = [
  { 
    name: 'Organizational Excellence', 
    icon: 'lucide:target', 
    description: 'Bringing order to complex situations with clarity and structure.' 
  },
  { 
    name: 'Adaptability', 
    icon: 'lucide:lightbulb', 
    description: 'Thriving in uncertainty and adjusting fluidly to changing circumstances.' 
  },
  { 
    name: 'Compassionate Heart', 
    icon: 'lucide:heart', 
    description: 'Natural inclination towards understanding and caring for others.' 
  },
  { 
    name: 'Collaborative Spirit', 
    icon: 'lucide:users', 
    description: 'Creating environments where every voice is heard and valued.' 
  },
  { 
    name: 'Resilience', 
    icon: 'lucide:award', 
    description: 'Persisting through challenges with determination and grace.' 
  },
  { 
    name: 'Emotional Intelligence', 
    icon: 'lucide:star', 
    description: 'Leading with empathy, patience, and understanding.' 
  },
  { 
    name: 'Knack for Service', 
    icon: 'lucide:hand-heart', 
    description: 'Natural instinct to serve and make things better for others.' 
  },
  { 
    name: 'Intellectual Curiosity', 
    icon: 'lucide:brain', 
    description: 'Hunger to learn and never limit myself to what I already know.' 
  },
  { 
    name: 'Big-Picture Thinking', 
    icon: 'lucide:telescope', 
    description: 'Connecting today\'s efforts with tomorrow\'s possibilities and focusing on legacy.' 
  }
]

const personalHobbies: PersonalHobby[] = [
  {
    title: 'Writing',
    description: 'Writing is my loudest quiet place. Through poetry and my weekly "My Love" posts, I pour out thoughts that encourage, breathe life, remind people of their faith, or simply reflect what\'s on my heart. Sometimes it\'s deep, sometimes raw, but always real.',
    emoji: '✍️',
    bgClass: 'bg-gradient-to-br from-pink-100 to-rose-100',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500'
  },
  {
    title: 'Beading',
    description: 'When I\'m not writing, you\'ll find me with beads. I\'m not just a casual beader—I\'m a professional with my own brand. What started as a hobby has grown into both a business and a safe haven where creativity flows freely.',
    emoji: '💎',
    bgClass: 'bg-gradient-to-br from-purple-100 to-indigo-100',
    iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-500'
  },
  {
    title: 'Being Creative',
    description: 'Whether it\'s coming up with ideas, designing, or trying something new, creativity runs through everything I do. It keeps me alive, curious, and excited about tomorrow\'s possibilities.',
    emoji: '🎨',
    bgClass: 'bg-gradient-to-br from-orange-100 to-yellow-100',
    iconBg: 'bg-gradient-to-br from-orange-500 to-yellow-500'
  },
  {
    title: 'Watching Movies',
    description: 'I\'m a movie lover who gets completely invested. I laugh louder than necessary, cry when no one else is crying. It\'s never just a movie with me—it\'s an experience that touches the heart.',
    emoji: '🎬',
    bgClass: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  }
]

const visionPoints = [
  "Every student values the uniqueness of their colleagues' courses, without any department feeling superior or inferior.",
  "Academics remain a priority, but with room for balance because medical students deserve to live beyond the books.",
  "Unity, care, and support become our core values, making COMPSSA a true community that serves and belongs to us all."
]

// Computed properties
const getModalTitle = computed(() => {
  if (!activeModal.value) return ''
  
  switch (activeModal.value.type) {
    case 'article':
      return activeModal.value.data?.title || 'Article'
    case 'flame-detail':
      return `${activeModal.value.data?.title} Details` || 'FLAME Details'
    case 'vision':
      return 'My Vision for COMPSSA'
    case 'flame':
      return 'F.L.A.M.E. Agenda Overview'
    case 'experience':
      return 'Complete Leadership Experience'
    case 'contact':
      return 'Get In Touch'
    case 'support':
      return 'Join the Movement'
    default:
      return 'Information'
  }
})

// Methods
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % campaignArticles.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + campaignArticles.length) % campaignArticles.length
}

const openModal = (modalType: string, data: any = null) => {
  activeModal.value = { type: modalType, data }
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  activeModal.value = null
  document.body.style.overflow = 'auto'
}

const getPositionIcon = (type: string): string => {
  switch (type) {
    case 'leadership':
      return 'lucide:star'
    case 'committee':
      return 'lucide:users'
    case 'volunteer':
      return 'lucide:heart'
    case 'team':
      return 'lucide:target'
    default:
      return 'lucide:circle'
  }
}

// Lifecycle hooks
onMounted(() => {
  // Typewriter effect
  let typewriterInterval: NodeJS.Timeout
  
  const startTypewriter = () => {
    if (!isPlaying.value) return
    
    let currentText = ''
    let currentIndex = 0
    let isDeleting = false
    
    const type = () => {
      if (!isPlaying.value) return
      
      const quote = quotes[currentQuote.value]
      
      if (isDeleting) {
        currentText = quote.substring(0, currentIndex - 1)
        currentIndex--
      } else {
        currentText = quote.substring(0, currentIndex + 1)
        currentIndex++
      }
      
      typewriterText.value = currentText
      
      if (!isDeleting && currentIndex === quote.length) {
        setTimeout(() => {
          isDeleting = true
          setTimeout(type, 50)
        }, 2000)
        return
      } else if (isDeleting && currentIndex === 0) {
        isDeleting = false
        currentQuote.value = (currentQuote.value + 1) % quotes.length
        setTimeout(type, 100)
        return
      }
      
      const speed = isDeleting ? 50 : 100
      setTimeout(type, speed)
    }
    
    type()
  }
  
  startTypewriter()
  
  // Auto-advance carousel
  const carouselInterval = setInterval(() => {
    if (isPlaying.value) {
      nextSlide()
    }
  }, 5000)
  
  // Watch for play/pause changes
  watch(isPlaying, (newValue) => {
    if (newValue) {
      startTypewriter()
    }
  })
  
  // Cleanup
  onUnmounted(() => {
    clearInterval(carouselInterval)
    if (typewriterInterval) clearInterval(typewriterInterval)
    document.body.style.overflow = 'auto'
  })
  
  // Handle escape key
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && activeModal.value) {
      closeModal()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// SEO Head
useHead({
  title: 'Praise4VP - Inspiring Impacts, Building Bridges | COMPSSA Campaign',
  meta: [
    {
      name: 'description',
      content: 'Olawuyi Praise Deborah for COMPSSA Vice President. Discover the F.L.A.M.E. agenda: Foster Collaboration, Life & Wellbeing, Academics & Beyond, Mentorship & Leadership, Excellence Through Impact.'
    },
    {
      property: 'og:title',
      content: 'Praise4VP - Inspiring Impacts, Building Bridges'
    },
    {
      property: 'og:description',
      content: 'A comprehensive vision for transforming COMPSSA into a dynamic, student-centered organization that serves every member with excellence.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'keywords',
      content: 'COMPSSA, Vice President, Student Leadership, CMUL, Nursing, FLAME Agenda, Student Welfare, Campaign'
    }
  ]
})
</script>

<style scoped>
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out both;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out both;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

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

/* Animation delays */
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-800 { animation-delay: 0.8s; }

/* Custom scrollbar */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-7xl {
    font-size: 3rem;
  }
}

/* Focus styles for accessibility */
button:focus,
.focusable:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>