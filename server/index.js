const express = require('express');
const http = require('http');           // <-- For manually creating an HTTP server
const { Server } = require('socket.io'); // <-- socket.io
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const { router: conversationRouter, initSocketIO } = require('./routes/conversations');
const faqRoutes = require('./routes/faq');
const { getAIResponse } = require('./utils/aiClient');
const FAQ = require('./models/FAQ'); // <-- Import FAQ model for database queries
const stringSimilarity = require('string-similarity');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// 2. Basic route
app.get('/', (req, res) => {
  res.send('Hello from AI Chatbot Server with MongoDB!');
});

// 3. Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/faq', faqRoutes);

// 4. Chat endpoint

app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;
  if (!userMessage) {
    return res.status(400).json({ reply: 'No user message provided' });
  }
  try {
    // 1) Fetch all FAQs
    const allFAQs = await FAQ.find();
    const userText = userMessage.trim().toLowerCase();
    // 2) Build an array of just the FAQ questions
    const faqQuestions = allFAQs.map(f => f.question.toLowerCase());
    // 3) Find best match
    const bestMatch = stringSimilarity.findBestMatch(userText, faqQuestions);
    // e.g., if bestMatch.bestMatch.rating > 0.6 = we consider it "good enough"
    if (bestMatch.bestMatch.rating > 0.6) {
      const matchedIndex = bestMatch.bestMatchIndex;
      const matchedFAQ = allFAQs[matchedIndex];
      return res.json({ reply: matchedFAQ.answer });
    }
    // 4) fallback to GPT
    const aiReply = await getAIResponse(userMessage);
    return res.json({ reply: aiReply });
  } catch (error) {
    console.error('Chat Error:', error);
    return res.status(500).json({ reply: 'An error occurred while processing your message.' });
  }
});


// 5. Create an HTTP server from your Express app
const server = http.createServer(app);

// 6. Create a Socket.io server, attach it to `server`
const io = new Server(server, {
  cors: {
    origin: "*", 
  }
});

// 7. Listen for new socket connections
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// 8. Initialize socket in conversation routes
initSocketIO(io);
app.use('/api/conversations', conversationRouter);

// 9. Start your server on port 3001 (or env)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
