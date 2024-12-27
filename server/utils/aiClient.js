const axios = require('axios');

async function getAIResponse(message) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', // Make sure it's spelled exactly like in listModels
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Response Error:', error);
    return 'Sorry, something went wrong when contacting the AI.';
  }
}

module.exports = { getAIResponse };
