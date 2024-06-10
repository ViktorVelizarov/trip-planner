<template>
  <div class="vacation-itinerary-container  w-full">
    <div class="left-section">
      <div v-if="loadingItinerary" class="loading-container">
        <div class="spinner"></div>
        <p>Loading itinerary...</p>
      </div>
      <h1 v-else class="text-2xl font-semibold mb-4">{{ `${days} days vacation in ${destination}` }}</h1>
      <div v-if="!loadingItinerary">
        <ul class="mt-8">
          <li v-for="(day, index) in itinerary" :key="index" class="mb-8">
            <h2 @click="showMap(index)" class="text-lg font-semibold mb-4 cursor-pointer">Day {{ index + 1 }}</h2>
            <ul>
              <li v-for="activity in day.activities" :key="activity" class="ml-4">{{ activity }}</li>
            </ul>
          </li>
        </ul>
        <button @click="redirectToSearch" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          More activities
        </button>
      </div>
    </div>

    <div class="right-section">
      <div v-if="loadingMap" class="loading-container">
        <div class="spinner"></div>
        <p>Loading map...</p>
      </div>
      <div v-else>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      itinerary: null,
      selectedDayIndex: null,
      showMapComponent: false,
      loadingItinerary: true,
      loadingMap: true,
      days: 0, // Add days property
    };
  },
  computed: {
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
        const { destination, selectedPreferences } = this.$route.query;
        const response = await fetch(`http://localhost:3000/api/GetItinerary?days=${this.days}&destination=${destination}&selectedPreferences=${selectedPreferences}`);
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
        
        this.itinerary.forEach(day => {
          console.log('Coordinates for Day:', day.coordinates);
          console.log('Names for Day:', day.names);
        });

        this.loadingItinerary = false;
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
    },
    async fetchMapData() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.loadingMap = false;
    }
  },
  watch: {
    selectedDayIndex(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.hideMap();
      }
    }
  },
  async mounted() {
    // Calculate days between selectedStartDate and selectedEndDate
    const startDate = new Date(this.$route.query.selectedStartDate);
    const endDate = new Date(this.$route.query.selectedEndDate);
    const timeDiff = endDate - startDate;
    this.days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Calculate days including both start and end date

    await this.fetchItinerary();
    await this.fetchMapData();
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
  padding-left: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #7983ff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
