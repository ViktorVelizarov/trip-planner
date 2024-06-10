<template>
    <div class="popup-container">
      <div v-if="loading" class="flex justify-center items-center h-40">
        <div class="loader"></div>
      </div>
      <div v-else-if="dataLoaded" class="relative">
        <img v-if="imageUrl" :src="imageUrl" :alt="name" class="w-full h-full object-cover rounded-lg">
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-lg">
          <h3 class="text-white text-xl font-bold">{{ name }}</h3>
          <p class="text-white">{{ description }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      destination: String,
      coordinates: Object
    },
    data() {
      return {
        loading: true,
        dataLoaded: false,
        imageUrl: '',
        name: '',
        description: ''
      };
    },
    async mounted() {
      try {
        const response = await fetch(`/api/GetLocationByName?destination=${encodeURIComponent(this.destination)}&lat=${this.coordinates.lat}&long=${this.coordinates.long}`);
        const data = await response.json();
  
        this.imageUrl = data.imageUrl;
        this.name = data.name;
        this.description = data.description;
  
        this.loading = false;
        this.dataLoaded = true;
      } catch (error) {
        console.error('Error fetching location data:', error);
        this.loading = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4a90e2;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s infinite linear;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  