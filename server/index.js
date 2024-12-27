const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const faqRoutes = require('./routes/faq');
const { getAIResponse } = require('./utils/aiClient'); // Import the AI client function

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from AI Chatbot Server with MongoDB!');
});

// Mount your custom routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/faq', faqRoutes);

// Add the /api/chat route
app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;

  // Handle missing userMessage in the request body
  if (!userMessage) {
    return res.status(400).json({ reply: 'No user message provided' });
  }

  try {
    // Call the AI client to process the message and get a reply
    const aiReply = await getAIResponse(userMessage);
    return res.json({ reply: aiReply }); // Respond with the AI's reply
  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({ reply: 'An error occurred while processing your message.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
