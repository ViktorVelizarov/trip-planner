<template>
  <div>
    <h1 class="text-5xl font-bold mt-16 ml-16">I'm ready for an adventure in...</h1>
    <div class="relative ml-16 mt-7">
  <input type="text" v-model="destination" @input="searchDestination" placeholder="Enter destination"
    class="bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full py-2 px-4 w-64 sm:w-80 border border-gray-300 placeholder-gray-400">
</div>
    <!-- Cards for locations -->
    <div class="mt-4">
      <div v-for="location in locations" :key="location.id" class="bg-white rounded-lg shadow-md p-4 mb-4 flex">
        <!-- Thumbnail on the left -->
        <img v-if="!loading" :src="thumbnailUrls[location.location_id]" alt="Thumbnail" class="w-36 h-32 mr-4">

        <!-- Content on the right -->
        <div>
          <p class="font-bold">{{ location.name }}</p>
          <p>{{ location.address_string }}</p>
          <p>{{ location.ranking_string }}</p>
          <img :src="location.rating_image_url" alt="Rating" class="w-16 h-16">
          <p v-if="loading">Loading...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locations: [], // Initialize locations as an empty array
      loading: true,
      thumbnailUrls: {}, // Object to store thumbnail URLs for each location
      destination: "Paris" // Default destination
    };
  },
  async mounted() {
    await this.fetchLocations();
  },
  methods: {
    async fetchLocations() {
      try {
        const response = await fetch(`/api/GetLocations/${this.destination}`);
        const data = await response.json();
        this.locations = data.data.slice(1) || []; // Set the fetched locations to the data property

        // Fetch thumbnail URLs for each location
        for (const location of this.locations) {
          const thumbnailUrl = await this.getLocationThumbnail(location.location_id);
          this.thumbnailUrls[location.location_id] = thumbnailUrl; // Direct assignment
        }

        // Fetch details for each location
        for (const location of this.locations) {
          await this.getLocationDetails(location.location_id);
        }

        // Once all details are fetched, set loading to false
        this.loading = false;
      } catch (error) {
        console.error("Error fetching locations:", error);
        this.loading = false; // Set loading to false in case of error
      }
    },
    async getLocationDetails(locationId) {
      try {
        const response = await fetch(`/api/GetLocationDetails/${locationId}`);
        const data = await response.json();
        const addressString = data.address_obj.address_string;
        const ranking_string = data.ranking_data.ranking_string;
        const rating_image_url = data.rating_image_url;
        this.locations.find((location) => location.location_id === locationId).address_string = addressString;
        this.locations.find((location) => location.location_id === locationId).ranking_string = ranking_string;
        this.locations.find((location) => location.location_id === locationId).rating_image_url = rating_image_url;
      } catch (error) {
        console.error("Error fetching details for location:", error);
      }
    },
    async getLocationThumbnail(locationId) {
      try {
        const response = await fetch(`/api/GetLocationPhotos/${locationId}`);
        const data = await response.json();
        return data.data[0].images.medium.url;
      } catch (error) {
        console.error("Error fetching thumbnail for location:", error);
        return ""; // Return empty string if there's an error
      }
    },
    async searchDestination() {
      this.loading = true;
      await this.fetchLocations();
    }
  },
};
</script>
