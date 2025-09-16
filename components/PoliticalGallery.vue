<template>
  <div class="relative min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
    <!-- Header Section -->
    <div class="text-center mb-16">
      <p class="text-sm text-blue-600 font-medium mb-3 tracking-wide uppercase">Our Gallery</p>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Political Gallery</h1>
      <p class="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur numquam magnam, sed perspiciatis mollitia nesciunt amet, 
        consequuntur error culpa nobis dolore asperiores eum non quasi
      </p>
    </div>

    <!-- Gallery Grid -->
    <div class="max-w-7xl mx-auto">
      <!-- Desktop Grid Layout -->
      <div class="hidden lg:block">
        <div class="grid grid-cols-12 gap-6 h-[600px]">
          <!-- Top Row - 3 columns -->
          <div class="col-span-4 h-[280px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Person with American flag" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          </div>

          <div class="col-span-4 h-[280px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Raised fists in solidarity" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          </div>

          <div class="col-span-4 h-[280px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Political figure speaking at podium" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          </div>

          <!-- Bottom Row - Mixed Layout -->
          <div class="col-span-6 h-[280px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Protest demonstration with megaphone" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          </div>

          <div class="col-span-3 h-[280px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Group of young diverse people" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          </div>

          <div class="col-span-3 h-[280px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1566479179817-0b5cd1b7e665?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Political rally or gathering" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tablet Grid Layout -->
      <div class="hidden md:block lg:hidden">
        <div class="grid grid-cols-6 gap-4 auto-rows-[200px]">
          <div class="col-span-2 row-span-1 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Person with American flag" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div class="col-span-2 row-span-1 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Raised fists in solidarity" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div class="col-span-2 row-span-1 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Political figure speaking at podium" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div class="col-span-3 row-span-1 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Protest demonstration with megaphone" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div class="col-span-3 row-span-1 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Group of young diverse people" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Grid Layout -->
      <div class="block md:hidden">
        <div class="grid grid-cols-2 gap-4 auto-rows-[180px]">
          <div class="col-span-2 overflow-hidden rounded-xl shadow-lg">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Protest demonstration with megaphone" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <div class="col-span-1 overflow-hidden rounded-xl shadow-lg">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Person with American flag" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <div class="col-span-1 overflow-hidden rounded-xl shadow-lg">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Raised fists in solidarity" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <div class="col-span-2 overflow-hidden rounded-xl shadow-lg">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Political figure speaking at podium" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <div class="col-span-1 overflow-hidden rounded-xl shadow-lg">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Group of young diverse people" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <div class="col-span-1 overflow-hidden rounded-xl shadow-lg">
            <div class="relative w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1566479179817-0b5cd1b7e665?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Political rally or gathering" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View More Button -->
    <div class="text-center mt-12">
      <button 
        @click="handleViewMore"
        class="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        View More Gallery
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Gallery item interface
interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category?: string;
  title?: string;
}

// Gallery data
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Person with American flag",
    category: "Patriotic",
    title: "American Pride"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Raised fists in solidarity",
    category: "Unity",
    title: "Solidarity Movement"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Political figure speaking at podium",
    category: "Leadership",
    title: "Political Address"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    alt: "Protest demonstration with megaphone",
    category: "Activism",
    title: "Voice of the People"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Group of young diverse people",
    category: "Community",
    title: "Youth Engagement"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1566479179817-0b5cd1b7e665?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Political rally or gathering",
    category: "Rally",
    title: "Political Gathering"
  }
];

// Event handlers
const handleViewMore = () => {
  console.log('View more gallery clicked');
  // Navigation logic here - could navigate to full gallery page
  // await navigateTo('/gallery')
};

const handleImageClick = (item: GalleryItem) => {
  console.log('Image clicked:', item.title);
  // Could open lightbox or navigate to detail view
};

// Reactive data
const isLoading = ref(false);
const selectedCategory = ref('all');

// Computed properties
const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return galleryItems;
  }
  return galleryItems.filter(item => 
    item.category?.toLowerCase() === selectedCategory.value.toLowerCase()
  );
});

// Meta information
definePageMeta({
  title: 'Political Gallery',
  description: 'Browse our collection of political moments and civic engagement'
});
</script>

<style scoped>
/* Custom hover effects */
/* .gallery-item {
  @apply relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer;
}

.gallery-item::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 z-10;
}

.gallery-item:hover::before {
  @apply opacity-100;
}

.gallery-item img {
  @apply w-full h-full object-cover transition-transform duration-300 group-hover:scale-105;
} */

/* Custom scrollbar for potential overflow */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animation classes */
.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>