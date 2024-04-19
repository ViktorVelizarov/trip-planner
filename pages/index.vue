<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold mb-4">Submit Itinerary Details</h1>
    <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
      <div class="mb-4">
        <label for="days" class="block text-sm font-medium text-gray-700 mb-3">Date (max 10 days):</label>
        <DatePicker @update:selectedDateRange="updateSelectedDateRange"></DatePicker>
      </div>
      <div class="mb-4">
        <label for="destination" class="block text-sm font-medium text-gray-700 mb-3">Destination:</label>
        <input type="text" id="destination" v-model="formData.destination" required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="destination" class="block text-sm font-medium text-gray-700 mb-3">Prefrances:</label>
            <ToggleGroup type="multiple">
              <ToggleGroupItem value="a" class="bg-slate-300 ">
                Kid Friendly
              </ToggleGroupItem>
              <ToggleGroupItem value="b" class="bg-slate-300 ">
                Museums
              </ToggleGroupItem>
              <ToggleGroupItem value="c" class="bg-slate-300 ">
                Shopping
              </ToggleGroupItem>
              <ToggleGroupItem value="d" class="bg-slate-300 ">
                Historical
              </ToggleGroupItem>
              <ToggleGroupItem value="e" class="bg-slate-300 ">
                Art & Cultural
              </ToggleGroupItem>
              <ToggleGroupItem value="f" class="bg-slate-300 ">
                Amusement Parks
              </ToggleGroupItem>
            </ToggleGroup>
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
        days: 4,
        destination: '',
        selectedStartDate: null,
        selectedEndDate: null
      }
    };
  },
  methods: {
    handleSubmit() {
      const { destination, selectedStartDate, selectedEndDate } = this.formData;

      console.log("Destination:", destination);
      console.log("Selected Start Date:", selectedStartDate);
      console.log("Selected End Date:", selectedEndDate);

      // Navigate to /itinerary with submitted data
      this.$router.push({ path: '/itinerary', query: this.formData });
    },
    updateSelectedDateRange(start, end) {
      this.formData.selectedStartDate = start;
      this.formData.selectedEndDate = end;
    }
  }
};
</script>
