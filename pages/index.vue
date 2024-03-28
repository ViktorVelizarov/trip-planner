<template>
  <div>
    <h1 class="text-5xl font-bold mt-16">I'm ready for an adventure in...</h1>

    <Alert></Alert>
    <!-- Cards for locations -->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div v-for="location in locations" :key="location.location_id" class="bg-white rounded-lg shadow-md p-4">
        <p>ID: {{ location.location_id }}</p>
        <p>Name: {{ location.name }}</p>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locations: [] // Initialize locations as an empty array
    }
  },
  async mounted() {
    try {
      const destination = "Paris"; // You can change this to dynamically set the destination
      const response = await fetch(`/api/GetLocations/${destination}`);
      const data = await response.json();
      this.locations = data.data || []; // Set the fetched locations to the data property
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }
}
</script>
