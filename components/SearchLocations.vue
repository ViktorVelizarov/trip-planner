<template>
    <div class="bg-gray-100">
      <div class="flex flex-col items-center mt-16 ">
        <h1 class="text-4xl font-bold">More things to do in...</h1>
        <div class="relative mt-7">
          <input type="text" :value="destination" @input="$emit('update:destination', $event.target.value)" placeholder="Enter destination"
          class="bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full py-2 px-4 w-64 sm:w-80 border border-gray-300 placeholder-gray-400">
        </div>
      </div>
      <div class="mt-4">
        <div v-for="location in locations" :key="location.id" class="bg-white rounded-lg shadow-md p-4 mb-4 flex">
          <div class="flex-shrink-0 mr-4">
            <div class="w-36 h-36 flex items-center justify-center bg-gray-200">
              <img v-if="thumbnailUrls[location.location_id]" :src="thumbnailUrls[location.location_id]" alt="Thumbnail" class="w-full h-full object-cover">
              <div v-else class="loader"></div>
            </div>
            <div class="mt-2 w-36 h-16 flex items-center justify-center ">
              <img v-if="location.rating_image_url" :src="location.rating_image_url" alt="Rating" class="">
              <div v-else class="loader"></div>
            </div>
            <button @click="addToItinerary(location)" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
              Add to Itinerary
            </button>
          </div>
          <div class="flex-grow">
            <p v-if="loading" class="loader-text">Loading...</p>
            <p v-else class="font-bold text-xl">{{ location.name }}</p>
            <p v-if="loading" class="loader-text">Loading...</p>
            <p v-else class="font-semibold mb-6 mt-2">{{ location.ranking_string }}</p>
            <p v-if="loading" class="loader-text">Loading...</p>
            <p v-else>{{ location.description || 'No description available' }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      destination: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        locations: [],
        loading: true,
        thumbnailUrls: {}
      };
    },
    async created() {
      await this.fetchLocations();
    },
    methods: {
      async fetchLocations() {
        try {
          const response = await fetch(`/api/GetLocations/${this.destination}`);
          const data = await response.json();
          this.locations = data.data.slice(1) || [];
  
          for (const location of this.locations) {
            const thumbnailUrl = await this.getLocationThumbnail(location.location_id);
            this.thumbnailUrls[location.location_id] = thumbnailUrl;
          }
  
          for (const location of this.locations) {
            await this.getLocationDetails(location.location_id);
          }
  
          this.loading = false;
        } catch (error) {
          console.error("Error fetching locations:", error);
          this.loading = false;
        }
      },
      async getLocationDetails(locationId) {
        try {
          const response = await fetch(`/api/GetLocationDetails/${locationId}`);
          const data = await response.json();

          const locationLatitude = data.latitude;
          const locationLongitude = data.longitude;

          const description = data.description ? data.description.split('. ').slice(0, 2).join('. ') + '.' : null;
          const ranking_string = data.ranking_data.ranking_string;
          const rating_image_url = data.rating_image_url;
          const location = this.locations.find(location => location.location_id === locationId);
          location.description = description;
          location.ranking_string = ranking_string;
          location.rating_image_url = rating_image_url;
          location.latitude = locationLatitude;
          location.longitude = locationLongitude;
        } catch (error) {
          console.error("Error fetching details for location:", error);
        }
      },
      async getLocationThumbnail(locationId) {
        try {
          const response = await fetch(`/api/GetLocationPhotos/${locationId}`);
          const data = await response.json();
          return data.data[0].images.original.url;
        } catch (error) {
          console.error("Error fetching thumbnail for location:", error);
          return "";
        }
      },
      addToItinerary(location) {
        const { name, description, latitude, longitude } = location;
        this.$emit('add-location', { name, description, latitude, longitude });
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s ease infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .loader-text {
    background-color: #f3f3f3;
    color: transparent;
    border-radius: 4px;
    display: inline-block;
    height: 1em;
    width: 100%;
  }
  
  .loader-text::before {
    content: '\\00a0';
  }
  
  .object-cover {
    object-fit: cover;
  }
  </style>
  