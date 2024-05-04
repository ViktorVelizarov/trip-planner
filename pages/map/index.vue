<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import '../node_modules/mapbox-gl/dist/mapbox-gl.css';

export default {
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidmlrdG9ydmVsIiwiYSI6ImNsdmk1aDV5djFjbGMyanFmODNkbG53ZHMifQ.X1lqvNcIbVceNnL6xJAnXA';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3376, 48.8606], // starting position
      zoom: 12
      
    });
    const start = [2.3376, 48.8606];

    // function to add markers
    function addMarkers(coordinates) {
      coordinates.forEach(coord => {
        new mapboxgl.Marker()
          .setLngLat(coord)
          .addTo(map)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${coord[0]}, ${coord[1]}</h3>`));
      });
    }

    // create a function to make a directions request
    async function getRoute(ends) {
      let routeCoordinates = [];
      for (const end of ends) {
        // make a directions request using cycling profile
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
          { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        routeCoordinates.push(...data.geometry.coordinates);
      }
      // Add markers after route coordinates are obtained
      addMarkers(ends);

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
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
      // add turn instructions here at the end
    }

    map.on('load', () => {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute([[2.328881, 48.865374], [2.120355, 48.804856], [2.339723, 48.846222], [2.315285, 48.855086], [2.351698, 48.838570]]);

      // Add starting point to the map
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

  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }
</style>
