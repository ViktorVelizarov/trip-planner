<template >
  <div class="mb-10 container mx-auto px-4 py-8 max-w-xl text-center mt-10  bg-blur-lg bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg backdrop-saturate-150 backdrop-contrast-75 backdrop-brightness-125 backdrop-opacity-50 border-opacity-25 rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-10">Plan your next adventure</h1>
    <hr class="mb-5">
    <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
      <div class="mb-8 text-left">
        <label for="destination" class="block text-lg font-medium text-gray-700 mb-4">What is your destination?</label>
        <input type="text" id="destination" v-model="formData.destination" required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-8 text-left">
        <label for="days" class="block text-lg font-medium text-gray-700 mb-4">Chose a date (max 10 days):</label>
        <DatePicker @update:selectedDateRange="updateSelectedDateRange"></DatePicker>
      </div>
      <div class="mb-8 text-left">
        <label class="block text-lg font-medium text-gray-700 mb-4">Select the kind of activities you want to do:</label>
        <div class="flex flex-wrap justify-center">
          <ToggleGroup type="multiple" v-model="selectedPreferences">
            <ToggleGroupItem value="Kid Friendly" class="bg-slate-300 m-1">
              Kid Friendly
            </ToggleGroupItem>
            <ToggleGroupItem value="Museums" class="bg-slate-300 m-1">
              Museums
            </ToggleGroupItem>
            <ToggleGroupItem value="Shopping" class="bg-slate-300 m-1">
              Shopping
            </ToggleGroupItem>
            <ToggleGroupItem value="Historical" class="bg-slate-300 m-1">
              Historical
            </ToggleGroupItem>
            <ToggleGroupItem value="Art & Cultural" class="bg-slate-300 m-1">
              Art & Cultural
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div class="mb-8 text-left">
        <label class="block text-lg font-medium text-gray-700 mb-4">How many people are going?</label>
        <div class="flex items-center">
          <button type="button" @click="decreasePeople" class="px-3 py-1 bg-gray-300 rounded-l">-</button>
          <span class="px-4">{{ formData.people }}</span>
          <button type="button" @click="increasePeople" class="px-3 py-1 bg-gray-300 rounded-r">+</button>
        </div>
      </div>
      <button type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit
      </button>
    </form>
  </div>
</template>

<script>


export default {
  data() {
    return {
      formData: {
        destination: '',
        selectedStartDate: null,
        selectedEndDate: null,
        selectedPreferences: [],
        people: 1 // Added people property
      }
    };
  },
  computed: {
    selectedPreferences: {
      get() {
        return this.formData.selectedPreferences;
      },
      set(value) {
        this.formData.selectedPreferences = value;
      }
    }
  },
  methods: {
    handleSubmit() {
      const { destination, selectedStartDate, selectedEndDate, selectedPreferences, people } = this.formData;

      console.log("Destination:", destination);
      console.log("Selected Start Date:", selectedStartDate);
      console.log("Selected End Date:", selectedEndDate);
      console.log("Selected Preferences:", selectedPreferences);
      console.log("Number of People:", people); // Log number of people

      // Navigate to /itinerary with submitted data
      this.$router.push({ path: '/itinerary', query: this.formData });
    },
    updateSelectedDateRange(start, end) {
      this.formData.selectedStartDate = start;
      this.formData.selectedEndDate = end;
    },
    increasePeople() {
      if (this.formData.people < 10) {
        this.formData.people++;
      }
    },
    decreasePeople() {
      if (this.formData.people > 1) {
        this.formData.people--;
      }
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
}
form {
  text-align: left;
}
</style>
