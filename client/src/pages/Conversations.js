import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  TextField,
  CircularProgress,
  Pagination,
} from '@mui/material';

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const conversationsPerPage = 5;

  const token = localStorage.getItem('token'); // Get token for authentication

  // Use useCallback to memoize fetchConversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data); // Set the fetched conversations in the state
      setFilteredConversations(res.data); // Initially, filteredConversations matches conversations
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();

    const socket = io('http://localhost:3001');

    socket.on('newConversation', (data) => {
      console.log('Real-time new conversation:', data);
      setConversations((prev) => [...prev, data]);
      setFilteredConversations((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchConversations]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = conversations.filter((conv) => {
      const messagesMatch = conv.messages.some((msg) =>
        msg.text.toLowerCase().includes(query)
      );
      const platformMatch = conv.platform.toLowerCase().includes(query);
      return messagesMatch || platformMatch;
    });

    setFilteredConversations(filtered);
  };

  // Handle pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Paginate conversations
  const indexOfLastConversation = currentPage * conversationsPerPage;
  const indexOfFirstConversation = indexOfLastConversation - conversationsPerPage;
  const currentConversations = filteredConversations.slice(
    indexOfFirstConversation,
    indexOfLastConversation
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Conversations
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Manage and view real-time conversations here.
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Conversations"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ marginBottom: 3 }}
      />

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Conversation List */}
          <Grid container spacing={2}>
            {currentConversations.map((conv) => (
              <Grid item xs={12} key={conv._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Platform: {conv.platform}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Conversation ID:</strong> {conv._id}
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                    <Box>
                      {conv.messages.map((msg, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            marginBottom: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="body1">
                            <strong>{msg.sender}:</strong> {msg.text}
                          </Typography>
                          <Chip
                            label={new Date(msg.timestamp).toLocaleString()}
                            size="small"
                            sx={{ marginLeft: 1 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* No Results Message */}
          {filteredConversations.length === 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              No conversations match your search.
            </Typography>
          )}

          {/* Pagination */}
          {filteredConversations.length > conversationsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              <Pagination
                count={Math.ceil(filteredConversations.length / conversationsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Conversations;
