<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold mb-4">Submit Itinerary Details</h1>
    <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
      <div class="mb-4">
        <label for="days" class="block text-sm font-medium text-gray-700">Number of Days:</label>
        <input type="number" id="days" v-model="formData.days" required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="destination" class="block text-sm font-medium text-gray-700">Destination:</label>
        <input type="text" id="destination" v-model="formData.destination" required
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
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
        days: null,
        destination: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      // Navigate to /itinerary with submitted data
      this.$router.push({ path: '/itinerary', query: this.formData });
    }
  }
};
</script>
