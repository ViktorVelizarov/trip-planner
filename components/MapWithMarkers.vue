<template>
  <div>
    <div :id="uniqueId" class="map-container"></div>
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
    }
  },
  data() {
    return {
      uniqueId: 'map-' + Math.random().toString(36).substring(7), // Generate unique ID for map container
      map: null
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNsdmk1aDV5djFjbGMyanFmODNkbG53ZHMifQ.X1lqvNcIbVceNnL6xJAnXA';
    const map = new mapboxgl.Map({
      container: this.uniqueId,  
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.coordinatesArray[0], // Set center as the first coordinate
      zoom: 12
    });

    const start = this.coordinatesArray[0];

    // function to add markers
    const addMarkers = (coordinates) => {
      coordinates.forEach((coord, index) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = `<span>${index + 1}</span>`;
        
        new mapboxgl.Marker(el)
          .setLngLat(coord)
          .addTo(map)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${coord[0]}, ${coord[1]}</h3>`));
      });
    };

    const getRoute = async (ends) => {
      let routeCoordinates = [];
      for (const end of ends) {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        routeCoordinates.push(...data.geometry.coordinates);
      }
      addMarkers(ends);

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      };

      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
      }
    };

    map.on('load', () => {
      getRoute(this.coordinatesArray.slice(0));

      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: start
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#3887be'
        }
      });
    });
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.marker {
  background-color: orange;
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
