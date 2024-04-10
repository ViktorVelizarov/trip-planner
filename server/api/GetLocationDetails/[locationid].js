export default defineEventHandler(async (event) => {
    const { locationid } = event.context.params;
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationid}/details?key=${process.env.TRIPADVISOR_API_KEY}&language=en&currency=USD`;
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