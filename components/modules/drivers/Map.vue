<template>
    <div ref="mapContainer" class="google-map-container h-full w-full"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { Loader } from "@googlemaps/js-api-loader"
  
  const props = defineProps<{
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    markers?: Array<{
      position: { lat: number; lng: number };
      title: string;
      icon?: string;
    }>;
    apiKey: string;
  }>();
  
  const mapContainer = ref<HTMLElement | null>(null);
  const map = ref<google.maps.Map | null>(null);
  const directionsService = ref<google.maps.DirectionsService | null>(null);
  const directionsRenderer = ref<google.maps.DirectionsRenderer | null>(null);
  const markersArray = ref<google.maps.Marker[]>([]);
  const googleMapsLoaded = ref(false);
  const googleMapsLoadError = ref(false);
  
  // Load Google Maps API
  const loadGoogleMapsApi = () => {
    if (window.google && window.google.maps) {
      googleMapsLoaded.value = true;
      initMap();
      return;
    }
  
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      googleMapsLoaded.value = true;
      initMap();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      googleMapsLoadError.value = true;
    };
    
    document.head.appendChild(script);
  };
  
  // Initialize the map
  const initMap = () => {
    if (!mapContainer.value || !window.google || !window.google.maps) return;
    
    try {
      // Create the map
      map.value = new window.google.maps.Map(mapContainer.value, {
        center: props.origin,
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        fullscreenControl: false,
      });
      
      // Create directions service and renderer
      directionsService.value = new window.google.maps.DirectionsService();
      directionsRenderer.value = new window.google.maps.DirectionsRenderer({
        map: map.value,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#7c3aed',
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });
      
      // Add markers
      addMarkers();
      
      // Calculate and display route
      calculateRoute();
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  };
  
  // Add markers to the map
  const addMarkers = () => {
    if (!map.value || !window.google) return;
    
    // Clear existing markers
    clearMarkers();
    
    // Add custom markers if provided
    if (props.markers && props.markers.length > 0) {
      props.markers.forEach(markerData => {
        let icon;
        
        if (markerData.icon === 'pickup') {
          icon = {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          };
        } else if (markerData.icon === 'dropoff') {
          icon = {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          };
        }
        
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: map.value,
          title: markerData.title,
          icon: icon,
          animation: window.google.maps.Animation.DROP
        });
        
        markersArray.value.push(marker);
      });
    } else {
      // Add default origin and destination markers
      const originMarker = new window.google.maps.Marker({
        position: props.origin,
        map: map.value,
        title: 'Origin',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        animation: window.google.maps.Animation.DROP
      });
      
      const destinationMarker = new window.google.maps.Marker({
        position: props.destination,
        map: map.value,
        title: 'Destination',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        },
        animation: window.google.maps.Animation.DROP
      });
      
      markersArray.value.push(originMarker, destinationMarker);
    }
  };
  
  // Clear all markers from the map
  const clearMarkers = () => {
    markersArray.value.forEach(marker => {
      marker.setMap(null);
    });
    markersArray.value = [];
  };
  
  // Calculate and display the route
  const calculateRoute = () => {
    if (!directionsService.value || !directionsRenderer.value) return;
    
    directionsService.value.route(
      {
        origin: props.origin,
        destination: props.destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          directionsRenderer.value?.setDirections(response);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  };
  
  // Watch for changes in origin or destination
  watch(() => [props.origin, props.destination], () => {
    if (googleMapsLoaded.value) {
      addMarkers();
      calculateRoute();
    }
  }, { deep: true });
  
  // Lifecycle hooks
  onMounted(() => {
    loadGoogleMapsApi();
  });
  
  onUnmounted(() => {
    // Clean up
    clearMarkers();
    if (directionsRenderer.value) {
      directionsRenderer.value.setMap(null);
    }
  });
  </script>