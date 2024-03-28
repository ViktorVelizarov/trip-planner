<template>
  <div>
    <h1 class="text-5xl font-bold mt-16">I'm ready for an adventure in...</h1>

    <Alert></Alert>
    <!-- Cards for locations -->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div v-for="location in locations" :key="location.id" class="bg-white rounded-lg shadow-md p-4">
        <p>ID: {{ location.location_id }}</p>
        <p>Name: {{ location.name }}</p>
        <p v-if="loading">Loading...</p>
        <img v-else :src="thumbnailUrls[location.location_id]" alt="Thumbnail">
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
      thumbnailUrls: {} // Object to store thumbnail URLs for each location
    }
  },
  async mounted() {
    try {
      const destination = "Paris"; // You can change this to dynamically set the destination
      const response = await fetch(`/api/GetLocations/${destination}`);
      const data = await response.json();
      this.locations = data.data || []; // Set the fetched locations to the data property

      // Fetch thumbnail URLs for each location
      for (const location of this.locations) {
        const thumbnailUrl = await this.getLocationThumbnail(location.location_id);
        this.thumbnailUrls[location.location_id] = thumbnailUrl; // Direct assignment
      }

      // Once all thumbnails are fetched, set loading to false
      this.loading = false;
    } catch (error) {
      console.error('Error fetching locations:', error);
      this.loading = false; // Set loading to false in case of error
    }
  },  
  methods: {
    async getLocationThumbnail(locationId) {
      try {
        const response = await fetch(`/api/GetLocationPhotos/${locationId}`);
        const data = await response.json();
        return data.data[0].images.thumbnail.url;
      } catch (error) {
        console.error('Error fetching thumbnail for location:', error);
        return ''; // Return empty string if there's an error
      }
    }
  }
}
</script>
