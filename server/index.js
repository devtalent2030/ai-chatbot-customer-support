// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // loads .env into process.env

const app = express();
app.use(cors());
app.use(express.json());

// Basic route to test server is running
app.get('/', (req, res) => {
  res.send('Hello from AI Chatbot Server!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
