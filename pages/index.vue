<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl text-center" >
    <h1 class="text-5xl md:text-6xl font-bold mb-6 mt-12">Your Next Journey, Optimized</h1>
    <p class="text-xl md:text-2xl mb-6">
      Build, personalize, and optimize your itineraries with our free AI trip planner. Designed for vacations, workations, and everyday adventures.
    </p>
    <button @click="goToVacationForm" class="bg-green-500 text-white py-3 px-6 text-lg md:text-xl rounded mb-6">
      Create a new trip
    </button>
    <img 
      src="https://tripplanner.ai/_next/image?url=%2Fillustrations%2Fhawaii-illustration.png&w=1080&q=75" 
      alt="Hawaii Illustration" 
      class="mx-auto mb-8 w-full md:w-3/4 px-4 md:px-0"
    />
    <p class="text-purple-600 mb-2">TRIP PLANNER AI</p>
    <h2 class="text-3xl md:text-4xl font-bold mb-4">The only tool you'll ever need!</h2>
    <p class="text-lg md:text-xl mb-8">
      Say goodbye to the stress of planning and hello to personalized recommendations, efficient itineraries, and seamless dining experiences.
    </p>
    <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
      <div class="bg-white shadow-md rounded p-4 flex-1">
        <h3 class="text-xl font-bold mb-2">Optimal Route Planning</h3>
        <p>Our AI algorithms analyze your preferences to craft the most efficient route, saving you time and effort.</p>
      </div>
      <div class="bg-white shadow-md rounded p-4 flex-1">
        <h3 class="text-xl font-bold mb-2">Personalize Your Adventure</h3>
        <p>Shape your journey by freely adding, editing, or deleting activities from your itinerary.</p>
      </div>
      <div class="bg-white shadow-md rounded p-4 flex-1">
        <h3 class="text-xl font-bold mb-2">Local Cuisine Recommendations</h3>
        <p>Discover local cuisines and hidden gems recommended by our AI, tailored to your taste buds.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    goToVacationForm() {
      this.$router.push('/vacationForm');
    }
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
