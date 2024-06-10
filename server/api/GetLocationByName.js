
import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {
  // Extract query parameters
  const { destination, lat, long } = getQuery(event)

  // Check if the required query parameters are provided
  if (!destination || !lat || !long) {
    return { error: 'Missing required query parameters: destination, lat, long' };
  }

  // Construct the URL with the query parameters
  const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${encodeURIComponent(destination)}&latLong=${encodeURIComponent(lat)},${encodeURIComponent(long)}&language=en`;
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Referer: 'http://example.com' 
    }
  };

  try {
    // Fetch data from the initial search API
    const searchResponse = await fetch(url, options);
    const searchData = await searchResponse.json();

    // Check if the response contains results
    if (searchData && searchData.data && searchData.data.length > 0) {
      const firstResult = searchData.data[0];
      const locationId = firstResult.location_id;
      const name = firstResult.name;

      // Fetch location details using the location_id
      const detailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${process.env.TRIPADVISOR_API_KEY}&language=en`;
      const detailsResponse = await fetch(detailsUrl, options);
      const detailsData = await detailsResponse.json();
      const description = detailsData.description || 'No description available';

      // Fetch location photos using the location_id
      const photosUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${process.env.TRIPADVISOR_API_KEY}&language=en`;
      const photosResponse = await fetch(photosUrl, options);
      const photosData = await photosResponse.json();
      const imageUrl = photosData.data && photosData.data[0] && photosData.data[0].images && photosData.data[0].images.medium.url
        ? photosData.data[0].images.medium.url
        : 'No image available';

      // Combine the relevant data and return it
      return {
        name,
        description,
        imageUrl
      };
    } else {
      return { error: 'No destinations found' };
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    return { error: 'Error fetching data' };
  }
});
