import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import FAQManagement from './pages/FAQManagement';
import Conversations from './pages/Conversations';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WebChatWidget from './components/WebChatWidget';
import theme from './theme'; // Create a basic theme file

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is logged in on initial render
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', height: '100vh' }}>
          {isAuthenticated && <Sidebar />} {/* Show Sidebar only if logged in */}
          <div style={{ flexGrow: 1 }}>
            {isAuthenticated && <Header />} {/* Show Header only if logged in */}
            <Routes>
              {/* Login route */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  )
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/faq"
                element={isAuthenticated ? <FAQManagement /> : <Navigate to="/" />}
              />
              <Route
                path="/conversations"
                element={isAuthenticated ? <Conversations /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </div>
        <WebChatWidget />
      </Router>
    </ThemeProvider>
  );
}

export default App;
