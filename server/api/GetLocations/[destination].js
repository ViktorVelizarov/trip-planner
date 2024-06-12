export default defineEventHandler(async (event) => {
    const { destination } = event.context.params;
    const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${destination}&category=attractions&language=en`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Referer: 'http://example.com'
      }
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data; 
  
});