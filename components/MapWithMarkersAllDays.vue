<template>
    <div class="map-container">
      <div :id="uniqueId" class="map"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import '../node_modules/mapbox-gl/dist/mapbox-gl.css';
  
  export default {
    props: {
      coordinatesArray: {
        type: Array,
        required: true
      },
      destinationNames: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        uniqueId: 'map-' + Math.random().toString(36).substring(7), // Generate unique ID for map container
        map: null
      };
    },
    mounted() {
      console.log("All days coordinates:");
      console.log(this.coordinatesArray);
  
      mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNsdmk1aDV5djFjbGMyanFmODNkbG53ZHMifQ.X1lqvNcIbVceNnL6xJAnXA';
      this.map = new mapboxgl.Map({
        container: this.uniqueId,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 12
      });
  
      const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
      
      const addMarkers = (coordinates, names, dayIndex) => {
        const color = colors[dayIndex % colors.length];
        coordinates.forEach((coord, index) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor = color;
          el.innerHTML = `<span>${dayIndex + 1}</span>`;
  
          new mapboxgl.Marker(el)
            .setLngLat(coord)
            .addTo(this.map)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${names[index]}</h3><p>${coord[1]}, ${coord[0]}</p>`));
        });
      };
  
      this.coordinatesArray.forEach((coordinates, dayIndex) => {
        addMarkers(coordinates, this.destinationNames[dayIndex], dayIndex);
      });
  
      this.fitMapToBounds();
    },
    methods: {
      fitMapToBounds() {
        const bounds = new mapboxgl.LngLatBounds();
  
        this.coordinatesArray.forEach(coordinates => {
          coordinates.forEach(coord => {
            bounds.extend(coord);
          });
        });
  
        this.map.fitBounds(bounds, {
          padding: 20
        });
      }
    }
  };
  </script>
  
  <style>
  body {
    margin: 0;
    padding: 0;
  }
  
  .map-container {
    height: 100vh; /* Full height */
  }
  
  .map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
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
  