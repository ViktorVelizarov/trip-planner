<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold mb-4">{{ `${days} days vacation in ${destination}` }}</h1>
    <div v-if="itinerary">
      <ul class="mt-8">
        <li v-for="(day, index) in itinerary" :key="index" class="mb-8">
          <h2 @click="showMap(index)" class="text-lg font-semibold mb-4 cursor-pointer">Day {{ index + 1 }}</h2>
          <ul>
            <li v-for="activity in day.activities" :key="activity" class="ml-4">{{ activity }}</li>
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
    <!-- Conditional rendering of MapWithMarkers component -->
    <div v-if="showMapComponent">
      <MapWithMarkers :coordinatesArray="selectedDayCoordinates" />
    </div>
  </div>
</template>

<script>
import MapWithMarkers from '@/components/MapWithMarkers.vue';

export default {
  data() {
    return {
      coordinatesArray: [
        [2.3352, 48.8606],
        [2.3348, 48.8622],
        [2.3279, 48.86],
        [2.3522, 48.8606],
        [2.3509, 48.8529]
      ],

      itinerary: null,
      selectedDayIndex: null,
      showMapComponent: false
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
    },
    selectedDayCoordinates() {
      return this.itinerary && this.selectedDayIndex !== null ? this.itinerary[this.selectedDayIndex].coordinates : [];
    }
  },
  methods: {
    async fetchItinerary() {
      try {
        const { days, destination, selectedPreferences } = this.$route.query;
        const response = await fetch(`http://localhost:3000/api/GetItinerary?days=${days}&destination=${destination}&selectedPreferences=${selectedPreferences}`);
        const result = await response.text();

        const coordinatesRegex = /\[(.*?)\]/g;
        const daysArray = result.split(/Day \d+:/).filter(str => str.trim() !== '');

        this.itinerary = daysArray.map(day => {
          const matches = day.match(coordinatesRegex);
          const coordinates = matches ? matches.map(match => {
            const [latitude, longitude] = match.replace(/[\[\]]/g, '').split(',').map(parseFloat);
            return [latitude, longitude];
          }) : [];
          const activities = day.replace(coordinatesRegex, '').trim().split('\n');
          return { activities, coordinates };
        });
           // Log coordinates array for each day
    this.itinerary.forEach(day => {
      console.log('Coordinates for Day:', day.coordinates);
    });
      } catch (error) {
        console.error('Error:', error.message);
        // Handle error
      }
    },
    redirectToSearch() {
      // Redirect to searchLocations page with destination set to current destination
      this.$router.push({ path: '/searchLocations', query: { destination: this.destination } });
    },
    showMap(index) {
      this.selectedDayIndex = index;
      this.showMapComponent = true;
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
