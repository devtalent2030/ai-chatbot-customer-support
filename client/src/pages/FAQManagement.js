import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function FAQManagement() {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Editing states
  const [editingId, setEditingId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState('');
  const [editingAnswer, setEditingAnswer] = useState('');

  // Confirm Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('/api/faq', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaqs(response.data);
    } catch (error) {
      console.error('Fetching FAQs error:', error);
    }
  };

  const createFAQ = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      await axios.post(
        '/api/faq',
        { question: newQuestion, answer: newAnswer, tags: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewQuestion('');
      setNewAnswer('');
      fetchFAQs();
    } catch (error) {
      console.error('Creating FAQ error:', error);
    }
  };

  const startEditing = (faq) => {
    setEditingId(faq._id);
    setEditingQuestion(faq.question);
    setEditingAnswer(faq.answer);
  };

  const updateFAQ = async (faqId) => {
    try {
      await axios.put(
        `/api/faq/${faqId}`,
        { question: editingQuestion, answer: editingAnswer, tags: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditingQuestion('');
      setEditingAnswer('');
      fetchFAQs();
    } catch (error) {
      console.error('Update FAQ error:', error);
    }
  };

  const confirmDeleteFAQ = (faqId) => {
    setFaqToDelete(faqId);
    setDeleteDialogOpen(true);
  };

  const deleteFAQ = async () => {
    if (!faqToDelete) return;
    try {
      await axios.delete(`/api/faq/${faqToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
      fetchFAQs();
    } catch (error) {
      console.error('Delete FAQ error:', error);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setFaqToDelete(null);
  };

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        FAQ Management
      </Typography>

      {/* CREATE NEW FAQ */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New FAQ
          </Typography>
          <Box
            component="form"
            onSubmit={createFAQ}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              marginBottom: 2
            }}
          >
            <TextField
              label="Question"
              variant="outlined"
              fullWidth
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <TextField
              label="Answer"
              variant="outlined"
              fullWidth
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <Button variant="contained" color="primary" type="submit">
              Add FAQ
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* SEARCH BAR */}
      <TextField
        label="Search FAQs"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 3 }}
      />
      <Divider sx={{ mb: 2 }} />

      {/* FAQ LIST */}
      <List>
        {filteredFAQs.map((faq) => (
          <Box key={faq._id} sx={{ marginBottom: 2 }}>
            {editingId === faq._id ? (
              <Card>
                <CardContent>
                  <TextField
                    label="Question"
                    variant="outlined"
                    fullWidth
                    value={editingQuestion}
                    onChange={(e) => setEditingQuestion(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Answer"
                    variant="outlined"
                    fullWidth
                    value={editingAnswer}
                    onChange={(e) => setEditingAnswer(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SaveIcon />}
                      onClick={() => updateFAQ(faq._id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<CancelIcon />}
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <ListItem
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: 1,
                  mb: 1,
                  boxShadow: 1
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {faq.question}
                    </Typography>
                  }
                  secondary={faq.answer}
                />
                <ListItemSecondaryAction>
                  <IconButton color="primary" onClick={() => startEditing(faq)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => confirmDeleteFAQ(faq._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </Box>
        ))}
      </List>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this FAQ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" onClick={deleteFAQ}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FAQManagement;
