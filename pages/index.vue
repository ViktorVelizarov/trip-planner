<template>
  <div>
    <h1 class="text-5xl font-bold mt-16">I'm ready for an adventure in...</h1>
    
    <button @click="executeApiRequest" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
      Click me for API request
    </button>

    <Alert></Alert>
  </div>
</template>

<script>
export default {
  methods: {
    async executeApiRequest() {
      const referer = 'http://localhost:3000/';
      const origin = 'http://localhost:3000/';
      const url = 'https://api.content.tripadvisor.com/api/v1/location/search?key=67894D21FC294F35BCE617AA12EBAB55&searchQuery=Amsterdam&language=en';
      const options = {method: 'GET', headers: {referer: referer , origin: origin, accept: 'application/json'}};

      try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        // You can handle the result as needed, e.g., update state or display in the Alert component
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
