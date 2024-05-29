export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    let promptText = `Make me a vacation itinerary for a ${query.days} day vacation in ${query.destination} with the names of destinations and places to eat for each day and with these preferences in mind:  `;
    if (query.selectedPreferences) {
      const preferencesArray = query.selectedPreferences.split(',');
      const preferencesText = preferencesArray.join(', ');
      promptText += preferencesText;
      promptText += '. Also at the end of each day can you provide the provide the coordinates [longtitude FIRST,then latitude] for each destination, example: Eiffel Tower [2.2945, 48.8584]. Put the cooridnates in [] and separate them by ,  .Also Each time you mention a name of a destination with coordinates please repeat that name  and put it in {} brackets after the original name so it looks like this - Aifel Tower {Aifel Tower}. If there are 7 coordinates for the given day I need 7 names of destinations';
    } else {
      promptText += 'No specific preferences';
      promptText += '. Also at the end of each day can you provide the provide the coordinates [longtitude FIRST,then latitude] for each destination, example: Eiffel Tower [2.2945, 48.8584]. Put the cooridnates in [] and separate them by ,  .Also Each time you mention a name of a destination with coordinates please repeat that name  and put it in {} brackets after the original name so it looks like this - Aifel Tower {Aifel Tower}. If there are 7 coordinates for the given day I need 7 names of destinations';
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
    console.log( result)
    return result
  } catch (error) {
    console.error('Error:', error.message);
    return error.message
  }
})