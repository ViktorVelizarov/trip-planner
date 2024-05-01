<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold mb-4">{{ `${days} days vacation in ${destination}` }}</h1>
    <div v-if="itinerary">
      <ul class="mt-8">
        <li v-for="(day, index) in itinerary" :key="index" class="mb-8">
          <h2 class="text-lg font-semibold mb-4">Day {{ index + 1 }}</h2>
          <ul>
            <li v-for="activity in day" :key="activity" class="ml-4">{{ activity }}</li>
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <!-- "More activities" button -->
    <button @click="redirectToSearch" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
      More activities
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itinerary: null
    };
  },
  computed: {
    days() {
      return this.$route.query.days;
    },
    destination() {
      return this.$route.query.destination;
    },
    selectedPreferences() {
      return this.$route.query.selectedPreferences; // Add computed property for selectedPreferences
    }
  },
  methods: {
    async fetchItinerary() {
      try {
        const { days, destination, selectedPreferences } = this.$route.query; // Include selectedPreferences in the query
        const response = await fetch(`http://localhost:3000/api/GetItinerary?days=${days}&destination=${destination}&selectedPreferences=${selectedPreferences}`);
        const result = await response.text();
        this.itinerary = result.split(/Day \d+:/).filter(str => str.trim() !== '').map(day => day.trim().split('\n'));
      } catch (error) {
        console.error('Error:', error.message);
        // Handle error
      }
    },
    redirectToSearch() {
      // Redirect to searchLocations page with destination set to current destination
      this.$router.push({ path: '/searchLocations', query: { destination: this.destination } });
    }
  },
  mounted() {
    this.fetchItinerary();
  }
};
</script>


<style>
/* No need for empty-day styling as it's not used in this version */
</style>
