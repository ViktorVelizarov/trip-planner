<template>
  <div>
    <button class="bg-gray-500 rounded-md m-2 p-2" @click="handleSignOut">Sign Out</button>
    <button class="bg-gray-500 rounded-md m-2 p-2" @click="handleSignIn">Sign In</button>
  </div>
  <div>
    <h1 class="text-5xl font-bold mt-16">I'm ready for an adventure in...</h1>
    <button @click="executeApiRequest" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
      Click me for API request
    </button>
    <Alert></Alert>
    <!-- Cards for destinations -->
    <div class="grid grid-cols-3 gap-4 mt-4">
      <div v-for="destination in destinations" :key="destination.location_id" class="bg-white rounded-lg shadow-md p-4">
        <p>ID: {{ destination.location_id }}</p>
        <p>Name: {{ destination.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
console.log("test")

const url = 'https://api.content.tripadvisor.com/api/v1/location/search?key=4A5580EDD8C74C2EB25482F91262F807&searchQuery=Paris&language=en';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Referer: 'http://example.com'
  }
};
fetch(url, options)
  .then(res => res.json())
  .then(json => {
    const destinations = json; // Store the result in destinations variable
    console.log(destinations); // Log the destinations variable
  })
  .catch(err => console.error('error:' + err));
</script>
