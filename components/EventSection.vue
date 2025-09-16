<template>
  <div class="relative min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 opacity-10">
      <!-- Top left decorative pattern -->
      <div class="absolute top-20 left-10 w-32 h-32">
        <div class="w-full h-full bg-pink-300 rounded-full opacity-30"></div>
      </div>
      <!-- Top right decorative pattern -->
      <div class="absolute top-32 right-20 w-24 h-24">
        <div class="w-full h-full bg-purple-300 rounded-full opacity-40"></div>
      </div>
      <!-- Bottom decorative elements -->
      <div class="absolute bottom-40 left-1/4 w-20 h-20">
        <div class="w-full h-full bg-pink-200 rounded-full opacity-50"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 px-4 py-16">
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-16">
          <p class="text-sm text-blue-600 font-medium mb-3 tracking-wide uppercase">Upcoming Events</p>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Visit Our Recent Events</h1>
          <p class="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            Collaboratively disseminate wireless innovation with standards compliant e-business. Phosfluorescently 
            expedite functional products via premium action items.
          </p>
        </div>

        <!-- Events Grid -->
        <div class="space-y-8">
          <!-- Event 1 -->
          <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="flex flex-col lg:flex-row">
              <!-- Image -->
              <div class="lg:w-1/3">
                <div class="relative h-64 lg:h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Community meeting with elderly person and young professional" 
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <!-- Content -->
              <div class="lg:w-2/3 p-8 flex flex-col justify-center">
                <div class="mb-4">
                  <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Programme
                  </span>
                </div>
                
                <div class="mb-3">
                  <span class="text-red-500 text-sm font-medium">August 12, 2023</span>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  What are the Weakest Spots Economy of the US?
                </h3>
                
                <p class="text-gray-600 mb-6 leading-relaxed">
                  The United States' and China's relations will cast a pall over relations and the global economy. 
                  From climate change to...
                </p>
                
                <div class="flex justify-between items-center">
                  <button class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    Read More
                  </button>
                  <button class="flex items-center text-red-500 hover:text-red-700 font-medium transition-colors duration-200">
                    Share
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Event 2 -->
          <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="flex flex-col lg:flex-row">
              <!-- Image -->
              <div class="lg:w-1/3">
                <div class="relative h-64 lg:h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Woman holding 'The Future is Female' protest sign" 
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <!-- Content -->
              <div class="lg:w-2/3 p-8 flex flex-col justify-center">
                <div class="mb-4">
                  <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Programme
                  </span>
                </div>
                
                <div class="mb-3">
                  <span class="text-red-500 text-sm font-medium">August 10, 2023</span>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  Lets Meet Your Candidate In America
                </h3>
                
                <p class="text-gray-600 mb-6 leading-relaxed">
                  The United States' and China's relations will cast a pall over relations and the global economy. 
                  From climate change to...
                </p>
                
                <div class="flex justify-between items-center">
                  <button class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    Read More
                  </button>
                  <button class="flex items-center text-red-500 hover:text-red-700 font-medium transition-colors duration-200">
                    Share
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Event 3 -->
          <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div class="flex flex-col lg:flex-row">
              <!-- Image -->
              <div class="lg:w-1/3">
                <div class="relative h-64 lg:h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Person in hijab at civic engagement event with American flag" 
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <!-- Content -->
              <div class="lg:w-2/3 p-8 flex flex-col justify-center">
                <div class="mb-4">
                  <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Programme
                  </span>
                </div>
                
                <div class="mb-3">
                  <span class="text-red-500 text-sm font-medium">August 12, 2023</span>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  Lets Meet Your Candidate In America
                </h3>
                
                <p class="text-gray-600 mb-6 leading-relaxed">
                  The United States' and China's relations will cast a pall over relations and the global economy. 
                  From climate change to...
                </p>
                
                <div class="flex justify-between items-center">
                  <button class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                    Read More
                  </button>
                  <button class="flex items-center text-red-500 hover:text-red-700 font-medium transition-colors duration-200">
                    Share
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Interface for event data structure
interface Event {
  id: number;
  category: string;
  date: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

// Event data (can be moved to composables or API)
const events: Event[] = [
  {
    id: 1,
    category: "Programme",
    date: "August 12, 2023",
    title: "What are the Weakest Spots Economy of the US?",
    description: "The United States' and China's relations will cast a pall over relations and the global economy. From climate change to...",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Community meeting with elderly person and young professional"
  },
  {
    id: 2,
    category: "Programme",
    date: "August 10, 2023",
    title: "Lets Meet Your Candidate In America",
    description: "The United States' and China's relations will cast a pall over relations and the global economy. From climate change to...",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Woman holding 'The Future is Female' protest sign"
  },
  {
    id: 3,
    category: "Programme",
    date: "August 12, 2023",
    title: "Lets Meet Your Candidate In America",
    description: "The United States' and China's relations will cast a pall over relations and the global economy. From climate change to...",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Person in hijab at civic engagement event with American flag"
  }
];

// Functions for handling interactions
const handleReadMore = (eventId: number) => {
  console.log(`Reading more about event ${eventId}`);
  // Navigation or modal logic here
};

const handleShare = (eventId: number) => {
  console.log(`Sharing event ${eventId}`);
  // Share functionality here
};
</script>

<style scoped>
/* Additional custom styles if needed */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>