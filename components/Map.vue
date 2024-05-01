<template> 
<div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNsdmk1aDV5djFjbGMyanFmODNkbG53ZHMifQ.X1lqvNcIbVceNnL6xJAnXA';

export default {
    props: ['modelValue'],
    mounted() {    
        const { lng, lat, zoom, bearing, pitch } = this.modelValue;
  const map = new mapboxgl.Map({
    container: this.$refs.mapContainer,
    style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
    center: [lng, lat],
    bearing,
    pitch,
    zoom,
  });
  const updateLocation = () =>
  this.$emit('update:modelValue', this.getLocation());

map.on('move', updateLocation);
map.on('zoom', updateLocation);
map.on('rotate', updateLocation);
map.on('pitch', updateLocation);
  this.map = map;
},
methods: {
  getLocation() {
    return {
      ...this.map.getCenter(),
      bearing: this.map.getBearing(),
      pitch: this.map.getPitch(),
      zoom: this.map.getZoom(),
    }
  }
},
};
</script>

<style>
.map-container {
  flex: 1;
}
</style>