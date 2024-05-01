export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    let promptText = `Make me a vacation itinerary for a ${query.days} day vacation in ${query.destination} with the names of destinations and places to eat for each day and with these preferences in mind:  `;
    if (query.selectedPreferences) {
      const preferencesArray = query.selectedPreferences.split(',');
      const preferencesText = preferencesArray.join(', ');
      promptText += preferencesText;
      promptText += '. Also at the end of each day give me the longitude and latitude coordinates foe each destination of the day.';
    } else {
      promptText += 'No specific preferences.';
      promptText += '. Also at the end of each day give me the longitude and latitude coordinates foe each destination of the day.';
    }
    console.log(promptText);

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: promptText,
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