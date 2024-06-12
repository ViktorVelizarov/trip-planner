<template>
  <div class="vacation-itinerary-container w-full">
    <div class="left-section">
      <div v-if="loadingItinerary" class="loading-container">
        <div class="spinner"></div>
        <p>Loading itinerary...</p>
      </div>
      
      <!-- New section for displaying fetched destination data -->
      <div v-if="destinationData" class="destination-data">
        <div class="image-container">
          <img :src="destinationData.imageUrl" alt="Destination Image" class="destination-image" />
          <div class="info-container">
            <h1 class="destination-name">{{ destinationData.name }}</h1>
            <div class="bubbles-container">
              <div class="bubble">{{ formattedStartDate }} - {{ formattedEndDate }}</div>
              <div class="bubble">{{ peopleNumber }} People</div>
              <div v-for="preference in selectedPreferences" :key="preference" class="bubble">{{ preference }}</div>
            </div>
          </div>
        </div>
        <p class="destination-description">{{ destinationData.description }}</p>
      </div>

      <h1 v-else class="text-2xl font-semibold mb-4">{{ `${days} days vacation in ${destination}` }}</h1>
      
      <div v-if="!loadingItinerary" class="content-under-image">
        <ul class="mt-8">
          <li v-for="(day, index) in formattedItinerary" :key="index" class="mb-8">
            <h2 @click="showMap(index)" class="text-lg font-semibold mb-4 cursor-pointer">{{ day.title }}</h2>
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
      formattedItinerary: [],
      selectedDayIndex: null,
      showMapComponent: false,
      loadingItinerary: true,
      loadingMap: true,
      days: 0,
      destinationData: null, // New data property for destination data
      startDate: null, // New data property for start date
      endDate: null,   // New data property for end date
      peopleNumber: null, // New data property for number of people
    };
  },
  computed: {
    destination() {
      return this.$route.query.destination;
    },
    selectedPreferences() {
      return this.$route.query.selectedPreferences ? JSON.parse(this.$route.query.selectedPreferences) : [];
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
    },
    formattedStartDate() {
      return this.startDate ? this.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' ') : '';
    },
    formattedEndDate() {
      return this.endDate ? this.endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' ') : '';
    }
  },
  methods: {
    async fetchItinerary() {
      try {
        const { destination, selectedPreferences } = this.$route.query;
        const response = await fetch(`http://localhost:3000/api/GetItinerary?days=${this.days}&destination=${destination}&selectedPreferences=${selectedPreferences}`);
        const result = await response.text();
        const daysArray = result.split(/Day \d+:/).filter(str => str.trim() !== '');

        this.itinerary = daysArray.map(day => {
          const coordinatesRegex = /\[(.*?)\]/g;
          const namesRegex = /\{(.*?)\}/g;

          const coordinateMatches = day.match(coordinatesRegex);
          const nameMatches = day.match(namesRegex);

          const coordinates = coordinateMatches ? coordinateMatches.map(match => {
            const [latitude, longitude] = match.replace(/[\[\]]/g, '').split(',').map(parseFloat);
            return [latitude, longitude];
          }) : [];

          const names = nameMatches ? nameMatches.map(match => match.replace(/[\{\}]/g, '')) : [];
          
          const activities = day.replace(coordinatesRegex, '').replace(namesRegex, '').trim().split('\n').map(activity => activity.trim());

          return { activities, coordinates, names };
        });

        this.formattedItinerary = this.itinerary.map((day, index) => {
          const dayTitle = `Day ${index + 1} - ${day.activities[0]}`;
          const dayActivities = day.activities.slice(1);
          return { title: dayTitle, activities: dayActivities };
        });

        this.loadingItinerary = false;
      } catch (error) {
        console.error('Error:', error.message);
      }
    },
    async fetchDestinationData() {
      try {
        const { destination } = this.$route.query;
        const response = await fetch(`http://localhost:3000/api/GetLocationByName?destination=${destination}`);
        const data = await response.json();
        
        if (data.error) {
          console.error('Error fetching destination data:', data.error);
        } else {
          this.destinationData = data;
        }
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
    const preferences = this.$route.query.selectedPreferences;
    this.peopleNumber = this.$route.query.people;
    this.startDate = new Date(this.$route.query.selectedStartDate);
    this.endDate = new Date(this.$route.query.selectedEndDate);
    const timeDiff = this.endDate - this.startDate;
    this.days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    await this.fetchDestinationData();
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

.destination-data {
  margin-bottom: 20px;
}

.image-container {
  position: relative;
}

.destination-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  filter: brightness(80%);
}

.info-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding-left: 20px;
  width: calc(100% - 40px);
}

.destination-name {
  font-weight: 700;
  color: white;
  font-size: 60px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: transparent;
}

.bubbles-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.bubble {
  background-color: rgba(128, 128, 128, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 5px;
}

.content-under-image {
  padding-left: 20px;
}

.destination-description {
  color: black;
  padding-left: 40px;
  padding-top: 20px;
  margin-top: 10px;
}
</style>
