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
      map: null,
      popups: [] // Array to store references to all popups
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
        el.className = 'marker rounded-full w-8 h-8 flex justify-center items-center text-white text-sm font-bold';
        el.style.backgroundColor = color;
        el.innerHTML = `<span>${dayIndex + 1}</span>`;

        const popup = new mapboxgl.Popup({
          closeButton: true, // Hide default close button
          closeOnClick: true, // Keep open on click
          anchor: 'bottom' // Anchor to bottom of marker
        }).setHTML(`
          <div class="popup-content">
            
            <h3>${names[index]}</h3>
            <p>${coord[1]}, ${coord[0]}</p>
          </div>
        `);

        this.popups.push(popup); // Add popup to the array

        const marker = new mapboxgl.Marker(el)
          .setLngLat(coord)
          .addTo(this.map)
          .setPopup(popup);

        el.addEventListener('click', async () => {
          // Close all other popups
          this.popups.forEach(p => p.remove());

          this.loading = true; // Show loading animation

          const response = await fetch(`/api/GetLocationByName?destination=${encodeURIComponent(names[index])}&lat=${coord[1]}&long=${coord[0]}`);
          const data = await response.json();

          // Get the first sentence of the description
          const firstSentence = data.description.split('.')[0];

          // Construct popup content with Tailwind CSS classes
          const content = `
            <div class="popup-wrapper rounded-md overflow-hidden">
             
              <div class="popup-image-wrapper h-48 bg-cover bg-center" style="background-image: url(${data.imageUrl});"></div>
              <div class="popup-text p-4 text-black">
                <h3 class="text-xl font-bold">${data.name}</h3>
                <p>${firstSentence}</p>
              </div>
            </div>
          `;

          popup.setHTML(content);
          popup.addTo(this.map); // Open the clicked popup
          this.loading = false; // Hide loading animation once loaded

          // Center the map around the popup
          this.map.flyTo({
            center: coord,
            zoom: 15
          });
        });
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
  height: 100vh; /* Half height of the viewport */
  width: 48vw; /* Half width of the viewport */
  position: relative; /* Ensure proper positioning */
}

.map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
