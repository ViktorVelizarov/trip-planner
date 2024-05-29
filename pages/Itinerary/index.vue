<template>
  <div class="vacation-itinerary-container">
    <div class="left-section">
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
      <button @click="redirectToSearch" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        More activities
      </button>
    </div>

    <div class="right-section">
      <MapWithMarkers
        v-if="showMapComponent && itinerary"
        :coordinates-array="selectedDayCoordinates"
        :destination-names="selectedDayNames"
      />
      <MapWithMarkersAllDays
        v-else-if="itinerary"
        :coordinates-array="allDaysCoordinates"
        :destination-names="allDaysNames"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      return this.$route.query.selectedPreferences;
    },
    selectedDayCoordinates() {
      return this.itinerary && this.selectedDayIndex !== null ? this.itinerary[this.selectedDayIndex].coordinates : [];
    },
    selectedDayNames() {
      return this.itinerary && this.selectedDayIndex !== null ? this.itinerary[this.selectedDayIndex].names : [];
    },
    allDaysCoordinates() {
      return this.itinerary ? this.itinerary.map(day => day.coordinates) : [];
    },
    allDaysNames() {
      return this.itinerary ? this.itinerary.map(day => day.names) : [];
    }
  },
  methods: {
    async fetchItinerary() {
      try {
        const { days, destination, selectedPreferences } = this.$route.query;
        const response = await fetch(`http://localhost:3000/api/GetItinerary?days=${days}&destination=${destination}&selectedPreferences=${selectedPreferences}`);
        const result = await response.text();

        const coordinatesRegex = /\[(.*?)\]/g;
        const namesRegex = /\{(.*?)\}/g;
        const daysArray = result.split(/Day \d+:/).filter(str => str.trim() !== '');

        this.itinerary = daysArray.map(day => {
          const coordinateMatches = day.match(coordinatesRegex);
          const nameMatches = day.match(namesRegex);

          const coordinates = coordinateMatches ? coordinateMatches.map(match => {
            const [latitude, longitude] = match.replace(/[\[\]]/g, '').split(',').map(parseFloat);
            return [latitude, longitude];
          }) : [];

          const names = nameMatches ? nameMatches.map(match => match.replace(/[\{\}]/g, '')) : [];
          
          const activities = day.replace(coordinatesRegex, '').replace(namesRegex, '').trim().split('\n');
          
          return { activities, coordinates, names };
        });
        
        // Log coordinates array and names for each day
        this.itinerary.forEach(day => {
          console.log('Coordinates for Day:', day.coordinates);
          console.log('Names for Day:', day.names);
        });
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
    redirectToSearch() {
      this.$router.push({ path: '/searchLocations', query: { destination: this.destination } });
    },
    showMap(index) {
      if (this.selectedDayIndex === index) {
        this.showMapComponent = !this.showMapComponent;
      } else {
        this.hideMap();
        this.selectedDayIndex = index;
        this.showMapComponent = true;
      }
    },
    hideMap() {
      this.showMapComponent = false;
    }
  },
  watch: {
    selectedDayIndex(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.hideMap();
      }
    }
  },
  mounted() {
    this.fetchItinerary();
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.vacation-itinerary-container {
  display: flex;
  height: 100vh;
}

.left-section {
  width: 50%;
  padding-right: 20px;
  overflow-y: auto;
}

.right-section {
  width: 50%;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
}

.map-container {
  height: 100%;
  width: 100%;
}

.marker {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
</style>
