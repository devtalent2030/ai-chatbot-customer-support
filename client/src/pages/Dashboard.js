import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function Dashboard() {
  const [stats, setStats] = useState({
    faqCount: 0,
    conversationCount: 0,
    userCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Get FAQ count
      const faqRes = await axios.get('/api/faq');
      const faqCount = faqRes.data.length;

      // 2. Get Conversation count
      const convoRes = await axios.get('/api/conversations');
      const conversationCount = convoRes.data.length;

      // 3. Get User count (if available)
      let userCount = 0;
      try {
        const userRes = await axios.get('/api/auth/users');
        userCount = userRes.data.length;
      } catch (error) {
        console.error('User fetch error:', error);
      }

      // Update state with counts
      setStats({ faqCount, conversationCount, userCount });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Welcome to the Admin Dashboard!
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  FAQs in Database
                </Typography>
                <Typography variant="h4">{stats.faqCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  Conversations in Database
                </Typography>
                <Typography variant="h4">{stats.conversationCount}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Registered Users
                </Typography>
                <Typography variant="h4">{stats.userCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;
