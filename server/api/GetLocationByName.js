
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
    // Fetch data from the API
    const response = await fetch(url, options);
    const data = await response.json();

    // Check if the response contains results
    if (data && data.data && data.data.length > 0) {
      // Return the first destination object
      return data.data[0];
    } else {
      return { error: 'No destinations found' };
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    return { error: 'Error fetching data' };
  }
});
