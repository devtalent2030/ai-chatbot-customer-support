require('dotenv').config();
const axios = require('axios');

async function listModels() {
  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,  // read from .env
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

listModels();
