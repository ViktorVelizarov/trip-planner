<template>
    <div>
      <h1 class="text-4xl font-bold mt-16 ml-16">More things to do in...</h1>
      <div class="relative ml-16 mt-7">
        <input type="text" :value="destination" @input="$emit('update:destination', $event.target.value)" placeholder="Enter destination"
        class="bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full py-2 px-4 w-64 sm:w-80 border border-gray-300 placeholder-gray-400">
      </div>
      <div class="mt-4">
        <div v-for="location in locations" :key="location.id" class="bg-white rounded-lg shadow-md p-4 mb-4 flex">
          <img v-if="!loading" :src="thumbnailUrls[location.location_id]" alt="Thumbnail" class="w-36 h-32 mr-4">
          <div>
            <p class="font-bold">{{ location.name }}</p>
            <p class="font-semibold">{{ location.ranking_string }}</p>
            <p>{{ location.description }}</p>
            
            <img :src="location.rating_image_url" alt="Rating" class="w-16 h-16">
            <p v-if="loading">Loading...</p>
          </div>
          <button @click="addToItinerary(location)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add to Itinerary
          </button>
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
          
          const description = data.description;
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
  /* Add any necessary styles here */
  </style>
  