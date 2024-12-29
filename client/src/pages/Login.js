import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider
} from '@mui/material';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate(); // Navigate between routes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear any existing error messages

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { userId } = response.data;

      localStorage.setItem('userId', userId); // Save the user ID in local storage
      setIsAuthenticated(true); // Update authentication state
      navigate('/dashboard'); // Redirect to the Dashboard page
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Admin Login
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth size="large">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
