<template>
  <div>
    <h1>Itinerary</h1>
    <ul v-if="itinerary">
      <li v-for="(day, index) in itinerary" :key="index">
        <h2>Day {{ index + 1 }}</h2>
        <ul>
          <li v-for="activity in day" :key="activity">{{ activity }}</li>
        </ul>
        <!-- Add an empty list item between each day -->
        <li v-if="index < itinerary.length - 1" class="empty-day"></li>
      </li>
    </ul>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itinerary: null
    };
  },
  mounted() {
    this.fetchItinerary();
  },
  methods: {
    async fetchItinerary() {
      try {
        const response = await fetch('http://localhost:3000/api/GetItinerary?days=4&destination=Paris');
        const result = await response.text();
        // Split the result by each "Day" and filter out empty strings
        this.itinerary = result.split(/Day \d+:/).filter(str => str.trim() !== '').map(day => day.trim().split('\n'));
      } catch (error) {
        console.error('Error:', error.message);
        // Handle error
      }
    }
  }
};
</script>

<style>
.empty-day {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}
</style>
