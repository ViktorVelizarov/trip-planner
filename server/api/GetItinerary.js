export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: `Make me a vacation itinerary for a ${query.days} day vacation in ${query.destination} with the names of destinations and places to eat for each day`,
        temperature: 1,
        max_tokens: 3886,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
    });


    const data = await response.json();
    const result = data.choices[0].text.trim();
    return result
  } catch (error) {
    console.error('Error:', error.message);
    return error.message
  }
})