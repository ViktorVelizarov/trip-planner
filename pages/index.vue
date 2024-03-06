<template>
  <MainLayout>
    <div>
      <h1 class="text-red-500">Restaurant Data</h1>
      <Alert></Alert>
    </div>
  </MainLayout>
  </template>
  
  <script>
  import MainLayout from '~/layouts/MainLayout.vue';
   
   const url = 'https://api.content.tripadvisor.com/api/v1/location/189387/details?key=67894D21FC294F35BCE617AA12EBAB55&language=en&currency=USD';
   const options = {method: 'GET', headers: {accept: 'application/json'}};

  fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
  </script>
  