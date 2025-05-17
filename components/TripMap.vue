<template>
    <GMapMap
      :center="center"
      :zoom="13"
      map-type-id="roadmap"
      style="width: 100%; height: 500px"
    >
      <!-- Trip Markers -->
      <GMapMarker
        v-for="(point, index) in tripPoints"
        :key="index"
        :position="point"
      />
  
      <!-- Trip Path (Polyline) -->
      <GMapPolyline
        :path="tripPoints"
        :options="polylineOptions"
      />
    </GMapMap>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface LatLng {
    lat: number
    lng: number
  }
  
  // Trip points (example)
  const tripPoints = ref<LatLng[]>([
    { lat: 6.5244, lng: 3.3792 }, // Start
    { lat: 6.5304, lng: 3.3845 },
    { lat: 6.5352, lng: 3.3900 }, // End
  ])
  
  const center = ref<LatLng>(tripPoints.value[0])
  
  const polylineOptions = {
    strokeColor: '#3367D6',
    strokeOpacity: 1.0,
    strokeWeight: 4,
  }
  </script>
  