<template>
    <div id="layout">
        <div id="sidebar">Longitude: {{ location.lng.toFixed(4) }} | Latitude: {{ location.lat.toFixed(4) }} | Zoom: {{ location.zoom.toFixed(2) }} | <template v-if="location.bearing">
  Bearing: {{ location.bearing.toFixed(2) }} |
</template>
<template v-if="location.pitch">
  Pitch: {{ location.pitch.toFixed(2) }} |
</template></div>
    <Map v-model="location" />
    </div>
  </template>
  
  <script>
  import '../node_modules/mapbox-gl/dist/mapbox-gl.css';

  export default {
    components: {
      Map
    },
    data: () => ({
  location: {
    lng: -71.224518,
    lat: 42.213995,
    bearing: 0,
    pitch: 0,
    zoom: 9
  }
}),
  };
</script>
  
  <style>
    #layout {
      flex: 1;
      display: flex;
      position: relative;
    }

    #sidebar {
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  margin: 12px;
  border-radius: 4px;
}
  </style>