export default defineEventHandler(async (event) => {
    const { locationid } = event.context.params;
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationid}/details?key=4A5580EDD8C74C2EB25482F91262F807&language=en&currency=USD`;
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