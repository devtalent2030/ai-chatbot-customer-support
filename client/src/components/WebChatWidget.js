import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Divider,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

function WebChatWidget() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1) Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    // 2) Call /api/chat
    try {
      const response = await axios.post('/api/chat', { userMessage: userInput });
      const aiReply = response.data.reply || 'No reply';

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error contacting AI. Please try again.' }
      ]);
    }

    // 3) Clear input
    setUserInput('');
  };

  // Toggle the widget open/closed
  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 84,
        zIndex: 9999,
        // We keep a default width in case user never resizes:
        width: 360,
      }}
    >
      {isOpen ? (
        <Paper
          elevation={8}
          sx={{
            // Resizing & transparency:
            resize: 'both',
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            // Minimum & maximum constraints:
            minWidth: '280px',
            minHeight: '200px',
            maxWidth: '600px',
            maxHeight: '80vh',

            display: 'flex',
            flexDirection: 'column',
            // Set a default height so it doesn’t collapse too small:
            height: 400
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              p: 1,
              cursor: 'move', // hints user they can drag/resize edges
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AI Chat
            </Typography>
            <IconButton
              size="small"
              onClick={handleToggleOpen}
              sx={{ color: 'primary.contrastText' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Message List */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                  color: 'text.primary',
                  p: 1.2,
                  borderRadius: 2,
                  maxWidth: '70%',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {msg.sender.toUpperCase()}
                </Typography>
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
          </Box>

          {/* Input Area */}
          <Divider />
          <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Type a message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleToggleOpen}
          sx={{ borderRadius: 2 }}
        >
          Chat
        </Button>
      )}
    </Box>
  );
}

export default WebChatWidget;
