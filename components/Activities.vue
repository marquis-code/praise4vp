<template>
  <div>
    <InfiniteCarousel 
      :images="carouselImages" 
      :speed="60"
      :item-width="320"
      :item-height="420"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// All service image imports (extensions normalized to lowercase)
import serviceDot30 from "@/assets/img/service.30.jpg"
import serviceMain from "@/assets/img/service.jpg"
import service1 from "@/assets/img/service1.jpeg"
import service2 from "@/assets/img/service2.jpeg"
import service3 from "@/assets/img/service3.jpeg"
import service4 from "@/assets/img/service4.jpeg"
import service5 from "@/assets/img/service5.jpeg"
import service6 from "@/assets/img/service6.jpeg"
import service7 from "@/assets/img/service7.jpeg"
import service8 from "@/assets/img/service8.jpeg"
import service9 from "@/assets/img/service9.jpeg"
import service10 from "@/assets/img/service10.jpeg"
import service11 from "@/assets/img/service11.jpeg"
import service12 from "@/assets/img/service12.jpeg"
import service13 from "@/assets/img/service13.jpeg"
import service14 from "@/assets/img/service14.jpeg"
import service15 from "@/assets/img/service15.jpeg"
import service16 from "@/assets/img/service16.jpg"
import service17 from "@/assets/img/service17.jpg"
import service18 from "@/assets/img/service18.jpg"
import service19 from "@/assets/img/service19.jpg"
import service20 from "@/assets/img/service20.jpg"
import service21 from "@/assets/img/service21.jpg"
import service22 from "@/assets/img/service22.jpg"
import service23 from "@/assets/img/service23.jpg"
import service25 from "@/assets/img/service25.jpg"
import service26 from "@/assets/img/service26.jpg"
import service27 from "@/assets/img/service27.jpg"
import service28 from "@/assets/img/service28.jpg"
import service29 from "@/assets/img/service29.jpg"
import service31 from "@/assets/img/service31.jpeg"
import service32 from "@/assets/img/service32.jpg"
import service33 from "@/assets/img/service33.jpg"
import service34 from "@/assets/img/service34.jpg"
import service35 from "@/assets/img/service35.jpg"
import service36 from "@/assets/img/service36.png"
import service37 from "@/assets/img/service37.png"
import service38 from "@/assets/img/service38.jpg"
import service39 from "@/assets/img/service39.jpg"
import service40 from "@/assets/img/service40.jpg"
import service41 from "@/assets/img/service41.png"
import service42 from "@/assets/img/service42.jpg"
import service43 from "@/assets/img/service43.jpg"
import service44 from "@/assets/img/service44.jpg"
import service45 from "@/assets/img/service45.jpg"
import service46 from "@/assets/img/service46.jpg"
import srvice24 from "@/assets/img/srvice24.jpg" // kept the typoed filename as seen in your screenshot

// Put them into the carousel array (order can be adjusted as needed)
const carouselImages = ref([
  { src: serviceMain, alt: 'Service (main)' },
  { src: serviceDot30, alt: 'Service 30 (dot)' },
  { src: service1, alt: 'Service 1' },
  { src: service2, alt: 'Service 2' },
  { src: service3, alt: 'Service 3' },
  { src: service4, alt: 'Service 4' },
  { src: service5, alt: 'Service 5' },
  { src: service6, alt: 'Service 6' },
  { src: service7, alt: 'Service 7' },
  { src: service8, alt: 'Service 8' },
  { src: service9, alt: 'Service 9' },
  { src: service10, alt: 'Service 10' },
  { src: service11, alt: 'Service 11' },
  { src: service12, alt: 'Service 12' },
  { src: service13, alt: 'Service 13' },
  { src: service14, alt: 'Service 14' },
  { src: service15, alt: 'Service 15' },
  { src: service16, alt: 'Service 16' },
  { src: service17, alt: 'Service 17' },
  { src: service18, alt: 'Service 18' },
  { src: service19, alt: 'Service 19' },
  { src: service20, alt: 'Service 20' },
  { src: service21, alt: 'Service 21' },
  { src: service22, alt: 'Service 22' },
  { src: service23, alt: 'Service 23' },
  { src: service25, alt: 'Service 25' },
  { src: service26, alt: 'Service 26' },
  { src: service27, alt: 'Service 27' },
  { src: service28, alt: 'Service 28' },
  { src: service29, alt: 'Service 29' },
  { src: service31, alt: 'Service 31' },
  { src: service32, alt: 'Service 32' },
  { src: service33, alt: 'Service 33' },
  { src: service34, alt: 'Service 34' },
  { src: service35, alt: 'Service 35' },
  { src: service36, alt: 'Service 36' },
  { src: service37, alt: 'Service 37' },
  { src: service38, alt: 'Service 38' },
  { src: service39, alt: 'Service 39' },
  { src: service40, alt: 'Service 40' },
  { src: service41, alt: 'Service 41' },
  { src: service42, alt: 'Service 42' },
  { src: service43, alt: 'Service 43' },
  { src: service44, alt: 'Service 44' },
  { src: service45, alt: 'Service 45' },
  { src: service46, alt: 'Service 46' },
  { src: srvice24, alt: 'Srvice 24 (typo filename)' },
])

// page meta
definePageMeta({
  layout: false
})

</script>

<style scoped>
/* Optional styles */
</style>
