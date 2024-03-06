<template>
    <div>
      <h1>Restaurant Data</h1>
     
    </div>
  </template>
  
  <script>
   console.log("test")
   
   const url = 'https://api.content.tripadvisor.com/api/v1/location/189387/details?key=67894D21FC294F35BCE617AA12EBAB55&language=en&currency=USD';
   const options = {method: 'GET', headers: {accept: 'application/json'}};

  fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
  </script>
  